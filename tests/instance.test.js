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

        if (options.attributionControl !== false) {
          this.attributionControl = document.createElement("div");
          this.attributionControl.className =
            "maplibregl-ctrl-bottom-right maplibregl-ctrl attribution";
          containerElement.appendChild(this.attributionControl);
        }
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
    const attributionControl = document.querySelector(
      "#waymark-instance-map .maplibregl-ctrl-bottom-right",
    );

    expect(container).toBeTruthy();
    expect(mapContainer).toBeTruthy();
    expect(mapCanvas).toBeTruthy();
    expect(attributionControl).toBeFalsy();
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
    const attributionControl = document.querySelector(
      "#custom-container-map .maplibregl-ctrl-bottom-right",
    );

    expect(defaultContainer).toBeFalsy();
    expect(container).toBe(customContainer);
    expect(mapContainer).toBeTruthy();
    expect(mapCanvas).toBeTruthy();
    expect(attributionControl).toBeFalsy();
  });

  it("applies MapLibre options to enable attribution control", () => {
    const instance = new Instance({
      map_options: {
        maplibre_options: {
          attributionControl: true,
        },
      },
    });

    const mapContainer = document.getElementById("waymark-instance-map");
    const attributionControl = document.querySelector(
      "#waymark-instance-map .maplibregl-ctrl-bottom-right",
    );

    expect(mapContainer).toBeTruthy();
    expect(attributionControl).toBeTruthy();
    expect(instance.store.map.value.options.attributionControl).toBe(true);
  });

  it("respects MapLibre option overrides when attribution control is disabled", () => {
    const instance = new Instance({
      map_options: {
        maplibre_options: {
          attributionControl: false,
        },
      },
    });

    const mapContainer = document.getElementById("waymark-instance-map");
    const attributionControl = document.querySelector(
      "#waymark-instance-map .maplibregl-ctrl-bottom-right",
    );

    expect(mapContainer).toBeTruthy();
    expect(attributionControl).toBeFalsy();
    expect(instance.store.map.value.options.attributionControl).toBe(false);
  });

  it("passes additional MapLibre options through to the map instance", () => {
    const customStyle = "https://tiles.example.com/style.json";

    const instance = new Instance({
      map_options: {
        maplibre_options: {
          attributionControl: true,
          style: customStyle,
          maxZoom: 20,
        },
      },
    });

    const map = instance.store.map.value;

    expect(map.options.style).toBe(customStyle);
    expect(map.options.maxZoom).toBe(20);
    expect(
      document.querySelector(
        "#waymark-instance-map .maplibregl-ctrl-bottom-right",
      ),
    ).toBeTruthy();
  });
});
