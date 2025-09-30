import { length } from "@turf/length";
import { Config } from "@/classes/Config.js";
import { Type, MarkerType, LineType, ShapeType } from "@/classes/Types.js";
import { getFeatureType, getFeatureImages } from "@/helpers/Overlay.js";
import {
  createMarker,
  createLineStyle,
  createLineSource,
  flyToOptions,
  fitBoundsOptions,
} from "@/helpers/MapLibre.js";
import { LngLatBounds } from "maplibre-gl";
import { makeKey } from "@/helpers/Common.js";

export class Overlay {
  constructor(feature, type, config, id = null) {
    if (!feature || feature.type !== "Feature") {
      throw new Error("Valid GeoJSON Feature required");
    }
    this.feature = feature;

    if (!(type instanceof Type)) {
      throw new Error("Valid Type required");
    }
    this.type = type;

    if (id == null || typeof id !== "string") {
      throw new Error("Valid ID string required");
    }
    this.id = id;

    if (!(config instanceof Config)) {
      throw new Error("Valid Config required");
    }
    this.config = config;

    this.featureType = getFeatureType(this.feature) || null;
    this.typeKey = makeKey(this.feature.properties.type) || null;

    this.title = this.feature.properties.title || "";
    this.description = this.feature.properties.description || "";
    this.images = getFeatureImages(this.feature);
  }

  addTo(map) {
    // Must be valid MapLibre map
    if (!map || !map.addLayer) {
      return;
    }

    this.map = map;

    // Create MapLibre Layer
    switch (this.featureType) {
      case "marker":
        // Create the Marker
        this.layer = createMarker(this);

        // Add Marker to Map
        this.layer.addTo(this.map);

        break;
      case "line":
        // Create Source
        this.source = createLineSource(this);

        // Add Source to Map
        this.map.addSource(this.id, this.source);

        // Create Style
        this.layer = createLineStyle(this, this.id);

        // Add Style to Map
        this.map.addLayer(this.layer);

        break;
    }
  }

  hasImage() {
    return (
      this.feature.properties.image_thumbnail_url ||
      this.feature.properties.image_medium_url ||
      this.feature.properties.image_large_url
    );
  }

  getImage(size = "thumbnail") {
    return this.images[size];
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  containsText(text = "") {
    let matches = 0;

    // Text included in type title
    matches += this.type
      .getTitle()
      .toString()
      .toLowerCase()
      .includes(text.toLowerCase());

    // Check all GeoJSON properties VALUES (not keys) for existence of filter text
    matches += Object.values(this.feature.properties).some((p) => {
      return p.toString().toLowerCase().includes(text.toLowerCase());
    });

    return matches > 0;
  }

  getLengthString() {
    let out = "";

    if (this.featureType !== "line") {
      return out;
    }

    out += "Length: ";

    // Round to 2 DP
    const lengthValue = length(this.feature, {
      units:
        this.config.getMapOption("units") === "metric" ? "kilometers" : "miles",
    });
    out += Math.round(lengthValue * 100) / 100;
    out += this.config.getMapOption("units") === "metric" ? "km" : "mi";

    return out;
  }

  hasElevationData() {
    switch (this.featureType) {
      case "marker":
        // Check if feature coordinates has third dimension (elevation)
        return this.feature.geometry.coordinates.length === 3;
      case "shape":
      case "line":
        if (this.feature.geometry.type == "MultiLineString") {
          //Each line
          for (var i in this.feature.geometry.coordinates) {
            //Each point
            for (var j in this.feature.geometry.coordinates[i]) {
              //If has elevation data
              if (this.feature.geometry.coordinates[i][j].length == 3) {
                return true;
              }
            }
          }
        } else {
          //Each point
          for (var j in this.feature.geometry.coordinates) {
            //If has elevation data
            if (this.feature.geometry.coordinates[j].length == 3) {
              return true;
            }
          }
        }

        return false;
    }
  }

  getElevationString() {
    if (!this.hasElevationData()) {
      return "";
    }

    const unitAppend =
      this.config.getMapOption("units") === "metric" ? "m" : "ft";

    switch (this.featureType) {
      case "marker":
        // Return elevation value from coordinates, rounded to 1 decimal place
        return (
          "Elevation: " +
          Math.round(this.feature.geometry.coordinates[2] * 10) / 10 +
          unitAppend
        );

      case "line":
        // For the linestring, calculate elevation gain, loss, max and min
        const coords = this.feature.geometry.coordinates;
        let elevationGain = 0;
        let elevationLoss = 0;
        let maxElevation = coords[0][2];
        let minElevation = coords[0][2];
        for (let i = 1; i < coords.length; i++) {
          const elevationChange = coords[i][2] - coords[i - 1][2];
          if (elevationChange > 0) {
            elevationGain += elevationChange;
          } else {
            elevationLoss -= elevationChange; // elevationChange is negative here
          }
          maxElevation = Math.max(maxElevation, coords[i][2]);
          minElevation = Math.min(minElevation, coords[i][2]);
        }

        // Convert to the correct units
        if (this.config.getMapOption("units") === "imperial") {
          elevationGain *= 3.28084; // Convert meters to feet
          elevationLoss *= 3.28084; // Convert meters to feet
          maxElevation *= 3.28084; // Convert meters to feet
          minElevation *= 3.28084; // Convert meters to feet
        }

        return (
          "Elevation Gain: " +
          Math.round(elevationGain * 10) / 10 +
          unitAppend +
          ", Loss: " +
          Math.round(elevationLoss * 10) / 10 +
          unitAppend +
          ", Max: " +
          Math.round(maxElevation * 10) / 10 +
          unitAppend +
          ", Min: " +
          Math.round(minElevation * 10) / 10 +
          unitAppend
        );
      //return this.feature.geometry.coordinates[0][2] + unitAppend;
    }
  }

  getBounds() {
    let bounds = null;

    switch (this.featureType) {
      case "marker":
        bounds = new LngLatBounds(
          this.feature.geometry.coordinates,
          this.feature.geometry.coordinates,
        );
        break;
      case "line":
        // Use turf to get the bounding box of the linestring
        const coords = this.feature.geometry.coordinates;
        bounds = coords.reduce(
          (b, coord) => b.extend(coord),
          new LngLatBounds(coords[0], coords[0]),
        );

        break;
    }

    return bounds;
  }

  getCoordsString() {
    if (this.featureType === "marker") {
      // For marker, return the coordinates as a string
      return (
        "Lat,Lng: " +
        this.feature.geometry.coordinates[1].toFixed(6) +
        ", " +
        this.feature.geometry.coordinates[0].toFixed(6)
      );
    } else if (this.featureType === "line" || this.featureType === "shape") {
      // Use layer to get the bounds and return the centre
      const bounds = this.getBounds();
      const center = bounds.getCenter();
      return (
        "Centre Lat,Lng: " +
        center.lat.toFixed(6) +
        ", " +
        center.lng.toFixed(6)
      );
    }
    return "";
  }

  addHighlight() {
    switch (this.featureType) {
      case "marker":
        // Get marker
        const element = this.layer.getElement();

        // Add active class
        element.classList.add("waymark-active");
        break;
      case "line":
        // Chanege Layer Paint to highlight
        this.map.setPaintProperty(this.id, "line-color", "#ff0000");
        this.map.setPaintProperty(this.id, "line-dasharray", [5, 5]);

        break;
    }
  }

  removeHighlight() {
    switch (this.featureType) {
      case "marker":
        // Get marker
        const element = this.layer.getElement();

        // Remove active class
        element.classList.remove("waymark-active");

        break;
      case "line":
        // UnHighlight Layer
        this.map.setPaintProperty(
          this.id,
          "line-color",
          this.type.getPrimaryColour(),
        );
        this.map.setPaintProperty(this.id, "line-dasharray", null);

        break;
    }
  }

  flyTo() {
    switch (this.featureType) {
      case "marker":
        this.map.flyTo({
          center: [
            this.feature.geometry.coordinates[0],
            this.feature.geometry.coordinates[1],
          ],
          ...flyToOptions,
        });
        break;
      case "line":
        const bounds = this.getBounds();
        this.map.fitBounds(bounds, fitBoundsOptions);
        break;
    }
  }

  zoomIn() {
    if (!this.map) {
      return;
    }

    // Zoom to 18
    const targetZoom = 18;
    const currentZoom = this.map.getZoom();

    if (currentZoom < targetZoom) {
      this.map.flyTo({
        center: [
          this.feature.geometry.coordinates[0],
          this.feature.geometry.coordinates[1],
        ],
        zoom: targetZoom,
        duration: 1000,
      });
    }
  }

  inBounds(bounds) {
    switch (this.featureType) {
      case "marker":
        return bounds.contains({
          lng: this.feature.geometry.coordinates[0],
          lat: this.feature.geometry.coordinates[1],
        });
      case "line":
        // Check if any part of the line is within the map bounds
        const coords = this.feature.geometry.coordinates;
        return coords.some((coord) =>
          bounds.contains({ lng: coord[0], lat: coord[1] }),
        );
      default:
        return false;
    }
  }

  inMapBounds() {
    if (!this.map) {
      return false;
    }

    return this.inBounds(this.map.getBounds());
  }
}
