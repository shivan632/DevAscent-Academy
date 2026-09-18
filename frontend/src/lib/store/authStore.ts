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
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
  checkAuth: async () => {
    try {
      const response = await api.getProfile();
      const raw = response?.data || response;
      const user = raw?.user || raw;
      if (user && user.id) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  logout: async () => {
    try {
      await api.logout();
    } catch {
      // continue logout even on API failure
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
