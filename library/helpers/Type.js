import { Type } from "@/classes/Type.js";

export function getIconData(type = {}) {
  // Checks
  if (!(type instanceof Type)) {
    return null;
  }

  var icon_data = {
    className: "waymark-marker waymark-marker-" + type.typeKey,
  };

  //Shape
  if (
    typeof type.data.marker_shape !== "undefined" &&
    typeof type.data.marker_size !== "undefined"
  ) {
    icon_data.className += " waymark-marker-" + type.data.marker_shape;
    icon_data.className += " waymark-marker-" + type.data.marker_size;

    switch (type.data.marker_shape) {
      //Markers & Circles
      case "rectangle":
      case "circle":
      case "marker":
        //Size
        switch (type.data.marker_size) {
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
    if (type.data.marker_shape == "marker") {
      icon_data.iconAnchor = [0, -Math.ceil(icon_data.iconSize[1] / 1.5)];
    }
  }
  //CSS Styles
  var background_css = "background:" + type.data.marker_colour + ";";
  var icon_css = "color:" + type.data.icon_colour + ";";

  //HTML
  icon_data.html =
    '<div class="waymark-marker-background" style="' +
    background_css +
    '"></div>';

  //Classes
  var icon_class = "waymark-marker-icon";

  //Text, HTML or Icon Name
  switch (type.data.icon_type) {
    //Text
    case "text":
      icon_class += " waymark-icon-text";

      icon_data.html +=
        '<div style="' +
        icon_css +
        '" class="' +
        icon_class +
        '">' +
        type.data.marker_icon +
        "</div>";

      break;

    //HTML
    case "html":
      icon_class += " waymark-icon-html";

      var icon_html = "<div>" + type.data.marker_icon + "</div>";

      icon_data.html +=
        '<div class="' + icon_class + '">' + icon_html + "</div>";

      break;

    //Icon Name
    case "icon":
    default:
      icon_class += " waymark-icon-icon";

      //If Ionic Icons
      if (type.data.marker_icon.indexOf("ion-") === 0) {
        icon_class += " ion ";
        icon_class += " " + type.data.marker_icon;
        //Font Awesome
      } else if (type.data.marker_icon.indexOf("fa-") === 0) {
        icon_class += " fa";
        icon_class += " " + type.data.marker_icon;
        //Default to Ionic
      } else {
        icon_class += " ion";
        icon_class += " ion-" + type.data.marker_icon;
      }

      icon_data.html +=
        '<i style="' + icon_css + '" class="' + icon_class + '"></i>';

      break;
  }

  return icon_data;
}
