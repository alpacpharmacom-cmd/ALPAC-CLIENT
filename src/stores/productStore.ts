import { create } from 'zustand';
import { productsAPI } from '../api/products.api';

interface ProductState {
  allProducts: any[];
  topRated: any[];
  newArrivals: any[];
  fetchedAll: boolean;
  fetchedHome: boolean;
  productDetails: Record<string, any>;
  
  fetchAllProducts: () => Promise<void>;
  fetchHomeData: () => Promise<void>;
  fetchProductById: (id: string, force?: boolean) => Promise<any>;
  refreshAllProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  allProducts: [],
  topRated: [],
  newArrivals: [],
  fetchedAll: false,
  fetchedHome: false,
  productDetails: {},

  fetchAllProducts: async () => {
    if (get().fetchedAll) return;
    try {
      const { data } = await productsAPI.getAll();
      set({ allProducts: data.data, fetchedAll: true });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  fetchHomeData: async () => {
    if (get().fetchedHome) return;
    try {
      const [newRes, ratedRes] = await Promise.all([
        productsAPI.getNewArrivals(),
        productsAPI.getTopRated()
      ]);
      set({ 
        newArrivals: newRes.data.data, 
        topRated: ratedRes.data.data, 
        fetchedHome: true 
      });
    } catch (error) {
      console.error('Failed to fetch home page data:', error);
      throw error;
    }
  },

  fetchProductById: async (id: string, force = false) => {
    if (!force && get().productDetails[id]) {
      return get().productDetails[id];
    }
    try {
      const { data } = await productsAPI.getById(id);
      set((state) => ({
        productDetails: { ...state.productDetails, [id]: data.data }
      }));
      return data.data;
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      throw error;
    }
  },

  refreshAllProducts: async () => {
    try {
      const { data } = await productsAPI.getAll();
      set({ allProducts: data.data, fetchedAll: true });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }
}));
