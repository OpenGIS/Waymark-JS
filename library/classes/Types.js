import { getIconData } from "@/helpers/Type.js";
import { waymarkPrimaryColour, makeKey } from "@/helpers/Common.js";

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
      icon_type: "icon",
      marker_icon: "ion-pin",
      marker_colour: waymarkPrimaryColour,
      icon_colour: "#ffffff",
      marker_display: "1",
    };
    super({ ...defaults, ...typeData });

    this.typeKey = makeKey(this.data.marker_title) || null;
    this.iconData = getIconData(this);
  }

  getTitle() {
    return this.data.marker_title || "Marker";
  }

  getPrimaryColour() {
    return this.data.marker_colour || "#000000";
  }

  getIconColour() {
    return this.data.icon_colour || "#ffffff";
  }
}

export class LineType extends Type {
  constructor(typeData) {
    const defaults = {
      line_title: "Line",
      line_colour: waymarkPrimaryColour,
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
    return this.data.line_colour || "#000000";
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
    super(typeData);

    this.typeKey = makeKey(this.data.shape_title) || null;
  }

  getTitle() {
    return this.data.shape_title || "Shape";
  }

  getPrimaryColour() {
    return this.data.shape_colour || "#000000";
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
