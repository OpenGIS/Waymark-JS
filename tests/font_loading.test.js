import { describe, it, expect, beforeEach } from "vitest";
import { Config } from "../library/classes/Config.js";
import { MarkerType } from "../library/classes/Types.js";

describe("Font Loading", () => {
  beforeEach(() => {
    // Clear head to ensure clean state for each test
    document.head.innerHTML = "";
  });

  it("should not load any fonts by default if no markers use them", () => {
    new Config({
      map_options: {
        marker_types: [
          {
            marker_title: "Custom Icon",
            marker_icon: "custom-icon",
          },
        ],
      },
    });

    const links = document.head.querySelectorAll("link");
    expect(links.length).toBe(0);
  });

  it("should load Font Awesome when a marker uses fa- icon", () => {
    new Config({
      map_options: {
        marker_types: [
          {
            marker_title: "Test FA",
            marker_icon: "fa-camera",
          },
        ],
      },
    });

    const link = document.head.querySelector(
      'link[href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"]'
    );
    expect(link).toBeTruthy();
  });

  it("should load Ionicons when a marker uses ion- icon", () => {
    new Config({
      map_options: {
        marker_types: [
          {
            marker_title: "Test Ion",
            marker_icon: "ion-home",
          },
        ],
      },
    });

    const link = document.head.querySelector(
      'link[href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css"]'
    );
    expect(link).toBeTruthy();
  });

  it("should load both fonts if both are used", () => {
    new Config({
      map_options: {
        marker_types: [
          {
            marker_title: "Test FA",
            marker_icon: "fa-camera",
          },
          {
            marker_title: "Test Ion",
            marker_icon: "ion-home",
          },
        ],
      },
    });

    const faLink = document.head.querySelector(
      'link[href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"]'
    );
    const ionLink = document.head.querySelector(
      'link[href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css"]'
    );

    expect(faLink).toBeTruthy();
    expect(ionLink).toBeTruthy();
  });

  it("should not duplicate link tags if already present", () => {
    // Manually add FA link
    const link = document.createElement("link");
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    document.head.appendChild(link);

    new Config({
      map_options: {
        marker_types: [
          {
            marker_title: "Test FA",
            marker_icon: "fa-camera",
          },
        ],
      },
    });

    const links = document.head.querySelectorAll(
      'link[href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"]'
    );
    expect(links.length).toBe(1);
  });

  it("should load Font Awesome when instantiating a default MarkerType", () => {
    // Default MarkerType uses fa-map-marker
    new MarkerType();

    const link = document.head.querySelector(
      'link[href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"]'
    );
    expect(link).toBeTruthy();
  });
});
