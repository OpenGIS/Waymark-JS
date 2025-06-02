import { useInstanceStore } from "@/stores/instanceStore.js";
import { makeKey } from "@/helpers/Common.js";
import { storeToRefs } from "pinia";

export function getFeatureType(feature = {}) {
  // Ensure there is a feature & geometry
  if (!feature || !feature.geometry) {
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

export function getImageURLs(featureProps) {
  const urls = {};

  for (const key of Object.keys(featureProps)) {
    if (key.indexOf("image_") === 0) {
      urls[key] = featureProps[key];
    }
  }

  return urls;
}

export function getFeatureImages(feature) {
  const images = {
    thumbnail: null,
    medium: null,
    large: null,
  };

  if (feature.properties.image_thumbnail_url) {
    images.thumbnail = feature.properties.image_thumbnail_url;
  } else if (feature.properties.image_medium_url) {
    images.thumbnail = feature.properties.image_medium_url;
  } else if (feature.properties.image_large_url) {
    images.thumbnail = feature.properties.image_large_url;
  }

  if (feature.properties.image_medium_url) {
    images.medium = feature.properties.image_medium_url;
  } else if (feature.properties.image_large_url) {
    images.medium = feature.properties.image_large_url;
  }

  if (feature.properties.image_large_url) {
    images.large = feature.properties.image_large_url;
  }

  return images;
}
