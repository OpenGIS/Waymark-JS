import { Buffer } from "node:buffer";
import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const inlineWorker = () => ({
  name: "inline-worker",
  generateBundle(_options, bundle) {
    const worker = Object.values(bundle).find(
      (output) =>
        (output.type === "chunk" || output.type === "asset") &&
        output.fileName.startsWith("assets/maplibre-gl-worker-"),
    );
    if (!worker) return;

    const workerSource = worker.type === "chunk" ? worker.code : worker.source;
    const dataUrl =
      "data:text/javascript;base64," +
      Buffer.from(workerSource).toString("base64");

    const main = bundle["waymark.js"];
    main.code = main.code.split(worker.fileName).join(dataUrl);

    delete bundle[worker.fileName];
  },
});

export default defineConfig({
  base: "./",
  plugins: [vue(), inlineWorker()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  publicDir: false,
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/entry.js"),
      fileName: "waymark",
      formats: ["es"],
    },
  },
});
