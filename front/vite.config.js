import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/shows": "http://localhost:4000", // Proxy para todas las rutas /shows
    },
  },
});
