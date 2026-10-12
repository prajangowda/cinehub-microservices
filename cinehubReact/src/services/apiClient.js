// Re-export the shared api client implementation to ensure a single
// axios instance (with refresh logic) is used across the app.
import apiClient from '../api/client.js';

export default apiClient;
