// frontend/src/services/api.js
import axios from 'axios';

const root = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const baseURL = root.endsWith('/api') ? root : `${root}/api`;

const api = axios.create({ baseURL, withCredentials: false });

// ⚠️ N’utiliser QUE le token client
api.interceptors.request.use((config) => {
  const t =
    localStorage.getItem('clientToken') ||
    sessionStorage.getItem('clientToken');
  if (t) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${t}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

export default api;
