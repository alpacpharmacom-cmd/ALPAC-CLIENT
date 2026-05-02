import API from './axios';

export const usersAPI = {
  getAll: () => API.get('/users'),

  getById: (id: string) => API.get(`/users/${id}`),

  update: (id: string, data: any) => API.put(`/users/${id}`, data),

  delete: (id: string) => API.delete(`/users/${id}`),
};
