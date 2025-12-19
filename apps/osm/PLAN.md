# Implementation Plan: Extract and Display PBF Geometries

## Goal
Extract geometries from the loaded OpenStreetMap PBF tiles and display them on the map using `instance.loadGeoJSON()`.

## Context
- **App Entry**: `apps/osm/index.html`
- **Current State**: Displays a debug panel with PBF URLs.
- **Requirement**: Fetch the PBF data, parse it into GeoJSON, and render it using the Waymark instance.

## Technical Strategy

1.  **Library Selection**:
    -   Use `@mapbox/vector-tile` (or a browser-compatible equivalent like `vector-tile-esm` or a bundled version) to parse the PBF data.
    -   Use `pbf` (Protocol Buffers for JavaScript) as the underlying decoder.
    -   *Constraint*: Since we are in a browser environment without a build step for this specific app (it uses ES modules), we need a way to import these libraries. We can use a CDN like `esm.sh` or `unpkg`.

2.  **Data Flow**:
    -   Intercept tile requests (already done via `transformRequest`).
    -   *Correction*: `transformRequest` only sees the URL. It doesn't give access to the response body.
    -   *New Approach*: We need to `fetch` the PBF data ourselves.
    -   Since MapLibre is already fetching the tiles, fetching them *again* might be wasteful, but it's the cleanest way to get the raw buffer without deep-diving into MapLibre's internal cache (which stores parsed buckets, not raw PBFs usually).
    -   *Optimization*: Only fetch a few tiles or use the ones visible in the debug panel.

3.  **Parsing Logic**:
    -   Fetch PBF -> ArrayBuffer.
    -   `new Pbf(buffer)`.
    -   `new VectorTile(pbf)`.
    -   Iterate through layers (e.g., `transportation`, `building`).
    -   Iterate through features.
    -   Convert vector tile features to GeoJSON.
        -   This requires converting tile coordinates (0-4096) to Lat/Lng based on the tile's Z/X/Y.

4.  **GeoJSON Conversion**:
    -   We need a helper to convert tile coordinates to WGS84.
    -   `feature.toGeoJSON(x, y, z)` is often provided by libraries like `@mapbox/vector-tile`.

5.  **Integration**:
    -   Add a "Load Data" button next to each URL in the debug panel.
    -   When clicked:
        1.  Fetch the PBF.
        2.  Parse to GeoJSON.
        3.  Call `instance.loadGeoJSON(geojson)`.

## Implementation Steps

1.  **Import Dependencies**:
    -   Import `pbf` and `@mapbox/vector-tile` from `esm.sh` in `apps/osm/index.html`.

2.  **Update Debug Panel**:
    -   Add a button to each tile entry: `<button onclick="loadTileData('...')">Load</button>`.

3.  **Implement `loadTileData(url)`**:
    -   Extract Z/X/Y from URL.
    -   Fetch URL -> ArrayBuffer.
    -   Parse with `VectorTile`.
    -   Convert all features to a GeoJSON FeatureCollection.
    -   Pass to `instance.loadGeoJSON()`.

4.  **Refine GeoJSON Conversion**:
    -   The `VectorTileFeature.toGeoJSON(x, y, z)` method is the key.
    -   We need to ensure the projection logic is correct.

## Code Snippet (Draft)

```javascript
import Pbf from 'https://esm.sh/pbf';
import { VectorTile } from 'https://esm.sh/@mapbox/vector-tile';

async function loadTileData(url) {
  // 1. Extract Z/X/Y
  const match = url.match(/\/(\d+)\/(\d+)\/(\d+)\.pbf/);
  if (!match) return;
  const [_, z, x, y] = match.map(Number);

  // 2. Fetch
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  // 3. Parse
  const tile = new VectorTile(new Pbf(buffer));
  const features = [];

  // 4. Iterate Layers
  for (const layerName in tile.layers) {
    const layer = tile.layers[layerName];
    for (let i = 0; i < layer.length; i++) {
      const feature = layer.feature(i);
      // 5. Convert to GeoJSON
      const geojson = feature.toGeoJSON(x, y, z);
      // Add properties for styling/debugging
      geojson.properties = { ...geojson.properties, layer: layerName };
      features.push(geojson);
    }
  }

  // 6. Load into Waymark
  const fc = { type: "FeatureCollection", features };
  instance.loadGeoJSON(fc);
}
```
