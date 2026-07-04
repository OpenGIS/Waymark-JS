import { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { getActiveVectorBasemap } from "./basemaps.js";

const EMPTY_STYLE = {
  version: 8,
  sources: {},
  layers: [],
};

/**
 * @param {string} containerId
 * @param {{ map: { options: object, basemaps: { vector: Array<{ styleURL: string | object }> } } }} config
 * @returns {import('maplibre-gl').Map}
 */
export function createMap(containerId, config) {
  const activeVectorBasemap = getActiveVectorBasemap(config.map.basemaps);

  const map = new Map({
    ...config.map.options,
    style: activeVectorBasemap?.styleURL ?? EMPTY_STYLE,
    container: containerId,
  });

  map.on("style.load", () => {
    map.setProjection({ type: "globe" });
  });

  return map;
}
