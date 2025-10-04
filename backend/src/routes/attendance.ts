import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();
const prisma = new PrismaClient();

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

      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          attendances: {
            where: { status: { in: ['PENDING', 'APPROVED'] } }
          }
        }
      });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.attendances.length >= event.attendeeLimit) {
        return res.status(400).json({ error: 'Event is full' });
      }

      const existingAttendance = await prisma.attendance.findUnique({
        where: {
          userId_eventId: {
            userId: req.userId!,
            eventId
          }
        }
      });

      if (existingAttendance) {
        return res.status(409).json({ error: 'Already joined this event' });
      }

      const attendance = await prisma.attendance.create({
        data: {
          userId: req.userId!,
          eventId,
          puddingPhoto: `/uploads/${req.file.filename}`,
          puddingName,
          puddingDesc
        }
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

      const event = await prisma.event.findUnique({
        where: { id: eventId }
      });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.organizerId !== req.userId) {
        return res.status(403).json({ error: 'Only organizer can view attendances' });
      }

      const attendances = await prisma.attendance.findMany({
        where: { eventId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          }
        },
        orderBy: { joinedAt: 'desc' }
      });

      const grouped = {
        pending: attendances.filter(a => a.status === 'PENDING'),
        approved: attendances.filter(a => a.status === 'APPROVED'),
        rejected: attendances.filter(a => a.status === 'REJECTED')
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

      const event = await prisma.event.findUnique({
        where: { id: eventId }
      });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.organizerId !== req.userId) {
        return res.status(403).json({ error: 'Only organizer can update attendance' });
      }

      const attendance = await prisma.attendance.update({
        where: { id: attendanceId },
        data: {
          status,
          approvedAt: status === 'APPROVED' ? new Date() : null
        }
      });

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

      await prisma.attendance.update({
        where: {
          userId_eventId: {
            userId: req.userId!,
            eventId
          }
        },
        data: { status: 'LEFT' }
      });

      res.json({ message: 'You have left the event' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
