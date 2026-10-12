import apiClient from './apiClient.js';

export async function fetchBookings() {
  const response = await apiClient.get('/bookings');
  return response.data;
}

export async function createBooking(payload) {
  const response = await apiClient.post('/bookings', payload);
  return response.data;
}
