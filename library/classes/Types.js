import { getIconData } from "@/helpers/Type.js";
import {
  defaultMarkerColour,
  defaultLineColour,
  defaultShapeColour,
  makeKey,
} from "@/helpers/Common.js";
import { loadFont } from "@/helpers/FontLoader.js";

export class Type {
  constructor(typeData) {
    this.data = typeData || {};
  }
}

export class MarkerType extends Type {
  // Set defaults
  constructor(typeData) {
    const defaults = {
      marker_title: "Marker",
      marker_shape: "marker",
      marker_size: "large",
      icon_type: "svg",
      marker_icon:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="fill: currentColor;"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>',
      marker_colour: defaultMarkerColour,
      icon_colour: "#ffffff",
      marker_display: "1",
    };
    super({ ...defaults, ...typeData });

    this.typeKey = makeKey(this.data.marker_title) || null;
    this.iconData = getIconData(this);

    // Check for default font usage if no custom types were loaded that triggered it
    if (this.data.marker_icon) {
      if (this.data.marker_icon.startsWith("fa-")) {
        loadFont("fontawesome");
      } else if (this.data.marker_icon.startsWith("ion-")) {
        loadFont("ionicons");
      }
    }
  }

  getTitle() {
    return this.data.marker_title || "Marker";
  }

  getPrimaryColour() {
    return this.data.marker_colour || defaultMarkerColour;
  }

  getIconColour() {
    return this.data.icon_colour || "#ffffff";
  }
}

export class LineType extends Type {
  constructor(typeData) {
    const defaults = {
      line_title: "Line",
      line_colour: defaultLineColour,
      line_weight: "3",
      line_opacity: "1",
      line_display: "1",
    };
    super({ ...defaults, ...typeData });

    this.typeKey = makeKey(this.data.line_title) || null;
  }

  getTitle() {
    return this.data.line_title || "Line";
  }

  getPrimaryColour() {
    return this.data.line_colour || defaultLineColour;
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

export class ShapeType extends Type {
  constructor(typeData) {
    const defaults = {
      shape_title: "Shape",
      shape_colour: defaultShapeColour,
      fill_opacity: "0.5",
      shape_display: "1",
    };
    super({ ...defaults, ...typeData });

    this.typeKey = makeKey(this.data.shape_title) || null;
  }

  getTitle() {
    return this.data.shape_title || "Shape";
  }

  getPrimaryColour() {
    return this.data.shape_colour || defaultShapeColour;
  }

  getFillOpacity() {
    return parseFloat(this.data.fill_opacity) || 0.5;
  }

  getShapeStyle() {
    return {
      color: this.getPrimaryColour(),
      fillColor: this.getPrimaryColour(),
      fillOpacity: this.getFillOpacity(),
    };
  }
}
