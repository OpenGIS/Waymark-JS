# Waymark JS

> [!TIP]
> Version 2 Alpha available [here](https://github.com/OpenGIS/Waymark-JS/tree/two)!
> Please note that Version 2 is currently in Pre-Release and may contain bugs or incomplete features. It is not recommended for production use at this time.

Create, share and edit _meaningful_ Maps.

Waymark JS is a JavaScript library for sharing geographical information. It is designed to be easy to use, intuitive and suitable for a wide range of applications.

Originally developed for the [Waymark WordPress plugin](https://wordpress.org/plugins/waymark/), Waymark JS is a standalone library that can be used to add interactive Maps to _any website_.

Powered by [Leaflet JS](https://leafletjs.com/) with [OpenStreetMap](https://www.openstreetmap.org/) as the default Basemap. Waymark JS stores data in GeoJSON format, with support for GPX and KML files.

> Waymark JS is completely free, [Open-Source](https://github.com/OpenGIS/Waymark-JS) and requires **no API keys**! ❤️

## Documentation / Demo

Demo and and documentation [waymark.dev/js](https://www.waymark.dev/js)

## Installation

To use Waymark JS, you will need to include the following assets in your page. Here we are adding them to the `<head>` of the document so they are immediately available to the `<body>`:

> [!IMPORTANT]
> The `dist/` [directory](https://github.com/OpenGIS/Waymark-JS/tree/master/dist) in the project root contains the assets ready for _production_ use. The `src/` directory contains the source files for development which can be modified and built using the instructions in the [Development](#development) section below.

```html
<!-- jQuery (required) -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- Waymark CSS & JavaScript -->
<link rel="stylesheet" href="dist/css/waymark-js.min.css" />
<script src="dist/js/waymark-js.min.js"></script>
```

> [!TIP]
> Waymark JS requires the `jQuery` global to be available before creating a Map. If you are not already using [jQuery](https://jquery.com/), you can include it from a CDN as shown above.

## Quick Start

### Viewer

The following example will display a Map on the page with a single Marker. Once the Marker is clicked, a popup will display with the Marker's title, image and description.

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />

    <!-- Stylesheet -->
    <link rel="stylesheet" href="dist/css/waymark-js.css" />

    <!-- JS -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="dist/js/waymark-js.js"></script>
  </head>
  <body>
    <!-- Map Container -->
    <div id="waymark-map"></div>

    <script>
      // Create a Viewer Instance
      const viewer = window.Waymark_Map_Factory.viewer();

      viewer.init();
      viewer.load_json({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
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

### Editor

The following example will display an empty Map Editor on the page, set to an initial location. Any edits made to the Map are converted to GeoJSON and output into the `<textarea id="waymark-data">` data container.

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />

    <!-- Stylesheet -->
    <link rel="stylesheet" href="dist/css/waymark-js.min.css" />

    <!-- JS -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="dist/js/waymark-js.min.js"></script>
  </head>
  <body>
    <!-- Map Container -->
    <div id="waymark-map"></div>

    <!-- Map Data -->
    <textarea id="waymark-data"></textarea>

    <script>
      // Create the Editor
      window.Waymark_Map_Factory.editor().init({
        map_options: {
          // Initial location
          map_init_latlng: [50.6539, -128.0094],
          map_init_zoom: 14,
        },
      });
    </script>
  </body>
</html>
```

> [!TIP]
> View the full documentation and examples at [waymark.dev/js](https://www.waymark.dev/js)

## Development

> [!IMPORTANT]
> To build Waymark JS from source, you will need [Node and NPM installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

### Setup

```bash
# Clone the repository
git clone https://github.com/OpenGIS/Waymark-JS
cd Waymark-JS

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (watch mode)
grunt

# Run tests
npm test
```

### Testing

Tests will mirror the documentation structure to ensure full coverage of documented features.

```
Waymark-JS/
├── docs/
│   └── content/
│       ├── 1.index.md
│       ├── 2.map.md
│       ├── 3.viewer.md
│       ├── 4.editor.md
│       └── 5.customise.md
├── tests/
│   ├── setup.js          # Global test setup (loads globals like $, L)
│   └── docs/
│       ├── 1.index.test.js
│       ├── 2.map.test.js
│       ├── 3.viewer.test.js
│       ├── 4.editor.test.js
│       └── 5.customise.test.js
├── vite.config.js        # Vite/Vitest configuration
└── package.json
```

## Handling Legacy Code (Non-Module)

Since the source code (`src/js/*.js`) uses global function declarations and is not modular (ESM), we cannot simply `import` the files.
**Strategy**:

1. In `tests/setup.js`, we will use `fs` to read the source files.
2. We will execute the file contents in the global scope (using `window.eval` or similar) to register `Waymark_Map`, `Waymark_Map_Viewer`, etc., on the `window` object, mimicking the browser behavior.
3. jQuery and Leaflet will be attached to `window` before loading the source code.

## Test-Documentation Synchronization

To keep tests and docs in sync:

1. **Naming Convention**: Test files correspond 1:1 with doc files.
2. **Section Mapping**: `describe` blocks in tests will match the headers in the markdown files.
   - Example: `## Map Options` in `2.map.md` -> `describe('Map Options', ...)` in `2.map.test.js`.
3. **Concept Verification**: Tests will implement the code examples found in the docs and assert the expected outcome.

## Example Test Structure (`tests/docs/2.map.test.js`)

```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('2. Map Configuration', () => {
  let waymark;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '<div id="waymark-map"></div>';
  });

  describe('Basic Initialization', () => {
    it('should initialize the map with default options', () => {
      // Corresponds to basic usage example in docs
      waymark = new Waymark_Map();
      waymark.init({
        map_div_id: 'waymark-map'
      });

      expect(document.querySelector('.leaflet-container')).toBeTruthy();
    });
  });

  describe('Loading Data', () => {
    it('should load GeoJSON data', () => {
      waymark = new Waymark_Map();
      waymark.init();

      const geojson = { ... }; // Example data from docs
      waymark.load_json(geojson);

      // Assertions to verify data is on map
    });
  });
});
```
