---
last_commit: "4dddba6be208e53c3d40b03c60c68ce0c0174eef"
---

# Waymark JS

> Create, share and edit _meaningful_ Maps.

> [!WARNING]
> **v2 (Alpha)** — This is a ground-up rewrite from the Leaflet-based original. APIs are unstable and subject to change.

> [!NOTE]
> No API keys required. OpenStreetMap and OpenFreeMap tiles included out of the box.

## Overview

Waymark JS is a browser library for rendering interactive maps with data layers. It stores geographic data as GeoJSON and supports raster and vector tile basemaps.

v2 is a complete rewrite — from jQuery + Leaflet to a modern ES module built with [MapLibre GL](https://maplibre.org/), [Vue 3](https://vuejs.org/) and [Vite](https://vite.dev/).

## Installation

```bash
npm install waymark-js
```

## Quick start

```html
<div id="map" style="height: 400px"></div>

<script type="module">
  import { createInstance } from "waymark-js";
  import "waymark-js/waymark.css";

  const instance = createInstance({
    config: {
      id: "map",
      map: {
        options: {
          center: [-0.1276, 51.5074],
          zoom: 10,
        },
      },
    },
  });

  instance.on("waymark:map.load", () => {
    console.log("Map ready", instance.toJSON());
  });
</script>
```

## How it works

Waymark uses a document-based architecture. Pass a serialisable **InstanceDocument** to `createInstance()` — the same shape returned by `instance.toJSON()`:

```js
const instance = createInstance({
  config: {
    id: "map",
    map: {
      options: { center: [-0.1276, 51.5074], zoom: 10 },
      basemaps: {
        raster: [
          {
            tileURLTemplates: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            title: "OpenStreetMap",
          },
        ],
        vector: [
          {
            styleURL: "https://tiles.openfreemap.org/styles/bright",
            title: "OpenFreeMap Bright",
          },
        ],
      },
    },
  },
  data: {
    layers: [
      {
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { title: "Hello" },
              geometry: { type: "Point", coordinates: [-0.1276, 51.5074] },
            },
          ],
        },
      },
    ],
  },
});
```

Serialisable `config.map.options` values are passed through to the MapLibre `Map` constructor, except `container` (always set by Waymark) and `style` (managed via basemaps).

Calling `createInstance()` with the same `id` destroys the previous instance and creates a fresh one.

### Key concepts

- **Instance** — the object returned by `createInstance()`, with lifecycle, event, data, and UI methods.
- **InstanceDocument** — the serialisable payload accepted as input and returned by `toJSON()`. Round-trip safe.
- **Config** — the authored baseline. Remains stable across serialisation.
- **State** — runtime delta only. Persisted when values diverge from config.
- **Data layers** — GeoJSON in `data.layers[]`, added at init or via `instance.data.addLayer()`.

## Events

Events are dispatched as `CustomEvent`s on the instance container. Use the standard `on`/`off`/`once` API:

```js
instance.on("waymark:map.load", handler);
instance.once("waymark:instance.destroyed", handler);
```

Lifecycle: `waymark:instance.created`, `waymark:instance.recreated`, `waymark:instance.destroyed`

Map: `waymark:map.load`, `waymark:map.moveend`, `waymark:map.zoomend`, `waymark:map.rotateend`, `waymark:map.pitchend`, `waymark:map.error`

Data: `waymark:data.layer.added`, `waymark:data.layer.mounted`, `waymark:data.layer.error`

State: `waymark:state.changed`, `waymark:state.*`

See the [API reference](docs/1.api.md#instance-event-api) for payload shapes.

## Runtime requirements

- Browser runtime with DOM access (not SSR-safe)
- The target container element must exist before calling `createInstance()`
- If `config.id` is omitted, Waymark generates one and appends the container to `document.body`
- Map rendering depends on browser canvas/WebGL support via MapLibre GL

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm test             # Unit tests (Vitest)
npm run test:browser # Browser tests (Playwright)
npm run build        # Production bundle to dist/
npm run format       # Format with Prettier
npm run docs:sync    # Sync generated docs and SKILL.md
```

## Further Reading

- [API reference](docs/1.api.md) — Full consumer API contract, config defaults, events, and serialisation
- [Development guide](docs/2.development.md) — Contributor workflow, conventions, and testing
- [Instances](docs/3.instances.md) — Internal lifecycle and serialisation semantics
- [Map module](docs/4.map.md) — MapLibre wiring, basemaps, and state sync
- [UI module](docs/5.ui.md) — Shell components, mode system, and debug panel
- [Data & GeoJSON](docs/6.data.md) — Layer contract, validation, and runtime behaviour
- [Docs index](docs/README.md)
