import API from './axios';

export const productsAPI = {
  getAll: () => API.get('/products'),
  
  getTopRated: () => API.get('/products/top-rated'),

  getNewArrivals: () => API.get('/products/new-arrivals'),
  
  getAdminAll: () => API.get('/products/admin/allProducts'),

  getById: (id: string) => API.get(`/products/${id}`),

  getAdminById: (id: string) => API.get(`/products/admin/allProducts/${id}`),

  create: (data: any) => API.post('/products', data),

  update: (id: string, data: any) => API.put(`/products/${id}`, data),

  delete: (id: string) => API.delete(`/products/${id}`),

  uploadImage: (formData: FormData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  createReview: (id: string, data: { rating: number; comment: string }) =>
    API.post(`/products/${id}/reviews`, data),

  deleteReview: (productId: string, reviewId: string) =>
    API.delete(`/products/${productId}/reviews/${reviewId}`),
};
