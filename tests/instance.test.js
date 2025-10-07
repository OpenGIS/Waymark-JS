import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("maplibre-gl", () => {
  class MockMap {
    constructor(options = {}) {
      this.handlers = {};
      this.options = options;
      this.sources = {};
      this.layers = [];
      this._styleLayers = [];
      const [defaultLng, defaultLat] = Array.isArray(options.center)
        ? options.center
        : [0, 0];
      this._zoom = options.zoom ?? 0;
      this._center = { lat: defaultLat, lng: defaultLng };

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

    getZoom() {
      return this._zoom;
    }

    getCenter() {
      return this._center;
    }

    addSource(id, source) {
      this.sources[id] = source;
    }

    addLayer(layer) {
      const layerCopy = JSON.parse(JSON.stringify(layer));
      this.layers.push(layerCopy);
      this._styleLayers.push(JSON.parse(JSON.stringify(layerCopy)));
    }

    getStyle() {
      return {
        layers: this._styleLayers,
      };
    }

    setLayoutProperty(id, property, value) {
      const updateLayer = (target) => {
        if (!target) return;
        target.layout = target.layout || {};
        target.layout[property] = value;
      };

      updateLayer(this.layers.find((layer) => layer.id === id));
      updateLayer(this._styleLayers.find((layer) => layer.id === id));
    }
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
import { TileLayer } from "../library/classes/TileLayer.js";

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

  it("registers configured tile layers on the map and activates the first entry", () => {
    const tileLayerConfig = [
      {
        layer_name: "Layer One",
        layer_url: "https://tiles.example.com/one/{z}/{x}/{y}.png",
        layer_attribution: "Layer One Attribution",
        layer_max_zoom: "17",
      },
      {
        layer_name: "Layer Two",
        layer_url: "https://tiles.example.com/two/{z}/{x}/{y}.png",
        layer_attribution: "Layer Two Attribution",
        layer_max_zoom: "16",
      },
    ];

    const instance = new Instance({
      map_options: {
        tile_layers: tileLayerConfig,
      },
    });

    const map = instance.store.map.value;
    const activeTileLayerRef = instance.store.activeTileLayer;
    const [tileLayerOne, tileLayerTwo] = instance.store.config.value.getTileLayers();

    expect(tileLayerOne).toBeInstanceOf(TileLayer);
    expect(tileLayerTwo).toBeInstanceOf(TileLayer);
    expect(activeTileLayerRef.value).toBe(tileLayerOne);

    const firstLayer = map.layers.find((layer) => layer.id === tileLayerOne.id);
    const secondLayer = map.layers.find((layer) => layer.id === tileLayerTwo.id);

    expect(map.sources).toHaveProperty(tileLayerOne.id);
    expect(map.sources[tileLayerOne.id]).toEqual(
      expect.objectContaining({
        type: "raster",
        tiles: [tileLayerOne.data.layer_url],
      }),
    );

    expect(map.sources).toHaveProperty(tileLayerTwo.id);
    expect(map.sources[tileLayerTwo.id]).toEqual(
      expect.objectContaining({
        type: "raster",
        tiles: [tileLayerTwo.data.layer_url],
      }),
    );

    expect(firstLayer?.layout.visibility).toBe("visible");
    expect(secondLayer?.layout.visibility).toBe("none");
  });

  it("merges tile layer defaults when optional fields are omitted", () => {
    const instance = new Instance({
      map_options: {
        tile_layers: [
          {
            layer_name: "Layer Defaults",
          },
        ],
      },
    });

    const [tileLayer] = instance.store.config.value.getTileLayers();

    expect(tileLayer).toBeInstanceOf(TileLayer);
    expect(tileLayer.data.layer_url).toBe(
      "http://tile.openstreetmap.org/{z}/{x}/{y}.png",
    );
    expect(tileLayer.data.layer_attribution).toContain("OpenStreetMap");
    expect(tileLayer.data.layer_max_zoom).toBe("18");
    expect(tileLayer.toSource()).toEqual(
      expect.objectContaining({
        maxzoom: 18,
        tiles: ["http://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      }),
    );
  });
});
