import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 10000, // Tiempo de espera opcional
  headers: {
    "Content-Type": "application/json",
  },
});

// Agregar token a todas las solicitudes si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;