import API from './axios';

export const cartAPI = {
  get: () => API.get('/carts'),

  addItem: (productId: string, quantity: number = 1) =>
    API.post(`/carts/${productId}`, { quantity }),

  updateQuantity: (productId: string, quantity: number) =>
    API.put(`/carts/${productId}`, { quantity }),

  removeItem: (productId: string) => API.delete(`/carts/${productId}`),

  clear: () => API.delete('/carts'),
};
