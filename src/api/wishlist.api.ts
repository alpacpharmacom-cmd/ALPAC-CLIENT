import api from './axios';

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  toggleProduct: (productId: string) => api.post(`/wishlist/${productId}`),
  clearWishlist: () => api.delete('/wishlist'),
};
