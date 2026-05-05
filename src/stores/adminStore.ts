import { create } from 'zustand';
import { productsAPI } from '../api/products.api';
import { ordersAPI } from '../api/orders.api';
import { usersAPI } from '../api/users.api';
import { adminAPI } from '../api/admin.api';

interface AdminState {
  products: any[];
  orders: any[];
  users: any[];
  stats: any | null;
  
  fetchedProducts: boolean;
  fetchedOrders: boolean;
  fetchedUsers: boolean;
  fetchedStats: boolean;

  // Actions
  fetchProducts: (force?: boolean) => Promise<void>;
  fetchOrders: (force?: boolean) => Promise<void>;
  fetchUsers: (force?: boolean) => Promise<void>;
  fetchStats: (force?: boolean) => Promise<void>;

  invalidateProducts: () => void;
  invalidateOrders: () => void;
  invalidateUsers: () => void;
  invalidateStats: () => void;
  invalidateAll: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  products: [],
  orders: [],
  users: [],
  stats: null,

  fetchedProducts: false,
  fetchedOrders: false,
  fetchedUsers: false,
  fetchedStats: false,

  fetchProducts: async (force = false) => {
    if (!force && get().fetchedProducts) return;
    try {
      const { data } = await productsAPI.getAdminAll();
      set({ products: data.data, fetchedProducts: true });
    } catch (error) {
      console.error('Failed to fetch admin products:', error);
      throw error;
    }
  },

  fetchOrders: async (force = false) => {
    if (!force && get().fetchedOrders) return;
    try {
      const { data } = await ordersAPI.getAll();
      set({ orders: data.data || [], fetchedOrders: true });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  },

  fetchUsers: async (force = false) => {
    if (!force && get().fetchedUsers) return;
    try {
      const { data } = await usersAPI.getAll();
      set({ users: data.data || [], fetchedUsers: true });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  fetchStats: async (force = false) => {
    if (!force && get().fetchedStats) return;
    try {
      const { data } = await adminAPI.getStats();
      set({ stats: data.data, fetchedStats: true });
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      throw error;
    }
  },

  invalidateProducts: () => set({ fetchedProducts: false }),
  invalidateOrders: () => set({ fetchedOrders: false }),
  invalidateUsers: () => set({ fetchedUsers: false }),
  invalidateStats: () => set({ fetchedStats: false }),
  invalidateAll: () => set({ 
    fetchedProducts: false, 
    fetchedOrders: false, 
    fetchedUsers: false, 
    fetchedStats: false 
  }),
}));
