import API from './axios';

export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone: string }) =>
    API.post('/users/register', data),

  login: (data: { email: string; password: string }) =>
    API.post('/users/login', data),

  logout: () => API.post('/users/logout'),

  getProfile: () => API.get('/users/profile'),

  updateProfile: (data: any) => API.put('/users/profile', data),
  
  forgotPassword: (email: string) => API.post('/users/forgotpassword', { email }),
  
  resetPassword: (token: string, password: string) => 
    API.put(`/users/resetpassword/${token}`, { password }),
};
