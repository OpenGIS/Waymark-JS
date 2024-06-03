import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "./",

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./library", import.meta.url)),
    },
  },

  plugins: [vue()],

  build: {
    lib: {
      entry: resolve(__dirname, "library/export.js"),
      name: "Waymark",
      fileName: "waymark-js",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        assetFileNames: "waymark-js.[ext]",
      },
    },
  },
});
