import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:5000'; // fallback dev

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // si tu utilises des cookies/sessions
});
