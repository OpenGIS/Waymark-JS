import L from "leaflet";
import { getTypeData, getIconData } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

/*
  ======= Creation =======
*/

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

/*
  ======= Methods =======
*/

export const isLayerInBounds = (layer, bounds) => {
  let contains = false;

  switch (layer.featureType) {
    case "marker":
      //In view
      contains = bounds.contains(layer.getLatLng());

      break;
    case "line":
      // Check if coords are in view
      layer.feature.geometry.coordinates.forEach((coords) => {
        if (!contains && bounds.contains(L.latLng(coords[1], coords[0]))) {
          contains = true;

          return;
        }
      });

      break;
    //In view
    // return mapBounds.contains()

    // case 'shape':
    //In view
    // return mapBounds.contains(overlay.layer.getLatLng())
  }

  return contains;
};

export const addLayerHighlight = (layer) => {
  console.log(layer.featureType);

  switch (layer.featureType) {
    case "marker":
      // Get marker
      const element = layer.getElement();

      // Add active class
      element.classList.add("waymark-active");

      break;

    case "line":
      const typeKey = makeKey(layer.feature.properties.type);
      const typeData = getTypeData(layer.featureType, typeKey);

      // Highlight Layer
      layer.setStyle({
        color: "#ff0000",
        weight: parseInt(typeData.line_weight) + 2,
        opacity: 1,
      });

      break;
  }
};

export const removeLayerHighlight = (layer) => {
  switch (layer.featureType) {
    case "marker":
      // Get marker
      const element = layer.getElement();

      // Remove active class
      element.classList.remove("waymark-active");

      break;

    case "line":
      const typeKey = makeKey(layer.feature.properties.type);
      const typeData = getTypeData(layer.featureType, typeKey);

      // Highlight Layer
      layer.setStyle({
        color: typeData.line_colour,
        weight: parseInt(typeData.line_weight),
        opacity: typeData.line_opacity,
      });

      break;
  }
};

export const flyToLayer = (layer) => {
  switch (layer.featureType) {
    case "marker":
      layer._map.flyTo(layer.getLatLng(), layer._map.getZoom(), {
        duration: 0.5,
      });

      break;

    case "line":
      // Set to bounds of Line
      const lineBounds = L.latLngBounds(layer.getLatLngs());
      layer._map.flyToBounds(lineBounds, {
        duration: 0.5,
      });

      break;
  }
};

/*
  ======= Private =======
*/

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
