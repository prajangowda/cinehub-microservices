import apiClient from './client.js';

export async function login(credentials) {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
}

export async function verifyOtp(payload) {
  const response = await apiClient.post('/auth/verify-otp', payload);
  return response.data;
}

export async function resendOtp(email) {
  const response = await apiClient.post('/auth/resend-otp', null, { params: { email } });
  return response.data;
}

export async function register(credentials) {
  const response = await apiClient.post('/auth/signup', credentials);
  return response.data;
}

export async function refreshAccessToken() {
  const response = await apiClient.post('/auth/refresh');
  return response.data;
}

export async function logout() {
  const response = await apiClient.post('/auth/logout');
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get('/auth/me');
  return response.data;
}
