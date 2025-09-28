import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

import { getIconData } from "@/helpers/Type.js";
import { makeKey } from "@/helpers/Common.js";

export class Type {
  constructor(featureType, typeKey) {
    const { config } = storeToRefs(useInstanceStore());
    this.config = config.value;

    this.featureType = featureType;
    this.typeKey = makeKey(typeKey);
    this.data = this.getTypeData(featureType, typeKey);

    if (this.featureType === "marker") {
      this.iconData = getIconData(this);
    }
  }

  getTypeData(featureType, typeKey) {
    var type = {};

    //Iterate over all types
    for (var i in this.config.map_options[featureType + "_types"]) {
      //Use first as default
      if (i == 0) {
        type = this.config.map_options[featureType + "_types"][i];
      }

      //Grab title
      var type_title =
        this.config.map_options[featureType + "_types"][i][
          featureType + "_title"
        ];

      //Has title
      if (type_title) {
        //Found (run both through make_key, just to be on safe side)
        if (makeKey(typeKey) == makeKey(type_title)) {
          // console.log('Found=' + typeKey)
          type = this.config.map_options[featureType + "_types"][i];
        } else {
          // console.log('Not found=' + typeKey)
        }
      }
    }

    return type;
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
