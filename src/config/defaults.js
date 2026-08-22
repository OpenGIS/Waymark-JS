/**
 * Canonical authored defaults for consumer config resolution.
 *
 * @type {{
 *   map: {
 *     options: {
 *       attributionControl: boolean,
 *     },
 *     basemaps: {
 *       vector: Array<{ title: string, styleURL: string }>,
 *       raster: Array<object>,
 *     },
 *   },
 *   ui: { mode: 'view' },
 *   paint: { circle?: object, line?: object, fill?: object },
 *   types: Record<string, { title?: string, paint: object }> | undefined,
 *   debug: false,
 * }}
 */
export const defaultConfig = {
  map: {
    options: {
      attributionControl: false,
    },
    basemaps: {
      vector: [],
      raster: [],
    },
  },
  ui: {
    mode: "view",
  },
  paint: undefined,
  types: undefined,
  debug: false,
};

/**
 * Runtime-injected default basemap entry used only when no basemap entries exist.
 *
 * @type {{ title: string, styleURL: string }}
 */
export const defaultBasemapVector = {
  title: "Open GIS Outdoors",
  styleURL:
    "https://raw.githubusercontent.com/OpenGIS/outdoors/refs/heads/master/style.json",
};

/**
 * @param {{ vector?: unknown[], raster?: unknown[] } | undefined} basemaps
 */
export function hasAnyBasemapEntries(basemaps) {
  const vectorCount = Array.isArray(basemaps?.vector)
    ? basemaps.vector.length
    : 0;
  const rasterCount = Array.isArray(basemaps?.raster)
    ? basemaps.raster.length
    : 0;

  return vectorCount + rasterCount > 0;
}

/**
 * @param {{ vector?: object[], raster?: object[] }} basemaps
 */
export function resolveRuntimeBasemapDefaults(basemaps) {
  const vector = Array.isArray(basemaps?.vector) ? basemaps.vector : [];
  const raster = Array.isArray(basemaps?.raster) ? basemaps.raster : [];

  if (!hasAnyBasemapEntries({ vector, raster })) {
    return {
      vector: [{ ...defaultBasemapVector }],
      raster: [],
    };
  }

  return { vector, raster };
}
