import mongoose, { Schema, Document } from 'mongoose';

export enum AttendanceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  LEFT = 'LEFT'
}

export interface IAttendance extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  status: AttendanceStatus;
  puddingPhoto: string;
  puddingName?: string;
  puddingDesc?: string;
  joinedAt: Date;
  approvedAt?: Date;
}

const AttendanceSchema = new Schema<IAttendance>({
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
  status: {
    type: String,
    enum: Object.values(AttendanceStatus),
    default: AttendanceStatus.PENDING
  },
  puddingPhoto: {
    type: String,
    required: true
  },
  puddingName: {
    type: String,
    trim: true
  },
  puddingDesc: {
    type: String,
    trim: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  }
});

// Compound index to ensure user can only join event once
AttendanceSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
