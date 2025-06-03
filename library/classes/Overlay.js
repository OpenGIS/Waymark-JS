import { length } from "@turf/length";
import { Type } from "@/classes/Type.js";
import { getFeatureType, getFeatureImages } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";
import { useConfig } from "@/composables/useConfig.js";
const { getItem } = useConfig();

export class Overlay {
  constructor(feature) {
    this.feature = feature;
    this.featureType = getFeatureType(feature);
    this.typeKey = makeKey(feature.properties.type) || "photo";
    this.title = feature.properties.title || "";
    this.description = feature.properties.description || "";
    this.images = getFeatureImages(feature);
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

  getLength() {
    if (this.featureType !== "line") {
      return 0;
    }

    return length(this.feature);
  }

  hasElevationData() {
    switch (this.featureType) {
      case "marker":
        // Check if feature coordinates has third dimension (elevation)
        return this.feature.geometry.coordinates.length === 3;
      case "shape":
      case "line":
        // Check first coordinate for elevation
        console.log(this.feature.geometry);
    }
  }

  getElevationString() {
    console.log("getElevationString");

    if (!this.hasElevationData()) {
      return "";
    }

    const unitAppend = getItem("map_options") === "metric" ? "" : "impereal";

    switch (this.featureType) {
      case "marker":
        // Return elevation value from coordinates
        return this.feature.geometry.coordinates[2] + unitAppend;
      case "line":
      case "shape":
        // Return elevation value from first coordinate
        return this.feature.geometry.coordinates[0][2] + unitAppend;
    }
  }
}
