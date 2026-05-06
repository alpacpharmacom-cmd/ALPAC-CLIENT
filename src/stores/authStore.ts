import { create } from 'zustand';
import { authAPI } from '../api/auth.api';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: !!localStorage.getItem('token'),
  isAuthenticated: false,
  isAdmin: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data: res } = await authAPI.login({ email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: user.isAdmin || false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string, phone: string) => {
    set({ isLoading: true });
    try {
      const { data: res } = await authAPI.register({ name, email, password, phone });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: user.isAdmin || false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch {
      // Continue with local cleanup even if the API call fails
    }
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const { data: res } = await authAPI.getProfile();
      const user = res.data;
      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: user.isAdmin || false,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem('token');
      set({ 
        token: null, 
        isAuthenticated: false, 
        isAdmin: false, 
        isLoading: false 
      });
    }
  },

  updateProfile: async (data: any) => {
    set({ isLoading: true });
    try {
      const { data: res } = await authAPI.updateProfile(data);
      const updatedUser = res.data;
      set({
        user: updatedUser,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
