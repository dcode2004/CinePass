import api from './api.js';

export const theaterService = {
  getAll: (params) => api.get('/theaters', { params }),
  getById: (id) => api.get(`/theaters/${id}`),
  create: (data) => api.post('/theaters', data),
  update: (id, data) => api.put(`/theaters/${id}`, data),
};
