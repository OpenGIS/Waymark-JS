// Import MapLibre
import { Map, Marker } from "maplibre-gl";

import { getFeatureType } from "@/helpers/Overlay.js";
import { getTypeData, getIconData } from "@/helpers/Type.js";
import { makeKey } from "@/helpers/Common.js";

/*
  ======= Creation =======
*/

// Creates a MapLibre Map instance
export const createMap = (
  containerID = "",
  mapStyle = {},
  maplibre_options = {},
) => {
  return new Map({
    container: containerID,
    style: mapStyle,
    ...maplibre_options,
  });
};

export const createMapStyle = (tileLayers) => {
  const style = {
    version: 8,
    sources: {},
    layers: [],
  };

  // Tile Layers
  if (Array.isArray(tileLayers)) {
    // Each Tile Layer
    tileLayers.forEach((tile_data) => {
      // Add Source
      style.sources[tile_data.layer_name] = {
        type: "raster",
        tiles: [tile_data.layer_url],
        tileSize: 256,
        attribution: tile_data.layer_attribution,
      };

      // Add Layer
      style.layers.push({
        id: tile_data.layer_name,
        type: "raster",
        source: tile_data.layer_name,
        layout: {
          visibility: "none",
        },
      });

      // Set first as visible
      if (style.layers.length === 1) {
        style.layers[0].layout.visibility = "visible";
      }
    });
  } else {
    // Default Tile Layer
    style.sources["OpenStreetMap"] = {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png?r=1"],
      tileSize: 256,
      attribution:
        '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    };

    style.layers.push({
      id: "OpenStreetMap",
      type: "raster",
      source: "OpenStreetMap",
    });
  }

  return style;
};

export const createMarker = (feature = {}) => {
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

  console.log("Creating Marker", iconData.iconAnchor);

  // Create Marker
  const marker = new Marker({
    element: el,
    offset: iconData.iconAnchor,
  });

  marker.setLngLat(feature.geometry.coordinates);

  return marker;
};

export const createLineSource = (feature = {}) => {
  // Ensure is LineString with coordinates
  if (getFeatureType(feature) !== "line" || !feature.geometry.coordinates) {
    return null;
  }

  return {
    type: "geojson",
    data: feature,
  };
};

export const createLineStyle = (feature = {}, id = false) => {
  // Ensure is LineString with coordinates
  if (getFeatureType(feature) !== "line" || !feature.geometry.coordinates) {
    return null;
  }

  // Ensure ID
  if (!id) {
    return null;
  }

  const typeKey = makeKey(feature.properties.type);
  const typeData = getTypeData("line", typeKey);

  return {
    id: id,
    type: "line",
    source: id,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": typeData.line_colour,
      "line-width": parseFloat(typeData.line_weight),
    },
  };
};
