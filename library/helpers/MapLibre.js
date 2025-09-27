// Import MapLibre
import { Map, Marker } from "maplibre-gl";
import { Overlay } from "@/classes/Overlay.js";

/* 
  ======= Constants =======
*/

export const fitBoundsOptions = {
  padding: { top: 50, bottom: 50, left: 50, right: 50 },
  duration: 1000,
};

export const flyToOptions = {
  duration: 1000,
};

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

export const createMarker = (overlay = {}) => {
  // // Checks
  if (!(overlay instanceof Overlay) || overlay.featureType !== "marker") {
    return null;
  }

  // Create a DOM element for the marker
  const el = document.createElement("div");
  el.className = overlay.type.iconData.className;
  el.innerHTML = overlay.type.iconData.html;
  el.style.width = `${overlay.type.iconData.iconSize[0]}px`;
  el.style.height = `${overlay.type.iconData.iconSize[1]}px`;

  // Create Marker
  const marker = new Marker({
    element: el,
    offset: overlay.type.iconData.iconAnchor,
  });

  marker.setLngLat(overlay.feature.geometry.coordinates);

  return marker;
};

export const createLineSource = (overlay = {}) => {
  // Overlay must be an instance of Overlay
  if (!(overlay instanceof Overlay) || overlay.featureType !== "line") {
    return null;
  }

  return {
    type: "geojson",
    data: overlay.feature,
  };
};

export const createLineStyle = (overlay = {}, id = "") => {
  // Checks
  if (!(overlay instanceof Overlay) || overlay.featureType !== "line" || !id) {
    return null;
  }

  return {
    id: id,
    type: "line",
    source: id,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": overlay.type.data.line_colour,
      "line-width": parseFloat(overlay.type.data.line_weight),
    },
  };
};
