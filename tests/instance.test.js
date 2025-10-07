import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("maplibre-gl", () => {
  class MockMap {
    constructor(options = {}) {
      this.handlers = {};
      this.options = options;

      const containerOption = options.container;
      const containerElement =
        typeof containerOption === "string"
          ? document.getElementById(containerOption)
          : containerOption;

      if (containerElement) {
        this.canvas = document.createElement("div");
        this.canvas.className = "maplibregl-canvas";
        this.canvas.dataset.testid = "mock-maplibre-canvas";
        containerElement.appendChild(this.canvas);
      }
    }

    on(event, callback) {
      this.handlers[event] = callback;
      if (event === "load") {
        callback();
      }
    }

    queryRenderedFeatures() {
      return [];
    }

    getBounds() {
      return {};
    }

    fitBounds() {}
  }

  class MockLngLatBounds {
    extend() {
      return this;
    }
  }

  return {
    Map: MockMap,
    LngLatBounds: MockLngLatBounds,
  };
});

import { Instance } from "../library/main.js";

describe("Instance", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("instantiates MapLibre inside the default container when constructed without configuration", () => {
    new Instance();

    const container = document.getElementById("waymark-instance");
    const mapContainer = document.getElementById("waymark-instance-map");
    const mapCanvas = document.querySelector(
      "#waymark-instance-map .maplibregl-canvas",
    );

    expect(container).toBeTruthy();
    expect(mapContainer).toBeTruthy();
    expect(mapCanvas).toBeTruthy();
  });

  it("mounts into an existing container when map_options.div_id is provided", () => {
    const customContainer = document.createElement("div");
    customContainer.id = "custom-container";
    document.body.appendChild(customContainer);

    new Instance({
      map_options: {
        div_id: "custom-container",
      },
    });

    const defaultContainer = document.getElementById("waymark-instance");
    const container = document.getElementById("custom-container");
    const mapContainer = document.getElementById("custom-container-map");
    const mapCanvas = document.querySelector(
      "#custom-container-map .maplibregl-canvas",
    );

    expect(defaultContainer).toBeFalsy();
    expect(container).toBe(customContainer);
    expect(mapContainer).toBeTruthy();
    expect(mapCanvas).toBeTruthy();
  });
});
