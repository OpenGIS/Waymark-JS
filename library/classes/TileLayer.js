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
      layer_visible: true,
      layer_opacity: 1.0,
    };

    this.data = { ...defaults, ...layerData };
    this.id = `tile-layer-` + makeKey(this.data.layer_name);
  }

  addTo(map, visible = false) {
    if (!map || !map.addLayer) {
      return;
    }
    this.map = map;

    // Create Source
    this.map.addSource(this.id, this.toSource());
    this.source = this.map.getSource(this.id);

    // Create Layer
    this.map.addLayer(this.toStyle());
    this.layer = this.map.getLayer(this.id);
  }

  toSource() {
    return {
      type: "raster",
      tiles: [this.data.layer_url],
      tileSize: 256,
      maxzoom: parseInt(this.data.layer_max_zoom) || 18,
    };
  }

  toStyle() {
    const opacity = parseFloat(this.data.layer_opacity);

    return {
      id: this.id,
      type: "raster",
      source: this.id,
      attribution: this.data.layer_attribution || "",
      layout: {
        visibility: this.isVisible() ? "visible" : "none",
      },
      paint: {
        "raster-opacity": isNaN(opacity) ? 1.0 : opacity,
      },
    };
  }

  getTitle() {
    return this.data.layer_name || "Tile Layer";
  }

  isVisible() {
    // Boolean or String true/false
    return (
      this.data.layer_visible === true ||
      this.data.layer_visible === "true" ||
      this.data.layer_visible === "1" ||
      this.data.layer_visible === 1
    );
  }

  /* tileLayer.previewCoords(map.getCenter().lat, map.getCenter().lng) */

  previewCoords(lat, lng, zoom = 12) {
    if (!lat || !lng) {
      return this.data.layer_url;
    }

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

  toggleVisibility() {
    if (!this.map || !this.layer) {
      return;
    }
    const visibility = this.isVisible() ? "none" : "visible";
    this.map.setLayoutProperty(this.id, "visibility", visibility);
    this.data.layer_visible = !this.isVisible();
  }

  setOpacity(opacity) {
    if (!this.map || !this.layer) {
      return;
    }
    opacity = parseFloat(opacity);
    if (isNaN(opacity) || opacity < 0 || opacity > 1) {
      return;
    }
    this.map.setPaintProperty(this.id, "raster-opacity", opacity);
    this.data.layer_opacity = opacity;
  }
}
