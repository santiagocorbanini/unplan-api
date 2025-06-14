import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/unplan-api/',
  plugins: [react()],
  server: {
    proxy: {
      "/shows": "http://localhost:5047", // Proxy para todas las rutas /shows
    },
  },
});
