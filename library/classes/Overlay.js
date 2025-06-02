import {
  getTypeData,
  getFeatureType,
  getFeatureImages,
} from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

export class Overlay {
  constructor(feature) {
    this.feature = feature;
    this.featureType = getFeatureType(feature);
    this.typeKey = makeKey(feature.properties.type) || "photo";
    this.title = feature.properties.title || "";
    this.description = feature.properties.description || "";
    this.images = getFeatureImages(feature);

    this.typeData = getTypeData(this.featureType, this.typeKey);
  }

  hasImage() {
    return (
      this.feature.properties.image_thumbnail_url ||
      this.feature.properties.image_medium_url ||
      this.feature.properties.image_large_url
    );
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }
}
