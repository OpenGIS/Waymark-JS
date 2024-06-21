export function createMapStyle(tile_data = {}) {
  const style = {
    version: 8,
    sources: {},
    layers: [],
  };

  // If we don't have a tile layer, return default style
  if (!tile_data.layer_url) {
    style.sources["OpenStreetMap"] = {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    };

    style.layers.push({
      id: "OpenStreetMap",
      type: "raster",
      source: "OpenStreetMap",
    });

    return style;
  }

  // Add Tile Layer
  style.sources[tile_data.layer_name] = {
    type: "raster",
    tiles: [tile_data.layer_url],
    tileSize: 256,
    attribution: tile_data.layer_attribution,
  };

  style.layers.push({
    id: tile_data.layer_name,
    type: "raster",
    source: tile_data.layer_name,
  });

  return style;
}
