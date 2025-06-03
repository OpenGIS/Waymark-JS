import { length } from "@turf/length";
import { Type } from "@/classes/Type.js";
import { getFeatureType, getFeatureImages } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";
import { useConfig } from "@/composables/useConfig.js";
const { getItem } = useConfig();

export class Overlay {
  constructor(layer) {
    this.layer = layer;
    this.feature = layer.feature;
    this.featureType = getFeatureType(this.feature);
    this.typeKey = makeKey(this.feature.properties.type) || "photo";
    this.title = this.feature.properties.title || "";
    this.description = this.feature.properties.description || "";
    this.images = getFeatureImages(this.feature);
    this.type = new Type(this.featureType, this.typeKey);
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
        getItem("map_options", "units") === "metric" ? "kilometers" : "miles",
    });
    out += Math.round(lengthValue * 100) / 100;
    out += getItem("map_options", "units") === "metric" ? "km" : "mi";

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
    console.log("getElevationString");

    if (!this.hasElevationData()) {
      return "";
    }

    const unitAppend =
      getItem("map_options", "units") === "metric" ? "m" : "ft";

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
        if (getItem("map_options", "units") === "imperial") {
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
      // Use Leaflet layer to get the bounds and return the centre
      const bounds = this.layer.getBounds();
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
}
