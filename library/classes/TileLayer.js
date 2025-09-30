/*
    {
      "layer_name": "Open Street Map",
      "layer_url": "http://tile.openstreetmap.org/{z}/{x}/{y}.png",
      "layer_attribution": "\u00a9 <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
      "layer_max_zoom": "18"
    }
*/
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
  }
}
