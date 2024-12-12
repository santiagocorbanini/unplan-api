import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 10000, // Tiempo de espera opcional
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
