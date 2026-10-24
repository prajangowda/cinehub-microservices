import apiClient from './apiClient.js';

export async function fetchUsers() {
  const response = await apiClient.get('/admin/users');
  return response.data;
}

export async function fetchAdminsDashboard() {
  const response = await apiClient.get('/admin/dashboard');
  return response.data;
}

export async function createMovie(formData) {
  const response = await apiClient.post('/admin/movies', formData);
  return response.data;
}
