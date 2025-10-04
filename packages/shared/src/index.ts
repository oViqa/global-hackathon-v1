// User Types
export interface User {
  _id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Event Types
export interface Event {
  _id: string;
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
  organizerId: string;
  organizer: User;
  createdAt: Date;
  updatedAt: Date;
}

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED'
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  location: {
    lat: number;
    lng: number;
  };
  city: string;
  state: string;
  address?: string;
  startTime: Date;
  endTime: Date;
  attendeeLimit: number;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
  };
  city?: string;
  state?: string;
  address?: string;
  startTime?: Date;
  endTime?: Date;
  attendeeLimit?: number;
  status?: EventStatus;
}

// Attendance Types
export interface Attendance {
  _id: string;
  userId: string;
  eventId: string;
  user: User;
  event: Event;
  status: AttendanceStatus;
  puddingPhoto: string;
  puddingName?: string;
  puddingDesc?: string;
  joinedAt: Date;
  approvedAt?: Date;
}

export enum AttendanceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  LEFT = 'LEFT'
}

export interface JoinEventRequest {
  puddingName?: string;
  puddingDesc?: string;
  puddingPhoto: File;
}

export interface UpdateAttendanceRequest {
  status: AttendanceStatus;
}

// Message Types
export interface Message {
  _id: string;
  content: string;
  imageUrl?: string;
  userId: string;
  eventId: string;
  user: User;
  event: Event;
  createdAt: Date;
}

export interface CreateMessageRequest {
  content: string;
  imageUrl?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Query Types
export interface EventQuery {
  lat?: number;
  lng?: number;
  radius?: number; // in meters
  status?: EventStatus;
  limit?: number;
  page?: number;
}

export interface MessageQuery {
  limit?: number;
  before?: string; // message ID for pagination
}

// WebSocket Types
export interface SocketEvents {
  // Client to Server
  join_event: { eventId: string };
  leave_event: { eventId: string };
  send_message: { eventId: string; content: string; imageUrl?: string };
  typing: { eventId: string; isTyping: boolean };
  
  // Server to Client
  new_message: Message;
  attendance_approved: { eventId: string; userId: string };
  event_updated: Event;
  user_typing: { userId: string; name: string; isTyping: boolean };
  new_join_request: Attendance;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// File Upload Types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Location Types
export interface Location {
  lat: number;
  lng: number;
}

export interface GeoLocation extends Location {
  address?: string;
  city: string;
  state: string;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

// Constants
export const EVENT_RADIUS_OPTIONS = [10000, 20000, 50000, 100000] as const; // 10km, 20km, 50km, 100km
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
