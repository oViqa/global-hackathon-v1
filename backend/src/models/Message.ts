import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  imageUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient message queries
MessageSchema.index({ eventId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
