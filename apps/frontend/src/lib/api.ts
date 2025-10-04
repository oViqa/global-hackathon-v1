import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    const message = error.response?.data?.error?.message || 'An error occurred';
    toast.error(message);

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getMe: () => api.get('/auth/me'),
};

export const eventsAPI = {
  getEvents: (params?: {
    lat?: number;
    lng?: number;
    radius?: number;
    status?: string;
    limit?: number;
    page?: number;
  }) => api.get('/events', { params }),
  
  getEvent: (id: string) => api.get(`/events/${id}`),
  
  createEvent: (data: any) => api.post('/events', data),
  
  updateEvent: (id: string, data: any) => api.patch(`/events/${id}`, data),
  
  deleteEvent: (id: string) => api.delete(`/events/${id}`),
};

export const attendancesAPI = {
  joinEvent: (eventId: string, data: FormData) =>
    api.post(`/events/${eventId}/join`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getAttendances: (eventId: string) => api.get(`/events/${eventId}/attendances`),
  
  updateAttendance: (eventId: string, attendanceId: string, data: any) =>
    api.patch(`/events/${eventId}/attendances/${attendanceId}`, data),
  
  leaveEvent: (eventId: string) => api.delete(`/events/${eventId}/attendance`),
};

export const messagesAPI = {
  getMessages: (eventId: string, params?: { limit?: number; before?: string }) =>
    api.get(`/events/${eventId}/messages`, { params }),
  
  sendMessage: (eventId: string, data: { content: string; imageUrl?: string }) =>
    api.post(`/events/${eventId}/messages`, data),
};

// Utility functions
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.error?.message || 'Server error occurred';
    toast.error(message);
  } else if (error.request) {
    // Request was made but no response received
    toast.error('Network error - please check your connection');
  } else {
    // Something else happened
    toast.error('An unexpected error occurred');
  }
};

export default api;
