export function loadFont(fontName) {
  let cssUrl = "";

  switch (fontName) {
    case "fontawesome":
      // Font Awesome 4.7.0
      cssUrl =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
      break;
    case "ionicons":
      // Ionicons 2.0.1
      cssUrl =
        "https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css";
      break;
    default:
      return;
  }

  // Check if already loaded
  if (document.querySelector(`link[href="${cssUrl}"]`)) {
    return;
  }

  // Create link element
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl;
  link.crossOrigin = "anonymous";

  document.head.appendChild(link);
}
