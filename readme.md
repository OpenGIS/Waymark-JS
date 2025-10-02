# Waymark JS

## Installation

```bash
npm install @ogis/waymark-js
```

## Usage

### Using in a build process (ES modules)

```html
<div id="waymark-map" style="height: 480px"></div>
```

```javascript
import { useWaymark } from "@ogis/waymark-js";
import "@ogis/waymark-js/dist/waymark-js.css";

const instance = useWaymark().createInstance({
  map_options: {
    div_id: "waymark-map",
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

### Loading directly from npm (no build step)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link
      rel="stylesheet"
      href="https://unpkg.com/@ogis/waymark-js/dist/waymark-js.css"
    />
  </head>
  <body>
    <div id="waymark-map" style="height: 480px"></div>
    <script type="module">
      import { useWaymark } from "https://unpkg.com/@ogis/waymark-js/dist/waymark-js.js";

      const instance = useWaymark().createInstance({
        map_options: {
          div_id: "waymark-map",
          maplibre_options: {
            zoom: 16,
          },

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
    </script>
  </body>
</html>
```

## Instance API

Calling `createInstance()` returns:

- `store`: a collection of Pinia refs (from `useInstanceStore()`), including reactive state such as `mapReady`, `overlays`, `activeOverlay`, `activeFeatureType`, and panel visibility flags.
- `loadGeoJSON(geojson)`: queues GeoJSON features for rendering on the map.
- `clearGeoJSON()`: removes every overlay from the map and resets the active selection.
- `toGeoJSON()`: exports all current overlays as a fresh GeoJSON `FeatureCollection`.

## Development

> [!IMPORTANT]
> To build Waymark JS from source, you will need [Node and NPM installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```
