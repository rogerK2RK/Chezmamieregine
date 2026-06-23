import axios from 'axios';

const root = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const baseURL = root.endsWith('/api') ? root : `${root}/api`;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const t = localStorage.getItem('clientToken');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default api;
