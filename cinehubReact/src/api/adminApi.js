import apiClient from './client.js';

export async function createMovie(formData) {
  const response = await apiClient.post('/admin/movies', formData);
  return response.data;
}

export async function getPendingOwnerRequests() {
  const response = await apiClient.get('/admin/owner-requests');
  return response.data;
}

export async function approveOwnerRequest(id) {
  const response = await apiClient.put(`/admin/owner-requests/${id}/approve`);
  return response.data;
}

export async function rejectOwnerRequest(id) {
  const response = await apiClient.put(`/admin/owner-requests/${id}/reject`);
  return response.data;
}

export const getAllMovies = async () => {
  const response = await apiClient.get("/public/movies");
  return response.data;
};

export const deleteMovie = async (movieId) => {
  const response = await apiClient.delete(`/admin/movies/${movieId}`);
  return response.data;
};