// frontend/src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL ?? 'http://localhost:5000') + '/api',
  withCredentials: true
});

// usage:
await api.post('/admin/login', { email, password });
