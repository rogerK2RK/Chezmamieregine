import axios from 'axios';

const root = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const baseURL = root.endsWith('/api') ? root : `${root}/api`;

const apiAdmin = axios.create({ baseURL });

apiAdmin.interceptors.request.use((config) => {
  const t = localStorage.getItem('adminToken');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default apiAdmin;
