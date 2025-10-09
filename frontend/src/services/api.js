import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${baseURL}/api`,   // <-- IMPORTANT : ajoute /api
  withCredentials: true
});

export default api;
