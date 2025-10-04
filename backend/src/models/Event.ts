import mongoose, { Schema, Document } from 'mongoose';

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED'
}

export interface IEvent extends Document {
  title: string;
  description?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  city: string;
  state: string;
  address?: string;
  startTime: Date;
  endTime: Date;
  attendeeLimit: number;
  status: EventStatus;
  organizerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  attendeeLimit: {
    type: Number,
    required: true,
    min: 5,
    max: 100
  },
  status: {
    type: String,
    enum: Object.values(EventStatus),
    default: EventStatus.UPCOMING
  },
  organizerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create 2dsphere index for geospatial queries
EventSchema.index({ location: '2dsphere' });
EventSchema.index({ startTime: 1 });

export const Event = mongoose.model<IEvent>('Event', EventSchema);
