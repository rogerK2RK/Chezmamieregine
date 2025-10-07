import axios from 'axios';

// ⬅️ BASE URL SANS /api
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export const api = axios.create({
  baseURL: BASE + '/api',   // ⬅️ on ajoute /api ici une seule fois
  withCredentials: true     // si cookies/sessions
});
