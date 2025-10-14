// frontend/src/services/api.js
import axios from 'axios';

const root = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const baseURL = root.endsWith('/api') ? root : `${root}/api`;

const api = axios.create({ baseURL, withCredentials: false });
console.log('API baseURL =', baseURL);

api.interceptors.request.use((config) => {
  const t =
    localStorage.getItem('clientToken') ||
    sessionStorage.getItem('clientToken');
    console.log('[REQ]', config.method?.toUpperCase(), config.url, 'Auth?', !!t);
  if (t) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${t}`;
    console.log('[AUTH HEADER]', config.headers.Authorization.slice(0, 24) + '...');
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

export default api;
