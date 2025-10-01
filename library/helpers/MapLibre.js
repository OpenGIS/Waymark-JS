// Import MapLibre
import { Map } from "maplibre-gl";
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
  ======= Helpers =======
*/

export function doBoundsIntersect(boundsA, boundsB) {
  // Check if north and south are the same or different
  const northA = boundsA.getNorth();
  const southA = boundsA.getSouth();
  const eastA = boundsA.getEast();
  const westA = boundsA.getWest();

  const northB = boundsB.getNorth();
  const southB = boundsB.getSouth();
  const eastB = boundsB.getEast();
  const westB = boundsB.getWest();

  // Logic to check for intersection
  // if one box is entirely above the other, they do not intersect
  if (northA < southB || southA > northB) {
    return false;
  }

  // if one box is entirely to the left of the other, they do not intersect
  if (eastA < westB || westA > eastB) {
    return false;
  }

  return true; // If no non-intersecting condition is met, they intersect
}

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
