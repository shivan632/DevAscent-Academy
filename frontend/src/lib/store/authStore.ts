import { create } from 'zustand';
import { api } from '../api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN' | 'INSTRUCTOR';
  degree?: string;
  college?: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  graduationYear?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  enrollmentsCount?: number;
  certificatesCount?: number;
  submissionsCount?: number;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  updateUser: (data: Partial<User>) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('devascent_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('devascent_user');
      }
    }
    set({ user, isAuthenticated: !!user, isLoading: false });
  },
  updateUser: (data) =>
    set((state) => {
      const updated = state.user ? { ...state.user, ...data } : null;
      if (typeof window !== 'undefined' && updated) {
        localStorage.setItem('devascent_user', JSON.stringify(updated));
      }
      return { user: updated };
    }),
  checkAuth: async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('devascent_token');
      const savedUser = localStorage.getItem('devascent_user');
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          set({ user: parsed, isAuthenticated: true, isLoading: false });
        } catch {
          // ignore parse error
        }
      }
      // Keep document cookie in sync for Next.js proxy/middleware
      if (!document.cookie.includes('access_token=')) {
        document.cookie = `access_token=${token}; path=/; max-age=604800; SameSite=Lax`;
      }
    }
    try {
      const response = await api.getProfile();
      const raw = response?.data || response;
      const user = raw?.user || raw;
      if (user && user.id) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('devascent_user', JSON.stringify(user));
        }
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err: any) {
      // ONLY clear session if strictly 401 (Unauthorized) or 403 (Forbidden)
      if (err?.status === 401 || err?.status === 403) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('devascent_token');
          localStorage.removeItem('devascent_user');
          document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        }
        set({ user: null, isAuthenticated: false, isLoading: false });
      } else {
        // Transient network or server reboot issue: keep cached session active
        set({ isLoading: false });
      }
    }
  },
  logout: async () => {
    try {
      await api.logout();
    } catch {
      // continue logout even on API failure
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('devascent_token');
      localStorage.removeItem('devascent_user');
      localStorage.removeItem('devascent_enrollments_cache');
      localStorage.removeItem('devascent_certificates_cache');
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('devascent_enrollments_cache_') || key.startsWith('devascent_certificates_cache_')) {
            localStorage.removeItem(key);
          }
        });
      } catch (e) {}
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
