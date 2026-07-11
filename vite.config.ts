import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/cover-atelier/" : "/",
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@jsquash/avif"],
  },
  worker: {
    format: "es",
  },
}));
