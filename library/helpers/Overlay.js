import { useMapStore } from "@/stores/mapStore.js";
import { makeKey } from "@/helpers/Common.js";

export function getTypeData(featureType, typeKey) {
  const { mapConfig } = useMapStore();

  var type = {};

  //Iterate over all types
  for (var i in mapConfig[featureType + "_types"]) {
    //Use first as default
    if (i == 0) {
      type = mapConfig[featureType + "_types"][i];
    }

    //Grab title
    var type_title =
      mapConfig[featureType + "_types"][i][featureType + "_title"];

    //Has title
    if (type_title) {
      //Found (run both through make_key, just to be on safe side)
      if (makeKey(typeKey) == makeKey(type_title)) {
        // console.log('Found=' + typeKey)
        type = mapConfig[featureType + "_types"][i];
      } else {
        // console.log('Not found=' + typeKey)
      }
    }
  }

  //Add Icon Data
  if (featureType == "marker") {
    type["iconData"] = getIconData(type);
  }

  //Set key
  type["typeKey"] = makeKey(type[featureType + "_title"]);

  return type;
}

export function getIconData(type) {
  var icon_data = {
    className: "waymark-marker waymark-marker-" + type.typeKey,
  };

  //Shape
  if (
    typeof type.marker_shape !== "undefined" &&
    typeof type.marker_size !== "undefined"
  ) {
    icon_data.className += " waymark-marker-" + type.marker_shape;
    icon_data.className += " waymark-marker-" + type.marker_size;

    switch (type.marker_shape) {
      //Markers & Circles
      case "rectangle":
      case "circle":
      case "marker":
        //Size
        switch (type.marker_size) {
          case "small":
            icon_data.iconSize = [16, 16];

            break;
          case "medium":
            icon_data.iconSize = [25, 25];

            break;
          default:
          case "large":
            icon_data.iconSize = [32, 32];

            break;
        }

        break;
    }

    //Marker only
    if (type.marker_shape == "marker") {
      icon_data.iconAnchor = [
        Math.ceil(1 - icon_data.iconSize[0] / 2),
        Math.ceil(1 - icon_data.iconSize[1] / 1.5),
      ];
    }
  }
  //CSS Styles
  var background_css = "background:" + type.marker_colour + ";";
  var icon_css = "color:" + type.icon_colour + ";";

  //HTML
  icon_data.html =
    '<div class="waymark-marker-background" style="' +
    background_css +
    '"></div>';

  //Classes
  var icon_class = "waymark-marker-icon";

  //Text, HTML or Icon Name
  switch (type.icon_type) {
    //Text
    case "text":
      icon_class += " waymark-icon-text";

      icon_data.html +=
        '<div style="' +
        icon_css +
        '" class="' +
        icon_class +
        '">' +
        type.marker_icon +
        "</div>";

      break;

    //HTML
    case "html":
      icon_class += " waymark-icon-html";

      //Decode HTML entities using jQuery
      // var icon_html = jQuery('<div/>').html(type.marker_icon).text()

      var icon_html = "<div>" + type.marker_icon + "</div>";

      icon_data.html +=
        '<div class="' + icon_class + '">' + icon_html + "</div>";

      break;

    //Icon Name
    case "icon":
    default:
      icon_class += " waymark-icon-icon";

      //If Ionic Icons
      if (type.marker_icon.indexOf("ion-") === 0) {
        icon_class += " ion ";
        icon_class += " " + type.marker_icon;
        //Font Awesome
      } else if (type.marker_icon.indexOf("fa-") === 0) {
        icon_class += " fa";
        icon_class += " " + type.marker_icon;
        //Default to Ionic
      } else {
        icon_class += " ion";
        icon_class += " ion-" + type.marker_icon;
      }

      icon_data.html +=
        '<i style="' + icon_css + '" class="' + icon_class + '"></i>';

      break;
  }

  return icon_data;
}

export function getFeatureType(feature) {
  if (typeof feature.geometry.type === "undefined") {
    return null;
  }

  switch (feature.geometry.type) {
    case "Point":
      return "marker";
    case "LineString":
    case "MultiLineString":
      return "line";
    default:
      return "shape";
  }
}

export function iconHtml(iconData) {
  return '<div class="' + iconData.className + '">' + iconData.html + "</div>";
}

export function overlaysByType(overlays) {
  const byType = {};

  for (let i in overlays) {
    let overlay = overlays[i];

    //Not yet present?
    if (typeof byType[overlay.typeKey] !== "object") {
      byType[overlay.typeKey] = {
        title: overlay.typeData[getFeatureType(overlay.feature) + "_title"],
        typeData: getTypeData(getFeatureType(overlay.feature), overlay.typeKey),
        overlays: [],
        featureType: getFeatureType(overlay.feature),
      };
    }

    byType[overlay.typeKey]["overlays"].push(overlay);
  }

  return byType;
}

export function getImageURLs(featureProps) {
  const urls = {};

  for (const key of Object.keys(featureProps)) {
    if (key.indexOf("image_") === 0) {
      urls[key] = featureProps[key];
    }
  }

  return urls;
}
