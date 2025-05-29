import L from "leaflet";
import {
  getTypeData,
  getFeatureType,
  getIconData,
  getOverlayTypeKey,
} from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

// Creates a Leaflet map instance
export const createMap = (containerID = "", leafletOptions = {}) => {
  // Create Leaflet instance
  return L.map(containerID, leafletOptions);
};

export const createTileLayerGroup = (tileConfigArray = []) => {
  const layerGroup = L.layerGroup();

  // Create Tile Layers
  if (Array.isArray(tileConfigArray)) {
    // Each Tile Layer
    tileConfigArray.forEach((tile_data) => {
      // Create Tile Layer
      layerGroup.addLayer(
        L.tileLayer(tile_data.layer_url, {
          maxZoom: parseInt(tile_data.layer_max_zoom),
          attribution: tile_data.layer_attribution,
          name: tile_data.layer_name,
        }),
      );
    });
    // Default to OpenStreetMap
  } else {
    layerGroup.addLayer(
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?r=1", {
        maxZoom: 19,
        attribution:
          '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        name: "OpenStreetMap",
      }),
    );
  }

  return layerGroup;
};

export const createDataLayer = (geoJSON = [], onEachFeature = () => {}) => {
  // Create Data Layer
  return L.geoJSON(geoJSON, {
    pointToLayer,
    onEachFeature,
  });
};

// Not exported...

// Create Marker
const pointToLayer = (feature, latlng) => {
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
  return L.marker([latlng.lat, latlng.lng], {
    icon: L.divIcon({
      className: iconData.className,
      html: el,
      iconSize: iconData.iconSize,
      iconAnchor: iconData.iconAnchor,
    }),
  });
};
