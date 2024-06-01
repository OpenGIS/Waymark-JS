import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "./",

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  plugins: [vue()],

  build: {
    lib: {
      entry: resolve(__dirname, "src/export.js"),
      name: "WaymarkJS",
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
