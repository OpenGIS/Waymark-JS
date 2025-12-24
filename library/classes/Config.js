import { mapOptions as defaultMapOptions } from "@/helpers/MapLibre.js";
import { featureTypes } from "@/helpers/Overlay.js";
import { MarkerType, LineType, ShapeType } from "@/classes/Types.js";
import { TileLayer } from "@/classes/TileLayer.js";
import { loadFont } from "@/helpers/FontLoader.js";

const DEFAULT_CONFIG = {
  map_options: {
    div_id: "waymark-instance",
    tile_layers: [],
    marker_types: [new MarkerType()],
    line_types: [new LineType()],
    shape_types: [new ShapeType()],
    maplibre_options: {},
    debug_mode: 0,
  },
  viewer_options: {
    show_sidebar: 1,
    show_controls: 1,
    show_zoom_control: 1,
    show_location_control: 1,
  },
  editor_options: {
    confirm_delete: 1,
    data_div_id: "waymark-data",
  },
};

export class Config {
  constructor(config = {}) {
    // Initialize with defaults
    this.map_options = {
      ...DEFAULT_CONFIG.map_options,
      maplibre_options: { ...DEFAULT_CONFIG.map_options.maplibre_options },
    };
    this.viewer_options = { ...DEFAULT_CONFIG.viewer_options };
    this.editor_options = { ...DEFAULT_CONFIG.editor_options };

    // Merge provided config
    this.mergeConfig(config);

    // Tile Layers
    this.tileLayers = [];
    this.importTileLayers();

    // Types
    this.lineTypes = {};
    this.shapeTypes = {};
    this.markerTypes = {};
    this.importTypes();
  }

  mergeConfig(config) {
    Object.keys(DEFAULT_CONFIG).forEach((section) => {
      if (config[section]) {
        this.mergeOptions(
          this[section],
          config[section],
          DEFAULT_CONFIG[section],
        );
      }
    });
  }

  mergeOptions(target, source, defaults) {
    Object.keys(source).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(defaults, key)) {
        target[key] =
          key === "maplibre_options"
            ? { ...target[key], ...source[key] }
            : source[key];
      } else {
        console.warn(`Unknown config option: ${key}`);
      }
    });
  }

  getMapLibreOptions() {
    return {
      ...defaultMapOptions,
      ...(this.map_options.maplibre_options || {}),
    };
  }

  importTileLayers() {
    // We have tile layers to accept
    if (
      this.map_options.hasOwnProperty("tile_layers") &&
      Array.isArray(this.map_options["tile_layers"])
    ) {
      // Iterate over each type and add to respective array
      this.map_options["tile_layers"].forEach((tileData) => {
        this.tileLayers.push(new TileLayer(tileData));
      });
    }
  }

  getTileLayers() {
    return this.tileLayers;
  }

  // Accept Types from config
  importTypes() {
    //Iterate over each featureType and look for _types in config.map_options
    featureTypes.forEach((featureType) => {
      const typesKey = featureType + "_types";
      // We have types to accept
      if (
        this.map_options.hasOwnProperty(typesKey) &&
        Array.isArray(this.map_options[typesKey])
      ) {
        // Iterate over each type and add to respective array
        this.map_options[typesKey].forEach((typeData) => {
          switch (featureType) {
            case "marker":
              var type =
                typeData instanceof MarkerType
                  ? new MarkerType(typeData.data)
                  : new MarkerType(typeData);
              var typeKey = type.typeKey;

              if (!this.markerTypes.hasOwnProperty(typeKey)) {
                this.markerTypes[typeKey] = type;
              }

              // Check for font usage
              if (type.data.marker_icon) {
                if (type.data.marker_icon.startsWith("fa-")) {
                  loadFont("fontawesome");
                } else if (type.data.marker_icon.startsWith("ion-")) {
                  loadFont("ionicons");
                }
              }

              break;
            case "line":
              var type =
                typeData instanceof LineType
                  ? new LineType(typeData.data)
                  : new LineType(typeData);
              var typeKey = type.typeKey;

              if (!this.lineTypes.hasOwnProperty(typeKey)) {
                this.lineTypes[typeKey] = type;
              }

              break;
            case "shape":
              var type =
                typeData instanceof ShapeType
                  ? new ShapeType(typeData.data)
                  : new ShapeType(typeData);
              var typeKey = type.typeKey;

              if (!this.shapeTypes.hasOwnProperty(typeKey)) {
                this.shapeTypes[typeKey] = type;
              }

              break;
          }
        });
      }
    });
  }

  getInitialView() {
    // Check actual maplibre_options for user provided center and zoom
    if (
      this.map_options.maplibre_options.hasOwnProperty("center") &&
      this.map_options.maplibre_options.hasOwnProperty("zoom")
    ) {
      return {
        center: this.map_options.maplibre_options.center,
        zoom: this.map_options.maplibre_options.zoom,
      };
    }

    return null;
  }

  /**
   * Get a Type by featureType and typeKey
   * Returns a default in all cases except where featureType is invalid
   */
  getType(featureType, typeKey) {
    if (!featureType) return null;

    if (featureType === "line") {
      // console.log("Getting line type for key:", typeKey, this.lineTypes);
    }

    switch (featureType) {
      case "marker":
        return this.markerTypes[typeKey] || new MarkerType();
      case "line":
        return this.lineTypes[typeKey] || new LineType();
      case "shape":
        return this.shapeTypes[typeKey] || new ShapeType();
      default:
        return null;
    }
  }

  // getType(featureType, typeKey) {
  //   if (!featureType) return null;

  //   switch (featureType) {
  //     case "marker":
  //       return (
  //         this.markerTypes["marker_types"].find(
  //           (type) => type.typeKey === typeKey,
  //         ) || new MarkerType()
  //       );
  //     case "line":
  //       return (
  //         this.lineTypes["line_types"].find(
  //           (type) => type.typeKey === typeKey,
  //         ) || new LineType()
  //       );
  //     case "shape":
  //       return (
  //         this.shapeTypes["shape_types"].find(
  //           (type) => type.typeKey === typeKey,
  //         ) || new ShapeType()
  //       );
  //     default:
  //       return null;
  //   }
  // }

  /**
   * Generic helper to get an option from a specific config object
   * @param {Object} configObject - The config object to search (e.g., this.map_options)
   * @param {Array} keys - The keys to traverse
   * @returns {any|null} The option value or null if not found
   */
  getOption(configObject, keys) {
    if (keys.length === 0) return null;

    let option = configObject;

    for (const key of keys) {
      if (option && option.hasOwnProperty(key)) {
        option = option[key];
      } else {
        return null; // Key not found
      }
    }

    // Return a deep copy to ensure independence
    return JSON.parse(JSON.stringify(option));
  }

  /**
   * Get specific map option
   * Accepts any number of Strings as arguments to traverse nested options
   *
   * @param {...string} keys - The option keys to traverse
   * @returns {any|null} The option value or null if not found
   */
  getMapOption(...keys) {
    return this.getOption(this.map_options, keys);
  }

  /**
   * Get specific viewer option
   * Accepts any number of Strings as arguments to traverse nested options
   *
   * @param {...string} keys - The option keys to traverse
   * @returns {any|null} The option value or null if not found
   */
  getViewerOption(...keys) {
    return this.getOption(this.viewer_options, keys);
  }

  /**
   * Get specific editor option
   * Accepts any number of Strings as arguments to traverse nested options
   *
   * @param {...string} keys - The option keys to traverse
   * @returns {any|null} The option value or null if not found
   */
  getEditorOption(...keys) {
    return this.getOption(this.editor_options, keys);
  }

  toJSON() {
    const seen = new WeakSet();

    const clone = (value) => {
      if (typeof value !== "object" || value === null) return value;

      if (seen.has(value)) return "[Circular]";
      seen.add(value);

      if (Array.isArray(value)) {
        return value.map(clone);
      }

      const result = {};
      for (const key of Object.keys(value)) {
        result[key] = clone(value[key]);
      }
      return result;
    };

    // Only serialize the config options to avoid traversing internal state (like Map instances in TileLayers)
    return {
      map_options: clone(this.map_options),
      viewer_options: clone(this.viewer_options),
      editor_options: clone(this.editor_options),
    };
  }
}
