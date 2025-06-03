import { length } from "@turf/length";
import { Type } from "@/classes/Type.js";
import { getFeatureType, getFeatureImages } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

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
}
