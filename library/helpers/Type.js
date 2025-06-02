import { useInstanceStore } from "@/stores/instanceStore.js";
import { makeKey } from "@/helpers/Common.js";
import { storeToRefs } from "pinia";

export function getTypeData(featureType, typeKey) {
  const { config } = storeToRefs(useInstanceStore());

  var type = {};

  //Iterate over all types
  for (var i in config.value.map_options[featureType + "_types"]) {
    //Use first as default
    if (i == 0) {
      type = config.value.map_options[featureType + "_types"][i];
    }

    //Grab title
    var type_title =
      config.value.map_options[featureType + "_types"][i][
        featureType + "_title"
      ];

    //Has title
    if (type_title) {
      //Found (run both through make_key, just to be on safe side)
      if (makeKey(typeKey) == makeKey(type_title)) {
        // console.log('Found=' + typeKey)
        type = config.value.map_options[featureType + "_types"][i];
      } else {
        // console.log('Not found=' + typeKey)
      }
    }
  }

  return type;
}

export function getIconData(typeData = {}) {
  var icon_data = {
    className: "waymark-marker waymark-marker-" + typeData.typeKey,
  };

  //Shape
  if (
    typeof typeData.marker_shape !== "undefined" &&
    typeof typeData.marker_size !== "undefined"
  ) {
    icon_data.className += " waymark-marker-" + typeData.marker_shape;
    icon_data.className += " waymark-marker-" + typeData.marker_size;

    switch (typeData.marker_shape) {
      //Markers & Circles
      case "rectangle":
      case "circle":
      case "marker":
        //Size
        switch (typeData.marker_size) {
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
    if (typeData.marker_shape == "marker") {
      icon_data.iconAnchor = [
        Math.ceil(icon_data.iconSize[0] / 2),
        Math.ceil(icon_data.iconSize[1] / 1.5),
      ];
    }
  }
  //CSS Styles
  var background_css = "background:" + typeData.marker_colour + ";";
  var icon_css = "color:" + typeData.icon_colour + ";";

  //HTML
  icon_data.html =
    '<div class="waymark-marker-background" style="' +
    background_css +
    '"></div>';

  //Classes
  var icon_class = "waymark-marker-icon";

  //Text, HTML or Icon Name
  switch (typeData.icon_type) {
    //Text
    case "text":
      icon_class += " waymark-icon-text";

      icon_data.html +=
        '<div style="' +
        icon_css +
        '" class="' +
        icon_class +
        '">' +
        typeData.marker_icon +
        "</div>";

      break;

    //HTML
    case "html":
      icon_class += " waymark-icon-html";

      var icon_html = "<div>" + typeData.marker_icon + "</div>";

      icon_data.html +=
        '<div class="' + icon_class + '">' + icon_html + "</div>";

      break;

    //Icon Name
    case "icon":
    default:
      icon_class += " waymark-icon-icon";

      //If Ionic Icons
      if (typeData.marker_icon.indexOf("ion-") === 0) {
        icon_class += " ion ";
        icon_class += " " + typeData.marker_icon;
        //Font Awesome
      } else if (typeData.marker_icon.indexOf("fa-") === 0) {
        icon_class += " fa";
        icon_class += " " + typeData.marker_icon;
        //Default to Ionic
      } else {
        icon_class += " ion";
        icon_class += " ion-" + typeData.marker_icon;
      }

      icon_data.html +=
        '<i style="' + icon_css + '" class="' + icon_class + '"></i>';

      break;
  }

  return icon_data;
}
