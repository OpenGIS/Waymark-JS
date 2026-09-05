import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DIST_DIR = path.resolve(__dirname, "../../../dist");
export const BUNDLE_PATH = path.join(DIST_DIR, "waymark.js");
export const FIXTURE_PATH = path.join(DIST_DIR, "built-bundle-test.html");
export const PREVIEW_URL = "http://127.0.0.1:4174";

export const FIXTURE_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>built bundle test</title></head>
<body>
  <div id="map" style="width:400px;height:300px"></div>
  <script type="module">
    import { createInstance } from "./waymark.js";
    window.__mapLoaded = false;
    window.__instance = createInstance({
      config: {
        id: "map",
        map: {
          basemaps: { vector: [{ styleURL: { version: 8, sources: {}, layers: [] } }] },
        },
      },
    });
    window.__instance.once("waymark:map.load", () => {
      window.__mapLoaded = true;
    });
  </script>
</body></html>`;
