import { Popup } from "maplibre-gl";

const DEFAULT_WHITELIST = ["name", "title", "description"];

/**
 * Extract [lng, lat] from a GeoJSON feature.
 * @param {import('geojson').Feature} feature
 * @returns {[number, number] | null}
 */
function getFeatureCoordinates(feature) {
  if (!feature?.geometry) return null;
  if (feature.geometry.type === "Point") {
    const coords = feature.geometry.coordinates;
    if (Array.isArray(coords) && coords.length >= 2) {
      return [coords[0], coords[1]];
    }
  }
  return null;
}

/**
 * @param {import('maplibre-gl').Map} map
 * @param {{ whitelist?: string[], enabled?: boolean }} [options]
 */
export function createFeaturePropertiesModule(map, options = {}) {
  const whitelist = new Set(options.whitelist ?? DEFAULT_WHITELIST);
  let enabled = options.enabled !== false;

  /** @type {Array<{ layerId: string, priority: number }>} */
  const observedLayers = [];

  /** @type {import('maplibre-gl').Popup | null} */
  let activePopup = null;

  function isEnabled() {
    return enabled;
  }

  function setEnabled(value) {
    enabled = value;
    if (!enabled) {
      clearPopup();
      map.getCanvas().style.cursor = "";
    }
  }

  function getWhitelist() {
    return [...whitelist];
  }

  function addWhitelistKeys(keys) {
    for (const key of keys) {
      whitelist.add(key);
    }
  }

  function clearPopup() {
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
  }

  /**
   * Filter feature properties to only whitelisted keys.
   * @param {Record<string, unknown> | null | undefined} properties
   * @returns {Array<[string, string | number | boolean]>}
   */
  function filterWhitelistedProperties(properties) {
    if (!properties || typeof properties !== "object") return [];

    const entries = [];

    for (const key of whitelist) {
      if (!Object.hasOwn(properties, key)) continue;

      const value = properties[key];

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        entries.push([key, value]);
      }
    }

    return entries;
  }

  /**
   * Check whether a feature has any whitelisted primitive property.
   * @param {Record<string, unknown> | null | undefined} properties
   * @returns {boolean}
   */
  function hasWhitelistedProperties(properties) {
    if (!properties || typeof properties !== "object") return false;

    for (const key of whitelist) {
      if (!Object.hasOwn(properties, key)) continue;

      const value = properties[key];

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Render whitelisted entries as an HTML table for the popup.
   * @param {Array<[string, string | number | boolean]>} entries
   * @returns {string}
   */
  function renderTable(entries) {
    if (entries.length === 0) return "";

    const rows = entries
      .map(([key, value]) => {
        const escapedKey = String(key).replace(/[&<>"']/g, "");
        const escapedValue = String(value).replace(/[&<>"']/g, "");
        return `<tr><td><strong>${escapedKey}</strong></td><td>${escapedValue}</td></tr>`;
      })
      .join("");

    return `<table class="waymark-feature-props"><tbody>${rows}</tbody></table>`;
  }

  /**
   * Query all observed layers at a point, sorted by priority (highest first).
   * Returns the best matching feature or null.
   * @param {import('maplibre-gl').PointLike} point
   * @returns {import('geojson').Feature | null}
   */
  function queryBestFeature(point) {
    if (observedLayers.length === 0) return null;

    // Sort by priority descending, then collect layer IDs in that order
    const sorted = [...observedLayers].sort(
      (a, b) => b.priority - a.priority,
    );
    const layerIds = sorted.map((l) => l.layerId);

    const features = map.queryRenderedFeatures(point, { layers: layerIds });
    return features?.[0] ?? null;
  }

  /**
   * @param {import('maplibre-gl').MapMouseEvent} event
   */
  function onMapClick(event) {
    if (!enabled) return;

    const feature = queryBestFeature(event.point);
    if (!feature) return;

    const entries = filterWhitelistedProperties(feature.properties);
    if (entries.length === 0) return;

    clearPopup();

    const html = renderTable(entries);
    if (!html) return;

    const coords = getFeatureCoordinates(feature);
    if (coords) {
      const currentZoom = map.getZoom();
      map.flyTo({
        center: coords,
        zoom: Math.min(currentZoom + 2, 18),
      });
    }

    activePopup = new Popup()
      .setLngLat(coords || event.lngLat)
      .setHTML(html)
      .addTo(map);
  }

  /**
   * @param {import('maplibre-gl').MapMouseEvent} event
   */
  function onMapMouseMove(event) {
    if (!enabled) return;

    const feature = queryBestFeature(event.point);
    map.getCanvas().style.cursor =
      feature && hasWhitelistedProperties(feature.properties)
        ? "pointer"
        : "";
  }

  /**
   * Register a layer for click/hover interaction with a priority level.
   *
   * When multiple layers overlap at the cursor position, the layer with
   * the highest priority wins. Priority values:
   *   3 — icon symbol layers
   *   2 — invisible hit circles behind icons
   *   1 — regular circle layers (tracking points)
   *   0 — line and fill layers
   *
   * @param {string} layerId
   * @param {number} [priority=0]
   */
  function observeLayer(layerId, priority = 0) {
    if (observedLayers.some((l) => l.layerId === layerId)) return;
    observedLayers.push({ layerId, priority });
  }

  /**
   * Clear observed layer tracking (e.g. after a style reload).
   * MapLibre event handlers registered on the map (not per-layer) survive.
   */
  function reset() {
    observedLayers.length = 0;
    clearPopup();
  }

  /**
   * Register map-level click/mousemove handlers if not already done.
   */
  let handlersAttached = false;
  function ensureHandlers() {
    if (handlersAttached) return;
    handlersAttached = true;
    map.on("click", onMapClick);
    map.on("mousemove", onMapMouseMove);
  }

  // Wire up map-level handlers on creation
  ensureHandlers();

  function destroy() {
    clearPopup();
    map.off("click", onMapClick);
    map.off("mousemove", onMapMouseMove);
    observedLayers.length = 0;
    map.getCanvas().style.cursor = "";
    handlersAttached = false;
  }

  return {
    observeLayer,
    setEnabled,
    isEnabled,
    addWhitelistKeys,
    getWhitelist,
    reset,
    destroy,
  };
}
