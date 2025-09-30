import {
  createTileLayerSource,
  createTileLayerStyle,
} from "@/helpers/MapLibre.js";
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
    };

    this.data = { ...defaults, ...layerData };
    this.id = makeKey(this.data.layer_name);
  }

  addTo(map) {
    if (!map || !map.addLayer) {
      return;
    }

    map.addSource(this.id, createTileLayerSource(this));
    map.addLayer(createTileLayerStyle(this));
  }
}
