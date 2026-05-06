import API from './axios';

export const ordersAPI = {
  create: (data: { orderItems: any[]; shippingAddress: any; idempotencyKey?: string }) =>
    API.post('/orders', data),

  getMyOrders: () => API.get('/orders/myOrders'),

  getById: (id: string) => API.get(`/orders/${id}`),

  cancel: (id: string) => API.put(`/orders/${id}/cancel`),

  // Admin
  getAll: (status?: string) =>
    API.get('/orders', { params: status ? { status } : {} }),

  accept: (id: string, note?: string) =>
    API.put(`/orders/${id}/accept`, { note }),

  decline: (id: string, note?: string) =>
    API.put(`/orders/${id}/decline`, { note }),

  updateStatus: (id: string, status: string) =>
    API.put(`/orders/${id}/status`, { status }),

  delete: (id: string) => API.delete(`/orders/${id}`),
};
