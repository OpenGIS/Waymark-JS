import { Popup } from "maplibre-gl";

const DEFAULT_WHITELIST = ["name", "title", "description"];

/**
 * @param {import('maplibre-gl').Map} map
 * @param {{ whitelist?: string[], enabled?: boolean }} [options]
 */
export function createFeaturePropertiesModule(map, options = {}) {
  const whitelist = new Set(options.whitelist ?? DEFAULT_WHITELIST);
  let enabled = options.enabled !== false;

  /** @type {Set<string>} */
  const observedLayerIds = new Set();

  /** @type {import('maplibre-gl').Popup | null} */
  let activePopup = null;

  function isEnabled() {
    return enabled;
  }

  function setEnabled(value) {
    enabled = value;
    if (!enabled) {
      clearPopup();
      // Reset cursor if feature properties are disabled
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
   * @param {import('maplibre-gl').MapLayerMouseEvent} event
   */
  function onLayerClick(event) {
    if (!enabled) return;

    const feature = event.features?.[0];
    if (!feature) return;

    const entries = filterWhitelistedProperties(feature.properties);
    if (entries.length === 0) return;

    clearPopup();

    const html = renderTable(entries);
    if (!html) return;

    activePopup = new Popup().setLngLat(event.lngLat).setHTML(html).addTo(map);
  }

  /**
   * @param {import('maplibre-gl').MapLayerMouseEvent} event
   */
  function onLayerMouseMove(event) {
    if (!enabled) return;

    const feature = event.features?.[0];
    if (!feature) return;

    map.getCanvas().style.cursor = hasWhitelistedProperties(feature.properties)
      ? "pointer"
      : "";
  }

  /**
   * Register click and hover handlers on a MapLibre sublayer.
   * Safe to call multiple times for the same layerId.
   * @param {string} layerId
   */
  function observeLayer(layerId) {
    if (observedLayerIds.has(layerId)) return;
    observedLayerIds.add(layerId);

    map.on("click", layerId, onLayerClick);
    map.on("mousemove", layerId, onLayerMouseMove);
  }

  /**
   * Clear observed layer tracking (e.g. after a style reload).
   * Does not try to unregister MapLibre handlers — they're already dead.
   */
  function reset() {
    observedLayerIds.clear();
    clearPopup();
  }

  function destroy() {
    clearPopup();

    for (const layerId of observedLayerIds) {
      map.off("click", layerId, onLayerClick);
      map.off("mousemove", layerId, onLayerMouseMove);
    }

    observedLayerIds.clear();
    map.getCanvas().style.cursor = "";
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
