import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("maplibre-gl", () => {
  class MockMap {
    constructor() {
      this.handlers = {};
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

  it("mounts into the default container when constructed without configuration", () => {
    new Instance();

    const container = document.getElementById("waymark-instance");

    expect(container).toBeTruthy();
    expect(container?.style.height).toBe("100%");
  });
});
