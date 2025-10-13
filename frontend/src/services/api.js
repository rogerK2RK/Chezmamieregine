import axios from 'axios';

const root = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const baseURL = root.endsWith('/api') ? root : `${root}/api`; // <-- évite le /api en double

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
