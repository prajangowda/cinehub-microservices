import apiClient from './apiClient.js';

export async function fetchShow(showId) {
  const response = await apiClient.get(`/public/shows/${showId}`);
  return response.data;
}

export async function fetchShowSeats(showId) {
  const response = await apiClient.get(`/public/shows/${showId}/seats`);
  return response.data;
}

export async function reserveSeats(payload) {
  const response = await apiClient.post('/bookings/reserve', payload);
  return response.data;
}

export async function createPaymentOrder(reservationToken) {
  const response = await apiClient.post('/payment/create-order', {
    reservationToken,
  });
  return response.data;
}

export async function verifyPayment(payload) {
  const response = await apiClient.post('/payment/verify', payload);
  return response.data;
}

export async function fetchBookings() {
  const response = await apiClient.get('/bookings/my-bookings');
  return response.data;
}

export async function createBooking(payload) {
  const response = await apiClient.post('/bookings', payload);
  return response.data;
}
