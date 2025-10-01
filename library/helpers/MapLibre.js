// Import MapLibre
import { Map, Marker } from "maplibre-gl";
import { Overlay } from "@/classes/Overlay.js";
import { TileLayer } from "@/classes/TileLayer.js";

/* 
  ======= Constants =======
*/

export const fitBoundsOptions = {
  padding: { top: 50, bottom: 50, left: 50, right: 50 },
  duration: 0,
};

export const flyToOptions = {
  duration: 1000,
};

export const mapOptions = {
  center: [-1.8261632, 51.1788144], // Default to Stonehenge
  zoom: 18,
  style: "https://tiles.openfreemap.org/styles/liberty",
};

/*
  ======= Creation =======
*/

// Creates a MapLibre Map instance
export const createMap = (containerID = "", mapLibreMapOptions = {}) => {
  return new Map({
    container: containerID,
    ...mapLibreMapOptions,
  });
};

export const createTileLayerSource = (tileLayer = {}) => {
  if (!(tileLayer instanceof TileLayer)) {
    return null;
  }

  return {
    type: "raster",
    tiles: [tileLayer.data.layer_url],
    tileSize: 256,
    maxzoom: parseInt(tileLayer.data.layer_max_zoom) || 18,
  };
};

export const createTileLayerStyle = (tileLayer = {}, visible = false) => {
  if (!(tileLayer instanceof TileLayer)) {
    return null;
  }

  return {
    id: tileLayer.id,
    type: "raster",
    source: tileLayer.id,
    attribution: tileLayer.data.layer_attribution || "",
    layout: {
      visibility: visible ? "visible" : "none",
    },
  };
};

export const createShapeSource = (overlay = {}) => {
  // Overlay must be an instance of Overlay
  if (!(overlay instanceof Overlay) || overlay.featureType !== "shape") {
    return null;
  }

  return {
    type: "geojson",
    data: overlay.feature,
  };
};

export const createShapeStyle = (overlay = {}, id = "") => {
  // Checks
  if (!(overlay instanceof Overlay) || overlay.featureType !== "shape" || !id) {
    return null;
  }

  return {
    id: id,
    type: "fill",
    source: id,
    layout: {},
    paint: {
      "fill-color": overlay.type.data.shape_fill_colour || "#000000",
      "fill-opacity": parseFloat(overlay.type.data.shape_fill_opacity) || 0.5,
      "fill-outline-color": overlay.type.data.shape_outline_colour || "#000000",
    },
  };
};
