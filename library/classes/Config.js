import { mapOptions } from "@/helpers/MapLibre.js";
import { featureTypes } from "@/helpers/Overlay.js";
import { MarkerType, LineType, ShapeType } from "@/classes/Types.js";
import { TileLayer } from "@/classes/TileLayer.js";

export class Config {
  constructor(config = {}) {
    // To do!
    this.mapLibreMapOptions = mapOptions;

    // Map Options
    this.map_options = config.map_options || {
      div_id: "map",
    };

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

    // If config has mapLibreMapOptions, merge them with existing ones
    // if (config.mapLibreMapOptions) {
    //   console.log("Merging mapLibreMapOptions", config.mapLibreMapOptions);
    //   for (const key in config.mapLibreMapOptions) {
    //     if (config.mapLibreMapOptions.hasOwnProperty(key)) {
    //       // Deep clone each value to ensure independence
    //       this.mapLibreMapOptions[key] = JSON.parse(
    //         JSON.stringify(config.mapLibreMapOptions[key]),
    //       );
    //     }
    //   }
    // }
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
              // If not array, create it
              if (!this.markerTypes.hasOwnProperty(typesKey)) {
                this.markerTypes[typesKey] = [];
              }

              this.markerTypes[typesKey].push(new MarkerType(typeData));

              break;
            case "line":
              // If not array, create it
              if (!this.lineTypes.hasOwnProperty(typesKey)) {
                this.lineTypes[typesKey] = [];
              }

              this.lineTypes[typesKey].push(new LineType(typeData));

              break;
            case "shape":
              // If not array, create it
              if (!this.shapeTypes.hasOwnProperty(typesKey)) {
                this.shapeTypes[typesKey] = [];
              }

              this.shapeTypes[typesKey].push(new ShapeType(typeData));

              break;
          }
        });
      }
    });
  }

  /**
   * Get a Type by featureType and typeKey
   * Returns a default in all cases except where featureType is invalid
   */
  getType(featureType, typeKey) {
    if (!featureType) return null;

    switch (featureType) {
      case "marker":
        return (
          this.markerTypes["marker_types"].find(
            (type) => type.typeKey === typeKey,
          ) || new MarkerType()
        );
      case "line":
        return (
          this.lineTypes["line_types"].find(
            (type) => type.typeKey === typeKey,
          ) || new LineType()
        );
      case "shape":
        return (
          this.shapeTypes["shape_types"].find(
            (type) => type.typeKey === typeKey,
          ) || new ShapeType()
        );
      default:
        return null;
    }
  }

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
