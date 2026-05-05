import { create } from 'zustand';
import { wishlistAPI } from '../api/wishlist.api';

interface WishlistState {
  items: any[];
  loading: boolean;
  initialized: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlistProduct: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  resetWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,
  initialized: false,

  fetchWishlist: async () => {
    try {
      set({ loading: true });
      const { data } = await wishlistAPI.getWishlist();
      const rawItems = data.data || [];
      // Filter out any null products (orphaned wishlist items)
      const items = rawItems.filter((item: any) => item !== null);
      set({ items, initialized: true });
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
      set({ items: [], initialized: true });
    } finally {
      set({ loading: false });
    }
  },

  toggleWishlistProduct: async (productId: string) => {
    try {
      // We don't set loading: true here because it triggers a full UI reload
      // and fetchWishlist() will handle its own loading state if needed.
      // For a toggle, we want it to feel snappy.
      await wishlistAPI.toggleProduct(productId);
      await get().fetchWishlist();
    } catch (error) {
      console.error('Failed to toggle wishlist item', error);
      throw error;
    }
  },

  clearWishlist: async () => {
    try {
      set({ loading: true });
      await wishlistAPI.clearWishlist();
      set({ items: [] });
    } catch (error) {
      console.error('Failed to clear wishlist', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resetWishlist: () => {
    set({ items: [], initialized: false });
  },
}));
