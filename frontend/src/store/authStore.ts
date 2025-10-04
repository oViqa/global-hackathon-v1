import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    set({ user, token });
  },

  register: async (email, password, name) => {
    const response = await api.post('/auth/register', { email, password, name });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const response = await api.get('/auth/me');
      set({ user: response.data, token, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));

// Initialize auth check
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuth();
}
