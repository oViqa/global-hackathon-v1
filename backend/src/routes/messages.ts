import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

const createMessageSchema = z.object({
  content: z.string().min(1).max(500),
  imageUrl: z.string().optional()
});

router.get('/events/:eventId/messages', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { eventId } = req.params;
    const { limit = '50', before } = req.query;

    // Check if user is approved attendee or organizer
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const isOrganizer = event.organizerId === req.userId;
    
    if (!isOrganizer) {
      const attendance = await prisma.attendance.findUnique({
        where: {
          userId_eventId: {
            userId: req.userId!,
            eventId
          }
        }
      });

      if (!attendance || attendance.status !== 'APPROVED') {
        return res.status(403).json({ error: 'Not authorized to view messages' });
      }
    }

    const messages = await prisma.message.findMany({
      where: {
        eventId,
        ...(before && {
          id: { lt: before as string }
        })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string)
    });

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

    // Check if user is approved attendee or organizer
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const isOrganizer = event.organizerId === req.userId;
    
    if (!isOrganizer) {
      const attendance = await prisma.attendance.findUnique({
        where: {
          userId_eventId: {
            userId: req.userId!,
            eventId
          }
        }
      });

      if (!attendance || attendance.status !== 'APPROVED') {
        return res.status(403).json({ error: 'Not authorized to send messages' });
      }
    }

    const message = await prisma.message.create({
      data: {
        content: data.content,
        imageUrl: data.imageUrl,
        userId: req.userId!,
        eventId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
});

export default router;
