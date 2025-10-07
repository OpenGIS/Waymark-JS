# Waymark JS

> [!CAUTION]
> Waymark JS v2 is currently in alpha. Many features are not yet implemented. Please see the [To-Do list](/readme.md#to-do) for details.

_Create, Edit and Share Meaningful Maps_

Waymark JS is a JavaScript library for creating and sharing geographical information. It is designed to be easy to use and intuitive, and is suitable for a wide range of applications due to its flexibility and customisation [options](/docs/v2/2.instances.md#map-options). Waymark JS stores data in GeoJSON format.

Built on the shoulders of giants:

- [MapLibre GL JS](https://maplibre.org/) for map rendering
- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [OpenFreeMap](https://openfreemap.org/) for vector tiles

## Demo

View the **[Demo](https://www.waymark.dev/js/v2.html)**.

## Installation

### NPM

To install via NPM, run:

```bash
npm install @ogis/waymark-js
```

Then import the library and CSS in your JavaScript:

```javascript
import { Instance } from "@ogis/waymark-js";
import "@ogis/waymark-js/dist/waymark-js.css";
```

### CDN

#### ES Module

To use via CDN, include the following in your HTML:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@ogis/waymark-js/dist/waymark-js.css"
/>

<script type="module">
  import { Instance } from "https://unpkg.com/@ogis/waymark-js/dist/waymark-js.js";
</script>
```

#### UMD

When you can't rely on native ES modules, you can load the bundled UMD build via a classic `<script>` tag. The bundle exposes a `WaymarkJS` global with the same `Instance` class that the package exports.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link
      rel="stylesheet"
      href="https://unpkg.com/@ogis/waymark-js/dist/waymark-js.css"
    />
    <script
      defer
      src="https://unpkg.com/@ogis/waymark-js/dist/waymark-js.umd.cjs"
    ></script>
  </head>
  <body>
    <div id="waymark-instance" style="height: 480px"></div>
    <script>
      window.addEventListener("DOMContentLoaded", () => {
        const instance = new WaymarkJS.Instance();
      });
    </script>
  </body>
</html>
```

If you're self-hosting the assets, replace the CDN URLs with your local `waymark-js.css` and `waymark-js.umd.cjs` paths.

## Usage

### HTML

Add a container element for the Instance:

```html
<div id="waymark-instance" style="height: 480px"></div>
```

> [!NOTE]
> The element that contains the Instance must have a **height** set, either inline or via CSS.

### JavaScript

Create a Waymark Instance with your configuration, then load some GeoJSON data:

```javascript
import { Instance } from "@ogis/waymark-js";
import "@ogis/waymark-js/dist/waymark-js.css";

// Create a Waymark Instance with this configuration
const instance = new Instance({
  // See [Map Options](docs/v2/2.instances.md#map-options) for details
  map_options: {
    // This is the default, so can be omitted
    div_id: "waymark-instance",

    // Passed directly to MapLibre GL JS
    // See [MapLibre Map Options](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/)
    maplibre_options: {
      zoom: 12,
    },

    // See [Marker Types](docs/v2/2.instances.md#marker-types) for details
    marker_types: [
      {
        marker_title: "Pub",
        marker_shape: "marker",
        marker_size: "large",
        icon_type: "icon",
        marker_icon: "ion-beer",
        marker_colour: "#fbfbfb",
        icon_colour: "#754423",
      },
    ],
  },
});

// Load this GeoJSON, which contains a single "pub" Marker
instance.loadGeoJSON({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        type: "pub",
        title: "The Scarlet Ibis",
        description:
          "Great pub, great food! Especially after a Long Ride 🚴🍔🍟🍺🍺💤",
        image_large_url: "https://www.waymark.dev/assets/geo/pub.jpeg",
      },
      geometry: {
        type: "Point",
        coordinates: [-128.0094, 50.6539],
      },
    },
  ],
});
```

## Documentation

1. [Start Here](docs/v2/1.index.md)
2. [Instances](docs/v2/2.instances.md)

## Project Structure

- `library/` — Source library (Vue app entry, components, composables, helpers, Pinia store)
  - `components/App.vue` — Root component bootstrapped by each Instance
  - `components/Map.vue` & `components/UI/` — Map canvas and supporting UI panels
  - `composables/useMap.js` — Instance methods (`loadGeoJSON`, `toGeoJSON`, `clearGeoJSON`)
  - `stores/instanceStore.js` — Shared Pinia store holding instance state
  - `classes/` — Configuration and type helpers for overlays, tile layers, and map types
  - `assets/css/` — Packaged stylesheets (`index.css`, marker theming, reset)
- `docs/v2/` — End-user documentation (Getting started, Instance configuration, map/marker options)
- `dev/` — Sample datasets and configuration snapshots used during development
- `index.html` — Local playground entry when running the dev server
- `vite.config.js` — Library build configuration (outputs ESM + UMD bundles to `dist/`)

## Instance API

Calling `new Instance(config)` mounts the Vue application, normalises configuration via `Config`, and returns an object for managing overlays.

### Instantiation

- `const instance = new Instance(config)` — Targets `config.map_options.div_id` (default `waymark-instance`). If the element is missing, a full-height container is appended to `document.body`.
- Configuration is parsed through `library/classes/Config.js`, which merges defaults and constructs helper classes for tile layers and overlay types.

### Constructor configuration (`config`)

- `map_options.div_id` _(string)_ — DOM ID for the map container.
- `map_options.maplibre_options` _(object)_ — Overrides MapLibre defaults (center `[-1.8261632, 51.1788144]`, zoom `14`, maxZoom `18`, style `https://tiles.openfreemap.org/styles/bright`, attributionControl `false`).
- `map_options.tile_layers` _(array)_ — Basemap definitions converted into `TileLayer` instances (`layer_name`, `layer_url`, `layer_attribution`, `layer_max_zoom`).
- `map_options.marker_types` _(array)_ — Marker presets mapped to `MarkerType` objects (defaults: title `Marker`, shape `marker`, size `large`, icon `ion-pin`, colours from `defaultMarkerColour`).
- `map_options.line_types` _(array)_ — Line presets mapped to `LineType` objects (defaults: title `Line`, colour `defaultLineColour`, weight `3`, opacity `1`).
- `map_options.shape_types` _(array)_ — Polygon presets mapped to `ShapeType` objects (defaults: title `Shape`, colour `defaultShapeColour`, fill opacity `0.5`).
- Omitted sections fall back to safe defaults; planned options (`map_init_basemap`, `show_scale`, `debug_mode`) are not yet available.

### Methods on the Instance

- `loadGeoJSON(featureCollection)` — Replaces overlays with the supplied GeoJSON FeatureCollection. Features are typed as markers, lines, or shapes based on geometry and can reference defined type keys.
- `toGeoJSON()` — Returns the current overlays as a GeoJSON FeatureCollection for export or persistence.
- `clearGeoJSON()` — Removes all overlays, leaving the map canvas and basemaps intact.

## To-Do

### Configuration

- [ ] Map Options:
  - [ ] `map_init_basemap`
  - [ ] `show_scale`
  - [ ] `debug_mode`
- [ ] Viewer Options
- [ ] Editor Options
- [ ] Langugage

### Features

- [ ] GPX/KML Import/Export
- [ ] Marker Clustering
- [ ] Locate button

## Development

> [!IMPORTANT]
> To build Waymark JS from source, you will need [Node + NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```
