import { api } from './client.js';

export const placeOrder = (payload) => api.post('/orders', payload);
export const fetchOrder = (orderNumber) => api.get(`/orders/${orderNumber}`);
