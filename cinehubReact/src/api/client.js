import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  withCredentials: true,
  headers: {
    Accept: 'application/json'
    }
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, result) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(result);
  });
  failedQueue = [];
};

const shouldAttemptRefresh = (request) => {
  const requestUrl = request?.url || '';
  return request && !request._retry && requestUrl !== '/auth/refresh' && requestUrl.includes('/auth/me');
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && shouldAttemptRefresh(originalRequest)) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await apiClient.post('/auth/refresh');
        console.debug('apiClient: /auth/refresh response', refreshResponse && refreshResponse.status, refreshResponse && refreshResponse.data);

        const newAccessToken = refreshResponse?.data?.accessToken || refreshResponse?.data?.token;
        if (newAccessToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          if (originalRequest && originalRequest.headers) {
            originalRequest.headers['Authorization'] = axios.defaults.headers.common['Authorization'];
          }
          console.debug('apiClient: applied new access token to defaults and originalRequest');
        }

        processQueue(null, true);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        console.warn('Token refresh failed, user must re-authenticate.');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401) {
      console.warn('Unauthorized request. Please sign in again.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
