/**
 * Loads Waymark with the given configuration and GeoJSON data.
 * Parameters can be either a URL string or a direct object.
 *
 * @param {string|object} configInput - Configuration object or URL to fetch it from
 * @param {string|object} geojsonInput - GeoJSON object or URL to fetch it from
 */
export async function loadWaymark(configInput, geojsonInput) {
  try {
    // Helper to resolve input to data
    const resolveInput = async (input) => {
      if (typeof input === "string") {
        const res = await fetch(input);
        if (!res.ok) throw new Error(`Failed to fetch ${input}: ${res.statusText}`);
        return await res.json();
      }
      return input;
    };

    const [config, geojson] = await Promise.all([
      resolveInput(configInput),
      resolveInput(geojsonInput),
    ]);

    // Mode detection
    const isDev =
      typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.DEV;

    if (isDev) {
      // Development mode - use ES modules
      // Import relative to this file: ../../library/main.js
      const { Instance } = await import("../../library/main.js");
      const instance = new Instance(config);
      instance.loadGeoJSON(geojson);
      return instance;
    } else {
      // Add production assets
      // These paths are relative to the document (index.html)
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "./dist/waymark-js.css";
      document.head.appendChild(link);

      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "./dist/waymark-js.umd.cjs";
        script.onload = () => {
          try {
            // Use the global WaymarkJS variable
            const instance = new WaymarkJS.Instance(config);
            instance.loadGeoJSON(geojson);
            resolve(instance);
          } catch (err) {
            reject(err);
          }
        };
        script.onerror = () => reject(new Error("Failed to load Waymark script"));
        document.body.appendChild(script);
      });
    }
  } catch (e) {
    console.error("Error loading Waymark:", e);
  }
}
