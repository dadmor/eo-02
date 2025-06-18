import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "@tanstack/react-table",
          ],
          refine: [
            "@refinedev/core",
            "@refinedev/react-router",
            "@refinedev/react-hook-form",
            "@refinedev/react-table",
            "@refinedev/supabase",
          ],
          zod: ["zod"],
        },
      },
    },
  },
});
