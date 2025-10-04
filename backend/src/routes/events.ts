import express from 'express';
import { z } from 'zod';
import { Event, EventStatus } from '../models/Event';
import { Attendance, AttendanceStatus } from '../models/Attendance';
import { authenticate, AuthRequest } from '../middleware/auth';
import { calculateDistance, isInGermany } from '../utils/geo';

const router = express.Router();

const createEventSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number()
  }),
  city: z.string(),
  state: z.string(),
  address: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  attendeeLimit: z.number().min(5).max(100)
});

router.get('/', async (req, res, next) => {
  try {
    const {
      lat,
      lng,
      radius = '100000',
      status = 'UPCOMING',
      limit = '50'
    } = req.query;

    const query: any = {
      status: status as EventStatus
    };

    // If location provided, filter by radius
    if (lat && lng) {
      const userLat = parseFloat(lat as string);
      const userLng = parseFloat(lng as string);
      const maxRadius = parseInt(radius as string);

      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [userLng, userLat]
          },
          $maxDistance: maxRadius
        }
      };
    }

    const events = await Event.find(query)
      .populate('organizerId', 'name avatarUrl')
      .limit(parseInt(limit as string))
      .sort({ startTime: 1 });

    // Get attendance info for each event
    const eventsWithAttendance = await Promise.all(
      events.map(async (event) => {
        const attendances = await Attendance.find({
          eventId: event._id,
          status: AttendanceStatus.APPROVED
        }).select('puddingPhoto');

        const puddingPreviews = attendances.slice(0, 5).map(a => a.puddingPhoto);

        let distance = null;
        if (lat && lng) {
          const userLat = parseFloat(lat as string);
          const userLng = parseFloat(lng as string);
          distance = calculateDistance(
            userLat,
            userLng,
            event.location.coordinates[1],
            event.location.coordinates[0]
          );
        }

        return {
          id: event._id,
          title: event.title,
          description: event.description,
          location: {
            lat: event.location.coordinates[1],
            lng: event.location.coordinates[0]
          },
          city: event.city,
          state: event.state,
          startTime: event.startTime,
          endTime: event.endTime,
          attendeeLimit: event.attendeeLimit,
          attendeeCount: attendances.length,
          status: event.status,
          organizer: event.organizerId,
          puddingPreviews,
          distance
        };
      })
    );

    res.json({
      events: eventsWithAttendance,
      total: eventsWithAttendance.length
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).userId;

    const event = await Event.findById(id).populate('organizerId', 'name avatarUrl');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const attendances = await Attendance.find({
      eventId: id,
      status: AttendanceStatus.APPROVED
    }).populate('userId', 'name avatarUrl');

    let userAttendance = null;
    if (userId) {
      userAttendance = await Attendance.findOne({
        userId,
        eventId: id
      });
    }

    const attendees = attendances.map(a => ({
      id: (a.userId as any)._id,
      name: (a.userId as any).name,
      avatarUrl: (a.userId as any).avatarUrl,
      puddingPhoto: a.puddingPhoto,
      puddingName: a.puddingName,
      status: a.status
    }));

    res.json({
      event: {
        id: event._id,
        title: event.title,
        description: event.description,
        location: {
          lat: event.location.coordinates[1],
          lng: event.location.coordinates[0]
        },
        city: event.city,
        state: event.state,
        address: event.address,
        startTime: event.startTime,
        endTime: event.endTime,
        attendeeLimit: event.attendeeLimit,
        status: event.status,
        organizer: event.organizerId,
        attendees,
        userAttendance
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const data = createEventSchema.parse(req.body);

    if (!isInGermany(data.location.lat, data.location.lng)) {
      return res.status(400).json({ error: 'Event must be located in Germany' });
    }

    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    const now = new Date();

    if (startTime <= new Date(now.getTime() + 60 * 60 * 1000)) {
      return res.status(400).json({
        error: 'Event must start at least 1 hour in the future'
      });
    }

    if (endTime <= startTime) {
      return res.status(400).json({
        error: 'End time must be after start time'
      });
    }

    const event = await Event.create({
      title: data.title,
      description: data.description,
      location: {
        type: 'Point',
        coordinates: [data.location.lng, data.location.lat]
      },
      city: data.city,
      state: data.state,
      address: data.address,
      startTime,
      endTime,
      attendeeLimit: data.attendeeLimit,
      organizerId: req.userId!
    });

    const populatedEvent = await Event.findById(event._id).populate('organizerId', 'name avatarUrl');

    res.status(201).json({ event: populatedEvent });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.organizerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only organizer can edit event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: req.body, updatedAt: new Date() },
      { new: true }
    ).populate('organizerId', 'name avatarUrl');

    res.json({ event: updatedEvent });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.organizerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only organizer can delete event' });
    }

    await Event.findByIdAndUpdate(id, {
      status: EventStatus.CANCELLED,
      updatedAt: new Date()
    });

    res.json({ message: 'Event cancelled successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
