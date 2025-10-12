import { makeKey } from "@/helpers/Common.js";

export class TileLayer {
  // Set defaults
  constructor(layerData) {
    const defaults = {
      layer_name: "Open Street Map",
      layer_url: "http://tile.openstreetmap.org/{z}/{x}/{y}.png",
      layer_attribution:
        '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      layer_max_zoom: "18",
      layer_opacity: "1.0",
    };

    this.data = { ...defaults, ...layerData };
    this.id = makeKey(this.data.layer_name);
  }

  addTo(map, visible = false) {
    if (!map || !map.addLayer) {
      return;
    }

    map.addSource(this.id, this.toSource());
    map.addLayer(this.toStyle(visible));
  }

  toSource() {
    return {
      type: "raster",
      tiles: [this.data.layer_url],
      tileSize: 256,
      maxzoom: parseInt(this.data.layer_max_zoom) || 18,
    };
  }

  toStyle(visible = false) {
    return {
      id: this.id,
      type: "raster",
      source: this.id,
      attribution: this.data.layer_attribution || "",
      layout: {
        visibility: visible ? "visible" : "none",
      },
      paint: {
        "raster-opacity": parseFloat(this.data.layer_opacity) || 1.0,
      },
    };
  }

  getTitle() {
    return this.data.layer_name || "Tile Layer";
  }

  /* tileLayer.previewCoords(map.getCenter().lat, map.getCenter().lng) */

  previewCoords(lat, lng) {
    if (!lat || !lng) {
      return this.data.layer_url;
    }

    const zoom = Math.min(
      Math.max(parseInt(this.data.layer_max_zoom) - 4, 0),
      18,
    );
    const tileX = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
    const tileY = Math.floor(
      ((1 -
        Math.log(
          Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180),
        ) /
          Math.PI) /
        2) *
        Math.pow(2, zoom),
    );

    return this.data.layer_url
      .replace("{z}", zoom)
      .replace("{x}", tileX)
      .replace("{y}", tileY);
  }
}
