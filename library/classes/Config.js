import { mapOptions } from "@/helpers/MapLibre.js";
import { featureTypes } from "@/helpers/Overlay.js";
import { MarkerType, LineType, ShapeType } from "@/classes/Types.js";
import { TileLayer } from "@/classes/TileLayer.js";
import { loadFont } from "@/helpers/FontLoader.js";

export class Config {
  constructor(config = {}) {
    // Map Options
    this.map_options = {
      div_id: "waymark-instance",
      ...(config.map_options || {}),
    };

    // Maplibre Options
    this.map_options.maplibre_options = this.map_options.maplibre_options || {};

    // Tile Layers
    this.tileLayers = [];
    this.importTileLayers();

    // Types
    this.lineTypes = {};
    this.shapeTypes = {};
    this.markerTypes = {};
    this.importTypes();

    console.log("Config initialized with types:", {
      markerTypes: this.markerTypes,
      lineTypes: this.lineTypes,
      shapeTypes: this.shapeTypes,
    });
  }

  getMapLibreOptions() {
    return {
      ...mapOptions,
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
              var type = new MarkerType(typeData);
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
              var type = new LineType(typeData);
              var typeKey = type.typeKey;

              console.log("Importing line type:", typeKey, type);

              if (!this.lineTypes.hasOwnProperty(typeKey)) {
                this.lineTypes[typeKey] = type;
              }

              break;
            case "shape":
              var type = new ShapeType(typeData);
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
      console.log("Getting line type for key:", typeKey, this.lineTypes);
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
   * Get specific map option
   * Accepts any number of Strings as arguments to traverse nested options
   *
   * @param {...string} keys - The option keys to traverse
   * @returns {any|null} The option value or null if not found
   */
  getMapOption(...keys) {
    if (keys.length === 0) return null;

    let option = this.map_options;

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
}
