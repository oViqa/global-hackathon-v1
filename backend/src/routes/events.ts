import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { calculateDistance, isInGermany } from '../utils/geo';

const router = express.Router();
const prisma = new PrismaClient();

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

    const events = await prisma.event.findMany({
      where: {
        status: status as any
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        attendances: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      },
      take: parseInt(limit as string)
    });

    const userLat = lat ? parseFloat(lat as string) : null;
    const userLng = lng ? parseFloat(lng as string) : null;
    const maxRadius = parseInt(radius as string);

    const eventsWithDistance = events.map(event => {
      let distance = null;
      if (userLat && userLng) {
        distance = calculateDistance(
          userLat,
          userLng,
          event.locationLat,
          event.locationLng
        );
      }

      const puddingPreviews = event.attendances
        .slice(0, 5)
        .map(a => a.puddingPhoto);

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        location: {
          lat: event.locationLat,
          lng: event.locationLng
        },
        city: event.city,
        state: event.state,
        startTime: event.startTime,
        endTime: event.endTime,
        attendeeLimit: event.attendeeLimit,
        attendeeCount: event.attendances.length,
        status: event.status,
        organizer: event.organizer,
        puddingPreviews,
        distance
      };
    });

    const filteredEvents = userLat && userLng
      ? eventsWithDistance.filter(e => e.distance === null || e.distance <= maxRadius)
      : eventsWithDistance;

    res.json({
      events: filteredEvents,
      total: filteredEvents.length
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).userId;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        attendances: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    let userAttendance = null;
    if (userId) {
      userAttendance = await prisma.attendance.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId: id
          }
        }
      });
    }

    const attendees = event.attendances.map(a => ({
      id: a.user.id,
      name: a.user.name,
      avatarUrl: a.user.avatarUrl,
      puddingPhoto: a.puddingPhoto,
      puddingName: a.puddingName,
      status: a.status
    }));

    res.json({
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        location: {
          lat: event.locationLat,
          lng: event.locationLng
        },
        city: event.city,
        state: event.state,
        address: event.address,
        startTime: event.startTime,
        endTime: event.endTime,
        attendeeLimit: event.attendeeLimit,
        status: event.status,
        organizer: event.organizer,
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

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        locationLat: data.location.lat,
        locationLng: data.location.lng,
        city: data.city,
        state: data.state,
        address: data.address,
        startTime,
        endTime,
        attendeeLimit: data.attendeeLimit,
        organizerId: req.userId!
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    res.status(201).json({ event });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.organizerId !== req.userId) {
      return res.status(403).json({ error: 'Only organizer can edit event' });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: req.body,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    res.json({ event: updatedEvent });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.organizerId !== req.userId) {
      return res.status(403).json({ error: 'Only organizer can delete event' });
    }

    await prisma.event.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    res.json({ message: 'Event cancelled successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
