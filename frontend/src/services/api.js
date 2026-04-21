import axios from 'axios';

export const api = axios.create({
  // Use Vite dev proxy (vite.config.js) and avoid CORS issues.
  // In production, serve frontend + backend under same domain or set VITE_API_BASE_URL.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};