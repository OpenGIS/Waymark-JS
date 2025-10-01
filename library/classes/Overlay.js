import { length } from "@turf/length";
import { Config } from "@/classes/Config.js";
import {
  waymarkPrimaryColour,
  defaultMarkerColour,
  defaultLineColour,
  defaultShapeColour,
} from "@/helpers/Common.js";
import { getFeatureType, getFeatureImages } from "@/helpers/Overlay.js";
import { flyToOptions, fitBoundsOptions } from "@/helpers/MapLibre.js";
import { LngLatBounds, Marker } from "maplibre-gl";

export class Overlay {
  constructor(feature, config, id = null) {
    if (!feature || feature.type !== "Feature") {
      throw new Error("Valid GeoJSON Feature required");
    }
    this.feature = feature;

    if (id == null || typeof id !== "string") {
      throw new Error("Valid ID string required");
    }
    this.id = id;

    if (!(config instanceof Config)) {
      throw new Error("Valid Config required");
    }
    this.config = config;

    this.featureType = getFeatureType(this.feature) || null;
    this.feature.properties = this.feature.properties || {};
    this.title = this.feature.properties.title || "";
    this.description = this.feature.properties.description || "";
    this.images = getFeatureImages(this.feature);

    // Get Type
    this.typeKey = this.getTypeKey() || null;
    this.type = this.config.getType(this.featureType, this.typeKey);

    if (!this.type) {
      console.error(
        `Type not found for ${featureType} Type ${typeKey}`,
        feature,
      );
      return;
    }
  }

  getTypeKey() {
    if (
      !this.feature.properties.type ||
      typeof this.feature.properties.type !== "string"
    ) {
      return null;
    }

    return this.feature.properties.type;
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
}

export class MarkerOverlay extends Overlay {
  constructor(feature, config, id) {
    super(feature, config, id);
  }

  addTo(map) {
    // Must be valid MapLibre map
    if (!map || !map.addLayer) {
      return;
    }

    this.map = map;

    // Create Source
    this.map.addSource(this.id, {
      type: "geojson",
      data: this.feature,
    });
    this.source = this.map.getSource(this.id);

    // Create Layer
    this.marker = this.toMarker();
    this.marker.addTo(this.map);
  }

  toMarker() {
    // Create a DOM element for the marker
    const el = document.createElement("div");
    el.className = this.type.iconData.className;
    el.innerHTML = this.type.iconData.html;
    el.style.width = `${this.type.iconData.iconSize[0]}px`;
    el.style.height = `${this.type.iconData.iconSize[1]}px`;

    // Create Marker
    const marker = new Marker({
      element: el,
      offset: this.type.iconData.iconAnchor,
    });

    marker.setLngLat(this.feature.geometry.coordinates);

    return marker;
  }

  hasElevationData() {
    // Check if feature coordinates has third dimension (elevation)
    return this.feature.geometry.coordinates.length === 3;
  }

  getElevationString() {
    if (!this.hasElevationData()) {
      return "";
    }

    const unitAppend =
      this.config.getMapOption("units") === "metric" ? "m" : "ft";

    // Return elevation value from coordinates, rounded to 1 decimal place
    return (
      "Elevation: " +
      Math.round(this.feature.geometry.coordinates[2] * 10) / 10 +
      unitAppend
    );
  }

  getBounds() {
    return this.source.getBounds();
  }

  getCoordsString() {
    // For marker, return the coordinates as a string
    return (
      "Lat,Lng: " +
      this.feature.geometry.coordinates[1].toFixed(6) +
      ", " +
      this.feature.geometry.coordinates[0].toFixed(6)
    );
  }

  addHighlight() {
    // Get marker
    const element = this.marker.getElement();
    const background = element.querySelector(".waymark-marker-background");
    if (background) {
      // Change background border colour
      background.style.borderColor = waymarkPrimaryColour;
    }

    // Add active class
    element.classList.add("waymark-active");
  }

  removeHighlight() {
    // Get marker
    const element = this.marker.getElement();

    // Remove active class
    element.classList.remove("waymark-active");
  }

  flyTo() {
    this.map.flyTo({
      center: [
        this.feature.geometry.coordinates[0],
        this.feature.geometry.coordinates[1],
      ],
      ...flyToOptions,
    });
  }

  inBounds(bounds) {
    return bounds.contains({
      lng: this.feature.geometry.coordinates[0],
      lat: this.feature.geometry.coordinates[1],
    });
  }
}

export class LineOverlay extends Overlay {
  constructor(feature, config, id) {
    super(feature, config, id);
  }

  addTo(map) {
    // Must be valid MapLibre map
    if (!map || !map.addLayer) {
      return;
    }

    this.map = map;

    // Create Source
    this.map.addSource(this.id, {
      type: "geojson",
      data: this.feature,
    });
    this.source = this.map.getSource(this.id);

    // Add Style to Map
    this.map.addLayer(this.toStyle());
    this.layer = this.map.getLayer(this.id);
  }

  toStyle() {
    return {
      id: this.id,
      type: "line",
      source: this.id,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": this.type.getPrimaryColour(),
        "line-width": parseFloat(this.type.data.line_weight),
      },
    };
  }
  getLengthString() {
    let out = "";

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

  getElevationString() {
    if (!this.hasElevationData()) {
      return "";
    }

    const unitAppend =
      this.config.getMapOption("units") === "metric" ? "m" : "ft";

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
  }

  getBounds() {
    // Use turf to get the bounding box of the linestring
    const coords = this.feature.geometry.coordinates;
    return coords.reduce(
      (b, coord) => b.extend(coord),
      new LngLatBounds(coords[0], coords[0]),
    );
  }

  getCoordsString() {
    // Use layer to get the bounds and return the centre
    const bounds = this.getBounds();
    const center = bounds.getCenter();
    return (
      "Centre Lat,Lng: " + center.lat.toFixed(6) + ", " + center.lng.toFixed(6)
    );
  }

  addHighlight() {
    // Chanege Layer Paint to highlight
    this.map.setPaintProperty(this.id, "line-color", waymarkPrimaryColour);
    this.map.setPaintProperty(this.id, "line-dasharray", [2, 4]);
  }

  removeHighlight() {
    // UnHighlight Layer
    this.map.setPaintProperty(
      this.id,
      "line-color",
      this.type.getPrimaryColour(),
    );
    this.map.setPaintProperty(this.id, "line-dasharray", null);
  }

  flyTo() {
    const bounds = this.getBounds();
    this.map.fitBounds(bounds, fitBoundsOptions);
  }

  inBounds(bounds) {
    // Check if any part of the line is within the map bounds
    const coords = this.feature.geometry.coordinates;
    return coords.some((coord) =>
      bounds.contains({ lng: coord[0], lat: coord[1] }),
    );
  }
}

export class ShapeOverlay extends Overlay {
  constructor(feature, config, id) {
    super(feature, config, id);
  }

  addTo(map) {
    // Must be valid MapLibre map
    if (!map || !map.addLayer) {
      return;
    }

    this.map = map;

    // Create Source
    this.map.addSource(this.id, {
      type: "geojson",
      data: this.feature,
    });
    this.source = this.map.getSource(this.id);

    console.log(this);

    // Add Style to Map
    this.map.addLayer(this.toStyle());
    this.layer = this.map.getLayer(this.id);
  }

  toStyle() {
    return {
      id: this.id,
      type: "fill",
      source: this.id,
      layout: {},
      paint: {
        "fill-color": this.type.data.shape_colour || "#000000",
        "fill-opacity": parseFloat(this.type.data.fill_opacity) || 0.5,
        "fill-outline-color": this.type.data.shape_colour || "#000000",
      },
    };
  }

  hasElevationData() {
    if (this.feature.geometry.type == "MultiPolygon") {
      //Each polygon
      for (var i in this.feature.geometry.coordinates) {
        //Each line
        for (var j in this.feature.geometry.coordinates[i]) {
          //Each point
          for (var k in this.feature.geometry.coordinates[i][j]) {
            //If has elevation data
            if (this.feature.geometry.coordinates[i][j][k].length == 3) {
              return true;
            }
          }
        }
      }
    } else {
      //Each line
      for (var j in this.feature.geometry.coordinates) {
        //Each point
        for (var k in this.feature.geometry.coordinates[j]) {
          //If has elevation data
          if (this.feature.geometry.coordinates[j][k].length == 3) {
            return true;
          }
        }
      }
    }

    return false;
  }

  getElevationString() {
    if (!this.hasElevationData()) {
      return "";
    }

    const unitAppend =
      this.config.getMapOption("units") === "metric" ? "m" : "ft";

    return "Elevation data available";
  }

  getBounds() {
    // Use turf to get the bounding box of the polygon
    const coords = this.feature.geometry.coordinates[0];
    return coords.reduce(
      (b, coord) => b.extend(coord),
      new LngLatBounds(coords[0], coords[0]),
    );
  }

  getCoordsString() {
    // Use layer to get the bounds and return the centre
    const bounds = this.getBounds();
    const center = bounds.getCenter();
    return (
      "Centre Lat,Lng: " + center.lat.toFixed(6) + ", " + center.lng.toFixed(6)
    );
  }

  addHighlight() {
    // Chanege Layer Paint to highlight
    this.map.setPaintProperty(this.id, "fill-color", waymarkPrimaryColour);
    this.map.setPaintProperty(this.id, "fill-opacity", 0.5);
    this.map.setPaintProperty(
      this.id,
      "fill-outline-color",
      waymarkPrimaryColour,
    );
  }

  removeHighlight() {
    // UnHighlight Layer
    this.map.setPaintProperty(
      this.id,
      "fill-color",
      this.type.data.shape_fill_colour || "#000000",
    );
    this.map.setPaintProperty(
      this.id,
      "fill-opacity",
      parseFloat(this.type.data.shape_fill_opacity) || 0.5,
    );
    this.map.setPaintProperty(
      this.id,
      "fill-outline-color",
      this.type.data.shape_outline_colour || "#000000",
    );
  }

  flyTo() {
    const bounds = this.getBounds();
    this.map.fitBounds(bounds, fitBoundsOptions);
  }

  inBounds(bounds) {
    // Check if any part of the shape is within the map bounds
    const coords = this.feature.geometry.coordinates[0];
    return coords.some((coord) =>
      bounds.contains({ lng: coord[0], lat: coord[1] }),
    );
  }
}
