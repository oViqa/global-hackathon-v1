import express from 'express';
import { Event } from '../models/Event';
import { Attendance, AttendanceStatus } from '../models/Attendance';
import { authenticate, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post(
  '/events/:eventId/join',
  authenticate,
  upload.single('puddingPhoto'),
  async (req: AuthRequest, res, next) => {
    try {
      const { eventId } = req.params;
      const { puddingName, puddingDesc } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: 'Pudding photo is required' });
      }

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const attendanceCount = await Attendance.countDocuments({
        eventId,
        status: { $in: [AttendanceStatus.PENDING, AttendanceStatus.APPROVED] }
      });

      if (attendanceCount >= event.attendeeLimit) {
        return res.status(400).json({ error: 'Event is full' });
      }

      const existingAttendance = await Attendance.findOne({
        userId: req.userId!,
        eventId
      });

      if (existingAttendance) {
        return res.status(409).json({ error: 'Already joined this event' });
      }

      const attendance = await Attendance.create({
        userId: req.userId!,
        eventId,
        puddingPhoto: `/uploads/${req.file.filename}`,
        puddingName,
        puddingDesc
      });

      res.status(201).json({ attendance });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/events/:eventId/attendances',
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const { eventId } = req.params;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.organizerId.toString() !== req.userId) {
        return res.status(403).json({ error: 'Only organizer can view attendances' });
      }

      const attendances = await Attendance.find({ eventId })
        .populate('userId', 'name avatarUrl')
        .sort({ joinedAt: -1 });

      const grouped = {
        pending: attendances.filter(a => a.status === AttendanceStatus.PENDING),
        approved: attendances.filter(a => a.status === AttendanceStatus.APPROVED),
        rejected: attendances.filter(a => a.status === AttendanceStatus.REJECTED)
      };

      res.json(grouped);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/events/:eventId/attendances/:attendanceId',
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const { eventId, attendanceId } = req.params;
      const { status } = req.body;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.organizerId.toString() !== req.userId) {
        return res.status(403).json({ error: 'Only organizer can update attendance' });
      }

      const updateData: any = { status };
      if (status === AttendanceStatus.APPROVED) {
        updateData.approvedAt = new Date();
      }

      const attendance = await Attendance.findByIdAndUpdate(
        attendanceId,
        { $set: updateData },
        { new: true }
      );

      res.json({ attendance });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/events/:eventId/attendance',
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const { eventId } = req.params;

      await Attendance.findOneAndUpdate(
        {
          userId: req.userId!,
          eventId
        },
        { $set: { status: AttendanceStatus.LEFT } }
      );

      res.json({ message: 'You have left the event' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
