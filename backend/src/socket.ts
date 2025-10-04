import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthSocket extends Socket {
  userId?: string;
}

export function setupSocketHandlers(io: Server) {
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, secret) as { userId: string };
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    console.log(`User connected: ${socket.userId}`);

    socket.on('join_event', async ({ eventId }) => {
      try {
        // Verify user has access to this event
        const event = await prisma.event.findUnique({
          where: { id: eventId }
        });

        if (!event) return;

        const isOrganizer = event.organizerId === socket.userId;
        
        if (!isOrganizer) {
          const attendance = await prisma.attendance.findUnique({
            where: {
              userId_eventId: {
                userId: socket.userId!,
                eventId
              }
            }
          });

          if (!attendance || attendance.status !== 'APPROVED') {
            return;
          }
        }

        socket.join(`event:${eventId}`);
        console.log(`User ${socket.userId} joined event ${eventId}`);
      } catch (error) {
        console.error('Error joining event:', error);
      }
    });

    socket.on('send_message', async ({ eventId, content, imageUrl }) => {
      try {
        const message = await prisma.message.create({
          data: {
            content,
            imageUrl,
            userId: socket.userId!,
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

        io.to(`event:${eventId}`).emit('new_message', message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('typing', ({ eventId, isTyping }) => {
      socket.to(`event:${eventId}`).emit('user_typing', {
        userId: socket.userId,
        isTyping
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
}
