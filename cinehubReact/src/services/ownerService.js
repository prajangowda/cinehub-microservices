import apiClient from './apiClient.js';

export async function requestTheatreRole(payload) {
  const response = await apiClient.post('/owner/request', payload);
 
  return response.data;
}

export async function createTheatre(payload) {
  const response = await apiClient.post('/theatre_owner/theatres', payload);
  return response.data;
}

export async function getOwnerTheatres(ownerId = null) {
  const response = await apiClient.get('/theatre_owner/theatres', {
    params: ownerId ? { ownerId } : undefined,
  });
  return response.data;
}

export async function createScreen(payload) {
  const response = await apiClient.post('/screens', payload);
  return response.data;
}

export async function getTheatreScreens(theatreId) {
  const response = await apiClient.get(`/screens/theatre/${theatreId}`);
  return response.data;
}

export async function getTheatreMovies() {
  const response = await apiClient.get('/public/movies');
  return response.data;
}

export async function createShow(payload) {
  const response = await apiClient.post('/shows', payload);
  return response.data;
}
