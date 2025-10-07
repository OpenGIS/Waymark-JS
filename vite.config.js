import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "./",

  define: { "process.env.NODE_ENV": '"production"' },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./library", import.meta.url)),
    },
  },

  plugins: [vue()],

  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "library/main.js"),
      name: "WaymarkJS",
      fileName: "waymark-js",
    },
    rollupOptions: {
      output: {
        // globals: {
        //   vue: "Vue",
        // },
        assetFileNames: "waymark-js.[ext]",
      },
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
  },

  server: {
    open: "/index.html",
    // allowedHosts: ["joe-dev.local"],
  },
});
