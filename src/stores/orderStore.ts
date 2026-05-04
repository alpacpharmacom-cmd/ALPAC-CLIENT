import { create } from 'zustand';
import { ordersAPI } from '../api/orders.api';

interface OrderState {
  myOrders: any[];
  fetchedOrders: boolean;
  
  fetchMyOrders: (force?: boolean) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  myOrders: [],
  fetchedOrders: false,

  fetchMyOrders: async (force = false) => {
    if (!force && get().fetchedOrders) return;
    try {
      const { data } = await ordersAPI.getMyOrders();
      set({ myOrders: data.data || [], fetchedOrders: true });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  }
}));
