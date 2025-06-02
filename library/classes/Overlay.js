import {
  getTypeData,
  getFeatureType,
  getFeatureImages,
  featureHasImage,
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

    this.hasImage = featureHasImage(feature);
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }
}
