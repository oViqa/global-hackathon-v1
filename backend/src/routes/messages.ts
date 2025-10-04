import express from 'express';
import { z } from 'zod';
import { Event } from '../models/Event';
import { Attendance, AttendanceStatus } from '../models/Attendance';
import { Message } from '../models/Message';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

const createMessageSchema = z.object({
  content: z.string().min(1).max(500),
  imageUrl: z.string().optional()
});

router.get('/events/:eventId/messages', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { eventId } = req.params;
    const { limit = '50', before } = req.query;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const isOrganizer = event.organizerId.toString() === req.userId;

    if (!isOrganizer) {
      const attendance = await Attendance.findOne({
        userId: req.userId!,
        eventId
      });

      if (!attendance || attendance.status !== AttendanceStatus.APPROVED) {
        return res.status(403).json({ error: 'Not authorized to view messages' });
      }
    }

    const query: any = { eventId };
    if (before) {
      query._id = { $lt: before };
    }

    const messages = await Message.find(query)
      .populate('userId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    res.json({
      messages: messages.reverse(),
      hasMore: messages.length === parseInt(limit as string)
    });
  } catch (error) {
    next(error);
  }
});

router.post('/events/:eventId/messages', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { eventId } = req.params;
    const data = createMessageSchema.parse(req.body);

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const isOrganizer = event.organizerId.toString() === req.userId;

    if (!isOrganizer) {
      const attendance = await Attendance.findOne({
        userId: req.userId!,
        eventId
      });

      if (!attendance || attendance.status !== AttendanceStatus.APPROVED) {
        return res.status(403).json({ error: 'Not authorized to send messages' });
      }
    }

    const message = await Message.create({
      content: data.content,
      imageUrl: data.imageUrl,
      userId: req.userId!,
      eventId
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('userId', 'name avatarUrl');

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    next(error);
  }
});

export default router;
