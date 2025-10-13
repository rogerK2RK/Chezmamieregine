import axios from 'axios';

const root = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const baseURL = root.endsWith('/api') ? root : `${root}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// injecte toujours le token CLIENT (jamais le token admin)
api.interceptors.request.use((config) => {
  if (!config.headers?.Authorization) {
    const t =
      localStorage.getItem('clientToken') ||
      sessionStorage.getItem('clientToken');
    if (t) {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${t}` };
    }
  }
  return config;
});

export default api;
