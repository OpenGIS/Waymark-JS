import { getIconData } from "@/helpers/Type.js";
import { makeKey } from "@/helpers/Common.js";
import { Config } from "@/classes/Config.js";

export class Type {
  constructor(featureType, typeKey, config) {
    if (!(config instanceof Config)) {
      throw new Error("Config instance required");
    }

    this.config = config;

    this.featureType = featureType;
    this.typeKey = makeKey(typeKey);
    this.data = this.getTypeData(featureType, typeKey);

    if (this.featureType === "marker") {
      this.iconData = getIconData(this);
    }
  }

  getTypeData(featureType, typeKey) {
    const types = this.config.getMapOption(featureType + "_types") || [];

    if (!types.length) {
      throw new Error(`No types found for feature type: ${featureType}`);
    }

    // Default to first type
    let selectedType = types[0];

    // Find matching type by comparing keys
    for (const typeOption of types) {
      const typeTitle = typeOption?.[featureType + "_title"];
      if (typeTitle && makeKey(typeKey) === makeKey(typeTitle)) {
        selectedType = typeOption;
        break;
      }
    }

    return selectedType || {};
  }

  getTitle() {
    switch (this.featureType) {
      case "marker":
        return this.data.marker_title || "Marker";
      case "line":
        return this.data.line_title || "Line";
      case "shape":
        return this.data.shape_title || "Shape";
    }
  }

  getPrimaryColour() {
    switch (this.featureType) {
      case "marker":
        return this.data.marker_colour || "#000000";
      case "line":
        return this.data.line_colour || "#000000";
      case "shape":
        return this.data.shape_colour || "#000000";
    }
  }

  getIconColour() {
    if (this.featureType === "marker") {
      return this.data.icon_colour || this.getPrimaryColour();
    }
    return this.getPrimaryColour();
  }

  getLineWeight() {
    return parseInt(this.data.line_weight) || 1;
  }

  getLineOpacity() {
    return parseFloat(this.data.line_opacity) || 1;
  }

  getLineStyle() {
    return {
      color: this.getPrimaryColour(),
      weight: this.getLineWeight(),
      opacity: this.getLineOpacity(),
    };
  }
}
