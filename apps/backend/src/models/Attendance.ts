import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'LEFT';
  puddingPhoto: string;
  puddingName?: string;
  puddingDesc?: string;
  joinedAt: Date;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required'],
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'LEFT'],
    default: 'PENDING',
  },
  puddingPhoto: {
    type: String,
    required: [true, 'Pudding photo is required'],
  },
  puddingName: {
    type: String,
    trim: true,
    maxlength: [50, 'Pudding name cannot exceed 50 characters'],
  },
  puddingDesc: {
    type: String,
    trim: true,
    maxlength: [200, 'Pudding description cannot exceed 200 characters'],
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date,
    default: null,
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

// Compound index to ensure one attendance per user per event
AttendanceSchema.index({ userId: 1, eventId: 1 }, { unique: true });
AttendanceSchema.index({ eventId: 1, status: 1 });
AttendanceSchema.index({ userId: 1, status: 1 });
AttendanceSchema.index({ joinedAt: -1 });

// Update approvedAt when status changes to APPROVED
AttendanceSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'APPROVED' && !this.approvedAt) {
    this.approvedAt = new Date();
  }
  next();
});

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
