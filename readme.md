# Waymark JS

## TODO

### v1.0.0

- [ ] Elevation inset styles
- [ ] Add more examples
  - Callbacks
  - Basemaps
- [ ] Create homepage on waymark.dev/js
- [ ] Note on Uploads

- [ ] Documentation
  - [x] Installation
  - [x] Getting Started
  - [x] Modes
  - [ ] Map Instances
    - [ ] Common
    - [ ] Viewer
    - [ ] Editor
      - [ ] Input/Ouput
- [ ] Types
- [ ] Basemaps
- [ ] Extending Waymark JS
  - [ ] Callbacks
  - [ ] Uploads
  - [ ] Localisation

### v1.1.0

- [ ] jQuery check(/auto include?)
- [ ] Add File/Image Upload integration & examples
- [ ] Add elevation div to container if not present

# Waymark JS

Create, share and edit _meaningful_ Maps.

Waymark JS is a JavaScript library for sharing geographical information. It is designed to be easy to use and intuitive, and is suitable for a wide range of applications.

Originally developed as the intuitive and easy to use mapping interface for the [Waymark WordPress plugin](https://wordpress.org/plugins/waymark/), Waymark JS is a standalone library that can be used to add interactive Maps to _any website_.

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
