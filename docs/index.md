# Waymark JS

## TODO / Milesones

### v1.0.0

-   [ ] Finish documentation
  -   [ ] Map Instances
  -   [ ] Common
  -   [ ] Viewer
  -   [ ] Editor
    -   [ ] Input/Ouput
  -   [ ] Installation
  -   [ ] Types
  -   [ ] Basemaps
  -   [ ] Add more examples
-   [ ] Create homepage on waymark.dev/js

### v2.0.0

-   Use Vite for bundling
-   Use ES6 modules
-   Create NPM package
-   Tests
  -   [ ] Unit Tests
  -   [ ] E2E Tests

Waymark JS is a JavaScript library for viewing, editing and sharing geographical data.

Originally developed as the intuitive and easy to use mapping interface for the [Waymark WordPress plugin](https://wordpress.org/plugins/waymark/), Waymark JS is a standalone library that can be used to add interactive maps to _any website_.

## Features

-   View and edit Maps
  -   Add and edit Markers, Lines, and Shapes
  -   Upload and view Photos (supports location metadata)
  -   Import GPX, KML, and GeoJSON files
-   View Elevation profiles
-   Search for locations
-   Fullscreen mode
-   Supports device location
-   Cluster Markers
-   Sleep mode
-   Customisable
  -   Basemaps
  -   Colours, icons, and more (using Types)
  -   Map height and width
  -   Localisation

## Getting Started

### Installation

### Usage

```javascript
// Create a new Map Instance
const waymark_viewer = window.Waymark_Map_Factory.viewer();

// Configure the Map
const waymark_config = {
  map_options: {
  map_div_id: "waymark-map-0123f3",
  map_height: 800,
  },
  viewer_options: {
  show_elevation: "1",
  elevation_div_id: "waymark-elevation-0123f3",
  },
};

// Initialise the Map
waymark_viewer.init(waymark_config);

// Load GeoJSON data
waymark_viewer.load_json({
  type: "FeatureCollection",
  features: [
  {
    geometry: { type: "Point", coordinates: [-85.038, 49.4595] },
    type: "Feature",
    properties: { type: "food" },
  },
  ],
});
```

## Documentation

-   Maps
  -   Common
  -   Viewer
  -   Editor
