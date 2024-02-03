# Documentation

## Introduction

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

- Maps
- Common
- Viewer
- Editor
