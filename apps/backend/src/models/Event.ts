import mongoose, { Document, Schema } from 'mongoose';

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
  status: 'UPCOMING' | 'ONGOING' | 'ENDED' | 'CANCELLED';
  organizerId: mongoose.Types.ObjectId;
  organizer: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords: number[]) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && // longitude
                 coords[1] >= -90 && coords[1] <= 90;     // latitude
        },
        message: 'Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90.',
      },
    },
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [50, 'City name cannot exceed 50 characters'],
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [50, 'State name cannot exceed 50 characters'],
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters'],
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
    validate: {
      validator: function(startTime: Date) {
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
        return startTime > oneHourFromNow;
      },
      message: 'Event must be scheduled at least 1 hour in the future.',
    },
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
    validate: {
      validator: function(endTime: Date) {
        return endTime > this.startTime;
      },
      message: 'End time must be after start time.',
    },
  },
  attendeeLimit: {
    type: Number,
    required: [true, 'Attendee limit is required'],
    min: [5, 'Minimum 5 attendees required'],
    max: [100, 'Maximum 100 attendees allowed'],
  },
  status: {
    type: String,
    enum: ['UPCOMING', 'ONGOING', 'ENDED', 'CANCELLED'],
    default: 'UPCOMING',
  },
  organizerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer is required'],
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    },
  },
});

// Create geospatial index for location queries
EventSchema.index({ location: '2dsphere' });
EventSchema.index({ startTime: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ organizerId: 1 });
EventSchema.index({ createdAt: -1 });

// Virtual for attendee count
EventSchema.virtual('attendeeCount', {
  ref: 'Attendance',
  localField: '_id',
  foreignField: 'eventId',
  count: true,
  match: { status: 'APPROVED' },
});

// Ensure virtual fields are serialized
EventSchema.set('toJSON', { virtuals: true });

export const Event = mongoose.model<IEvent>('Event', EventSchema);
