import {
  getTypeData,
  getFeatureType,
  getFeatureImages,
  featureHasImage,
} from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

export class Overlay {
  constructor(feature) {
    this.featureType = getFeatureType(feature);
    this.typeKey = makeKey(feature.properties.type);
    this.typeData = getTypeData(this.featureType, this.typeKey);
    this.hasImage = featureHasImage(feature);
    this.images = getFeatureImages(feature);
  }
}
