import { create } from 'zustand';
import { cartAPI } from '../api/cart.api';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    stockStatus: string;
  };
  quantity: number;
  _id: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;

  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  resetCart: () => void;
}

const calculateTotals = (items: CartItem[]) => ({
  totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
});

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isLoading: false,
  totalItems: 0,
  totalPrice: 0,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await cartAPI.get();
      const items = data.data?.items || [];
      set({ items, ...calculateTotals(items), isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId: string, quantity = 1) => {
    set({ isLoading: true });
    try {
      const { data } = await cartAPI.addItem(productId, quantity);
      const items = data.data?.items || [];
      set({ items, ...calculateTotals(items), isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    set({ isLoading: true });
    try {
      const { data } = await cartAPI.updateQuantity(productId, quantity);
      const items = data.data?.items || [];
      set({ items, ...calculateTotals(items), isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  removeItem: async (productId: string) => {
    set({ isLoading: true });
    try {
      const { data } = await cartAPI.removeItem(productId);
      const items = data.data?.items || [];
      set({ items, ...calculateTotals(items), isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await cartAPI.clear();
      set({ items: [], totalItems: 0, totalPrice: 0, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  resetCart: () => {
    set({ items: [], totalItems: 0, totalPrice: 0 });
  },
}));
