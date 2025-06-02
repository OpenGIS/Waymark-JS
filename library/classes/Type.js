import { getTypeData, getIconData } from "@/helpers/Type.js";
import { makeKey } from "@/helpers/Common.js";

export class Type {
  // Represents a feature type (marker, line, shape) with its associated data
  // Used to retrieve and manage type-specific data from the configuration
  //Define this.iconData
  iconData = {};

  constructor(featureType, typeKey) {
    this.featureType = featureType;
    this.typeKey = makeKey(typeKey);
    this.data = getTypeData(featureType, typeKey);

    if (this.featureType === "marker") {
      this.iconData = getIconData(this.data);
    }
  }
}
