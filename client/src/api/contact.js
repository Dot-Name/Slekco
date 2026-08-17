import { api } from './client.js';

export const sendMessage = (payload) => api.post('/contact', payload);
