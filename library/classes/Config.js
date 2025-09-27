/**
 * Config class
 *
 * Defines the configuration options for Waymark JS maps.
 * Manages map options including marker types, line types, and tile layers.
 * Provides methods for setting and getting map options with deep cloning to ensure independence.
 *
 * This class is responsible for:
 * - Maintaining configuration structure for Waymark maps
 * - Providing access to specific configuration sections (marker_types, line_types, tile_layers)
 * - Ensuring proper deep cloning of configuration values to maintain state independence
 * - Supporting the undo/redo stack by providing immutable operations
 */
export class Config {
  /**
   * Create a new Waymark_Config instance
   *
   * @param {Object} config - Optional initial configuration
   */
  constructor(config = {}) {
    // Initialize with default structure
    this.map_options = {
      // Default tile layers
      tile_layers: [
        {
          layer_name: "OpenStreetMap",
          layer_url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          layer_attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
        },
      ],

      // Default marker types
      marker_types: [
        {
          marker_title: "Photo",
          marker_shape: "marker",
          marker_size: "medium",
          icon_type: "icon",
          marker_icon: "ion-camera",
          marker_colour: "#70af00",
          icon_colour: "#ffffff",
          marker_display: "1",
          marker_submission: "1",
        },
        {
          marker_title: "Water",
          marker_shape: "marker",
          marker_size: "medium",
          icon_type: "icon",
          marker_icon: "ion-waterdrop",
          marker_colour: "#2aabe1",
          icon_colour: "#fff",
          marker_display: "1",
          marker_submission: "1",
        },
        {
          marker_title: "Trail Access",
          marker_shape: "marker",
          marker_size: "medium",
          icon_type: "icon",
          marker_icon: "ion-android-car",
          marker_colour: "#fbfbfb",
          icon_colour: "#707070",
          marker_display: "1",
          marker_submission: "1",
        },
        {
          marker_title: "Information",
          marker_shape: "marker",
          marker_size: "medium",
          icon_type: "icon",
          marker_icon: "ion-information-circled",
          marker_colour: "#fbfbfb",
          icon_colour: "#0069a5",
          marker_display: "1",
          marker_submission: "1",
        },
        {
          marker_title: "Alert",
          marker_shape: "marker",
          marker_size: "medium",
          icon_type: "icon",
          marker_icon: "ion-android-alert",
          marker_colour: "#da3d20",
          icon_colour: "white",
          marker_display: "1",
          marker_submission: "1",
        },
        {
          marker_title: "Food",
          marker_shape: "marker",
          marker_size: "medium",
          icon_type: "icon",
          marker_icon: "ion-pizza",
          marker_colour: "#da3d20",
          icon_colour: "#ffba00",
          marker_display: "1",
          marker_submission: "1",
        },
        {
          marker_title: "Beer",
          marker_shape: "marker",
          marker_size: "medium",
          icon_type: "icon",
          marker_icon: "ion-beer",
          marker_colour: "#fbfbfb",
          icon_colour: "#754423",
          marker_display: "1",
          marker_submission: "1",
        },
        {
          marker_title: "Start",
          marker_shape: "marker",
          marker_size: "medium",
          icon_type: "icon",
          marker_icon: "fa-flag",
          marker_colour: "#70af00",
          icon_colour: "white",
          marker_display: "1",
          marker_submission: "1",
        },
        {
          marker_title: "Finish",
          marker_shape: "marker",
          marker_size: "medium",
          icon_type: "icon",
          marker_icon: "fa-flag-checkered",
          marker_colour: "#a43233",
          icon_colour: "white",
          marker_display: "1",
          marker_submission: "1",
        },
        {
          marker_title: "Store",
          marker_shape: "marker",
          marker_size: "medium",
          icon_type: "icon",
          marker_icon: "ion-android-cart",
          marker_colour: "#416979",
          icon_colour: "#ffffff",
          marker_display: "1",
          marker_submission: "1",
        },
        {
          marker_title: "Camp",
          marker_shape: "marker",
          marker_size: "medium",
          icon_type: "icon",
          marker_icon: "ion-android-home",
          marker_colour: "#a43233",
          icon_colour: "#ffffff",
          marker_display: "1",
          marker_submission: "1",
        },
        {
          marker_title: "Wildlife",
          marker_shape: "marker",
          marker_size: "medium",
          icon_type: "icon",
          marker_icon: "ion-ios-paw",
          marker_colour: "#a43233",
          icon_colour: "#ffffff",
          marker_display: "1",
          marker_submission: "1",
        },
        {
          marker_title: "Point of Interest",
          marker_shape: "marker",
          marker_size: "medium",
          icon_type: "icon",
          marker_icon: "ion-eye",
          marker_colour: "#da3d20",
          icon_colour: "#e5e5e5",
          marker_display: "1",
          marker_submission: "1",
        },
      ],

      // Default line types
      line_types: [
        {
          line_title: "Green",
          line_colour: "#30d100",
          line_weight: "3",
          line_opacity: "0.7",
          line_display: "1",
          line_submission: "1",
        },
        {
          line_title: "Red",
          line_colour: "#dd3333",
          line_weight: "3",
          line_opacity: "0.7",
          line_display: "1",
          line_submission: "1",
        },
        {
          line_title: "Blue",
          line_colour: "#487bd9",
          line_weight: "3",
          line_opacity: "0.7",
          line_display: "1",
        },
      ],

      // Default shape types
      shape_types: [
        {
          shape_title: "Red",
          shape_colour: "#d84848",
          fill_opacity: "0.5",
          shape_display: "1",
          shape_submission: "1",
        },
        {
          shape_title: "Green",
          shape_colour: "#3cbc47",
          fill_opacity: "0.15",
          shape_display: "1",
          shape_submission: "1",
        },
        {
          shape_title: "Blue",
          shape_colour: "#487bd9",
          fill_opacity: "0.5",
          shape_display: "1",
          shape_submission: "1",
        },
      ],
    };

    // Override defaults with provided config
    this.updateConfig(config);

    // Make the class itself act like the configuration object
    // by defining a custom toString method
    this.toString = function () {
      return JSON.stringify({
        map_options: this.map_options,
      });
    };
  }

  /**
   * Update the configuration with new values
   * Creates deep clones of all values to ensure independence
   *
   * @param {Object} config - The new configuration options
   */
  updateConfig(config = {}) {
    if (!config) return;

    // If config has map_options, merge them with existing ones
    if (config.map_options) {
      for (const key in config.map_options) {
        if (config.map_options.hasOwnProperty(key)) {
          // Deep clone each value to ensure independence
          this.map_options[key] = JSON.parse(
            JSON.stringify(config.map_options[key]),
          );
        }
      }
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

  /**
   * Get all map option keys
   *
   * @returns {string[]} Array of map option keys
   */
  getMapOptionKeys() {
    return Object.keys(this.map_options);
  }

  /**
   * Set specific map option
   * Creates a deep copy of the value to ensure independence
   *
   * @param {string} key - The option key
   * @param {any} value - The option value
   */
  setMapOption(key, value) {
    if (key) {
      // Create a deep copy of the value to ensure it's independent
      this.map_options[key] = JSON.parse(JSON.stringify(value));
    }
  }

  /**
   * Create a clone of this Waymark_Config
   * Creates a completely new Waymark_Config instance with deep-cloned data
   *
   * @returns {Waymark_Config} A new Waymark_Config instance with the same data
   */
  clone() {
    const clonedConfig = new Waymark_Config();

    // Copy all map options from this config
    for (const key in this.map_options) {
      if (this.map_options.hasOwnProperty(key)) {
        // Deep clone each option value to ensure complete independence
        const value = JSON.parse(JSON.stringify(this.getMapOption(key)));
        clonedConfig.setMapOption(key, value);
      }
    }

    return clonedConfig;
  }
}
