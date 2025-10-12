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
}
