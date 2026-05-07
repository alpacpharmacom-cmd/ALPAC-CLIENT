import { create } from 'zustand';
import { cartAPI } from '../api/cart.api';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    stockStatus: string;
    offer?: {
      buy: number;
      get: number;
      isActive: boolean;
    };
  };
  quantity: number;
  _id: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  initialized: boolean;
  totalItems: number;
  totalPrice: number;

  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  resetCart: () => void;
}

const calculateTotals = (items: CartItem[]) => {
  const validItems = items.filter(item => item.product !== null);
  return {
    totalItems: validItems.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: validItems.reduce((sum, item) => {
      const { price, offer } = item.product;
      const qty = item.quantity;
      
      if (offer && offer.isActive && offer.buy > 0 && offer.get > 0) {
        const { buy, get } = offer;
        const bundles = Math.floor(qty / (buy + get));
        const remainder = qty % (buy + get);
        const paidQuantity = (bundles * buy) + Math.min(remainder, buy);
        return sum + price * paidQuantity;
      }
      
      return sum + price * qty;
    }, 0),
  };
};

// To track debounced API calls for each product
const updateTimers: Record<string, ReturnType<typeof setTimeout>> = {};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  initialized: false,
  totalItems: 0,
  totalPrice: 0,

  fetchCart: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const { data } = await cartAPI.get();
      const rawItems = data.data?.items || [];
      const items = rawItems.filter((item: any) => item.product !== null);
      set({ items, ...calculateTotals(items), isLoading: false, initialized: true });
    } catch {
      set({ isLoading: false, initialized: true });
    }
  },

  addToCart: async (productId: string, quantity = 1) => {
    set({ isLoading: true });
    try {
      const { data } = await cartAPI.addItem(productId, quantity);
      const rawItems = data.data?.items || [];
      const items = rawItems.filter((item: any) => item.product !== null);
      set({ items, ...calculateTotals(items), isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    const previousItems = get().items;
    
    // 1. Optimistic Update (Immediate UI response)
    const updatedItems = previousItems.map(item => 
      item.product._id === productId ? { ...item, quantity } : item
    );
    set({ items: updatedItems, ...calculateTotals(updatedItems) });

    // 2. Debounce the API call
    if (updateTimers[productId]) {
      clearTimeout(updateTimers[productId]);
    }

    updateTimers[productId] = setTimeout(async () => {
      try {
        const { data } = await cartAPI.updateQuantity(productId, quantity);
        const rawItems = data.data?.items || [];
        const items = rawItems.filter((item: any) => item.product !== null);
        
        // Sync with server data (in case prices or offers changed)
        set({ items, ...calculateTotals(items) });
        delete updateTimers[productId];
      } catch (error) {
        // Revert to previous state if the server request fails
        set({ items: previousItems, ...calculateTotals(previousItems) });
        console.error('Failed to update cart quantity:', error);
      }
    }, 500); // 500ms delay
  },

  removeItem: async (productId: string) => {
    const previousItems = get().items;
    
    // Optimistic Update
    const updatedItems = previousItems.filter(item => item.product._id !== productId);
    set({ items: updatedItems, ...calculateTotals(updatedItems) });

    try {
      const { data } = await cartAPI.removeItem(productId);
      const rawItems = data.data?.items || [];
      const items = rawItems.filter((item: any) => item.product !== null);
      set({ items, ...calculateTotals(items) });
    } catch (error) {
      // Revert on error
      set({ items: previousItems, ...calculateTotals(previousItems) });
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
