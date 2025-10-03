# Waymark JS

> [!CAUTION]
> Waymark JS v2 is currently in alpha. Many features are not yet implemented. Please see the [To-Do list](/readme.md#to-do) for details.

_Create, Edit and Share Meaningful Maps_

Waymark JS is a JavaScript library for creating and sharing geographical information. It is designed to be easy to use and intuitive, and is suitable for a wide range of applications due to its flexibility and customisation [options](/docs/v2/2.instances.md#map-options). Waymark JS stores data in GeoJSON format.

Built on the shoulders of giants:

- [MapLibre GL JS](https://maplibre.org/) for map rendering
- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [OpenFreeMap](https://openfreemap.org/) for vector tiles

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

## To-Do

Alpha

- [ ] Demo PAGE

Later

- [ ] Map Options:
  - [ ] `map_init_basemap`
  - [ ] `show_scale`
  - [ ] `debug_mode`
- [ ] Viewer Options
- [ ] Editor Options
- [ ] GPX/KML Import/Export

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
