# Waymark JS

## TODO

### v1.0.0

- [ ] Add more examples
- [ ] Create homepage on waymark.dev/js

Documentation:

- [x] Getting Started
  - [x] Installation
  - [x] Usage
- [x] Map
  - [x] Instances
  - [x] Viewer
  - [x] Editor
  - [x] Map Options
- [x] Viewer
  - [x] Creation
  - [x] Options
  - [x] Initialisation
  - [x] Loading Data
  - [x] Examples
- [x] Editor
  - [x] Creation
  - [x] Options
  - [x] Initialisation
  - [x] Loading Data
  - [x] Retrieving Data
  - [x] Examples
- [ ] Customising
  - [ ] Styling
  - [ ] Extending
    - [ ] Leaflet & jQuery
    - [ ] Callbacks
    - [ ] Uploads
  - [ ] Localisation

### v1.1.0

- [ ] Improve file/image upload integration & examples
- [ ] Assign default Type key if none provided
- [ ] Better handling of no/one Type provided
- [ ] jQuery check(/auto include?)

# Waymark JS

Create, share and edit _meaningful_ Maps.

Waymark JS is a JavaScript library for sharing geographical information. It is designed to be easy to use, intuitive suitable for a wide range of applications.

Originally developed for the [Waymark WordPress plugin](https://wordpress.org/plugins/waymark/), Waymark JS is a standalone library that can be used to add interactive Maps to _any website_.

## Features

- View and edit Maps
- Add and edit Markers, Lines, and Shapes
- Upload and view Photos (supports location metadata)
- Import GPX, KML, and GeoJSON files
- View Elevation profiles
- Search for locations
- Fullscreen mode
- Supports device location
- Cluster Markers
- Sleep/Wake options
  - Click/hover to interact with Map
  - Set the wake time and message
- Customisable
- Basemaps
- Colours, icons, and more (using Types)
- Map height and width
- Localisation

## Examples

<!-- TODO: list examples -->

See the [examples](./examples) directory for more examples.

### Viewer

The following example will display a Map on the page with a single Marker. Once the Marker is clicked, a popup will display with the Marker's title, image and description. You can see this example in action [here](./examples/viewer-readme.html).

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />

    <!-- Stylesheet -->
    <link rel="stylesheet" href="../dist/css/waymark-js.css" />

    <!-- JS -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="../dist/js/waymark-js.js"></script>
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

The following example will display an empty Map Editor on the page, set to an initial location. Any edits made to the Map are converted to GeoJSON and output into the `#waymark-data` textarea. You can see this example in action [here](./examples/editor-readme.html).

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

## Development

```bash
# Install dependencies
pnpm install

# Build
grunt
```

Pull requests are welcome, however please view the Roadmap below to see where the project is heading. For major changes, please open an issue first to discuss what you would like to change :)

## Roadmap

### v2.0.0

- Use Vite for bundling
- Use ES6 modules
- Remove Factory
- Create NPM package
- Tests
- [ ] Unit Tests
- [ ] E2E Tests

### v3.0.0

- Rewrite using MapLibre, Vue & TypeScript :)
- Integrate Leaflet too through an adapter?
- Modular
