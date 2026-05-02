import api from './axios';

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
};
