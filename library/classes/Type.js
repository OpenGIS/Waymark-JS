import { getTypeData, getIconData } from "@/helpers/Type.js";
import { makeKey } from "@/helpers/Common.js";

export class Type {
  iconData = {};

  constructor(featureType, typeKey) {
    this.featureType = featureType;
    this.typeKey = makeKey(typeKey);
    this.data = getTypeData(featureType, typeKey);

    if (this.featureType === "marker") {
      this.iconData = getIconData(this.data);
    }
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
