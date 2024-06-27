import { Marker } from "maplibre-gl";
import { useInstanceStore } from "@/stores/instanceStore.js";

// Import Helpers
import { getTypeData, getFeatureType, getIconData } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

export function getMapStyle() {
  const { mapConfig } = useInstanceStore();

  let tile_data = {};

  // Use Config Tile Layer
  if (Array.isArray(mapConfig.tile_layers)) {
    tile_data = mapConfig.tile_layers[0];
  }

  const style = {
    version: 8,
    sources: {},
    layers: [],
  };

  // If we don't have a tile layer, return default style
  if (!tile_data.layer_url) {
    style.sources["OpenStreetMap"] = {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    };

    style.layers.push({
      id: "OpenStreetMap",
      type: "raster",
      source: "OpenStreetMap",
    });

    return style;
  }

  // Add Tile Layer
  style.sources[tile_data.layer_name] = {
    type: "raster",
    tiles: [tile_data.layer_url],
    tileSize: 256,
    attribution: tile_data.layer_attribution,
  };

  style.layers.push({
    id: tile_data.layer_name,
    type: "raster",
    source: tile_data.layer_name,
  });

  return style;
}

export function createMarker(feature = {}) {
  // Ensure is Marker with coordinates
  if (getFeatureType(feature) !== "marker" || !feature.geometry.coordinates) {
    return null;
  }

  const typeKey = makeKey(feature.properties.type);
  const typeData = getTypeData("marker", typeKey);
  const iconData = getIconData(typeData);

  // Create a DOM element for the marker
  const el = document.createElement("div");
  el.className = iconData.className;
  el.innerHTML = iconData.html;
  el.style.width = `${iconData.iconSize[0]}px`;
  el.style.height = `${iconData.iconSize[1]}px`;

  // Create Marker
  const marker = new Marker({
    element: el,
    offset: iconData.iconAnchor,
  });

  marker.setLngLat(feature.geometry.coordinates);

  return marker;
}
