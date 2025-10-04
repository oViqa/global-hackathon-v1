import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Attendance, AttendanceStatus } from '../models/Attendance';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
      name
    });

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '7d' });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '7d' });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const eventsCreated = await Event.countDocuments({ organizerId: user._id });
    const eventsJoined = await Attendance.countDocuments({
      userId: user._id,
      status: AttendanceStatus.APPROVED
    });

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      eventsCreated,
      eventsJoined
    });
  } catch (error) {
    next(error);
  }
});

export default router;
