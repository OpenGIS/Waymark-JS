/**
 * @typedef {object} WaymarkVectorBasemap
 * @property {string | Record<string, unknown>} styleURL
 * @property {string} [title]
 * @property {string} [attributionHTML]
 * @property {number} [maxZoom]
 * @property {number} [opacity]
 */

/**
 * @typedef {object} WaymarkRasterBasemap
 * @property {string[]} tileURLTemplates
 * @property {string} [title]
 * @property {string} [attributionHTML]
 * @property {number} [tileSize]
 * @property {number} [minZoom]
 * @property {number} [maxZoom]
 * @property {number} [opacity]
 */

/**
 * @typedef {object} WaymarkBasemapConfig
 * @property {WaymarkVectorBasemap[]} vector
 * @property {WaymarkRasterBasemap[]} raster
 */

/**
 * @typedef {object} WaymarkPaintByFamily
 * @property {Record<string, unknown>} [point]
 * @property {Record<string, unknown>} [line]
 * @property {Record<string, unknown>} [polygon]
 */

/**
 * @typedef {object} WaymarkTypeDefinition
 * @property {string} [title]
 * @property {WaymarkPaintByFamily} paint
 */

/**
 * @typedef {object} WaymarkInstanceDocumentConfig
 * @property {string} [id]
 * @property {{ options: Record<string, unknown>, basemaps?: Partial<WaymarkBasemapConfig> }} map
 * @property {({ mode: 'view' | 'debug' })} ui
 * @property {boolean} [debug]
 * @property {WaymarkPaintByFamily} [paint]
 * @property {Record<string, WaymarkTypeDefinition>} [types]
 */

/**
 * @typedef {object} WaymarkInstanceDocumentStateMapOptions
 * @property {[number, number]} [center]
 * @property {number} [zoom]
 * @property {number} [bearing]
 * @property {number} [pitch]
 */

/**
 * @typedef {object} WaymarkInstanceDocumentStateMap
 * @property {WaymarkInstanceDocumentStateMapOptions} [options]
 * @property {Partial<WaymarkBasemapConfig>} [basemaps]
 */

/**
 * @typedef {object} WaymarkInstanceDocumentDataLayer
 * @property {'geojson'} type
 * @property {object} data
 * @property {WaymarkPaintByFamily} [paint]
 */

/**
 * @typedef {object} WaymarkInstanceDocument
 * @property {WaymarkInstanceDocumentConfig} config
 * @property {{ map?: WaymarkInstanceDocumentStateMap, ui?: { mode?: 'view' | 'debug' }, debug?: boolean, types?: Record<string, { visible?: boolean }> }} state
 * @property {{ layers: WaymarkInstanceDocumentDataLayer[] }} data
 */

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
import { isValidTypeKey } from "../utils/typeUtils.js";

const PAINT_FAMILY_KEYS = new Set(["point", "line", "polygon"]);

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

const geoJSONGeometryTypes = new Set([
  "Point",
  "MultiPoint",
  "LineString",
  "MultiLineString",
  "Polygon",
  "MultiPolygon",
  "GeometryCollection",
]);

/**
 * @param {unknown} value
 */
function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * @param {unknown} position
 * @param {string} path
 */
function validateGeoJSONPosition(position, path) {
  if (!Array.isArray(position) || position.length < 2) {
    throw new Error(
      `Invalid ${path}: expected a position array with at least two numbers (longitude, latitude).`,
    );
  }

  if (!isFiniteNumber(position[0])) {
    throw new Error(`Invalid ${path}[0]: expected a finite longitude number.`);
  }

  if (!isFiniteNumber(position[1])) {
    throw new Error(`Invalid ${path}[1]: expected a finite latitude number.`);
  }
}

/**
 * @param {unknown} lineCoordinates
 * @param {string} path
 */
function validateLineStringCoordinates(lineCoordinates, path) {
  if (!Array.isArray(lineCoordinates)) {
    throw new Error(`Invalid ${path}: expected an array.`);
  }

  if (lineCoordinates.length < 2) {
    throw new Error(
      `Invalid ${path}: expected a LineString coordinates array with at least two positions.`,
    );
  }

  for (const [index, position] of lineCoordinates.entries()) {
    validateGeoJSONPosition(position, `${path}[${index}]`);
  }
}

/**
 * @param {unknown} ringCoordinates
 * @param {string} path
 */
function validateLinearRingCoordinates(ringCoordinates, path) {
  if (!Array.isArray(ringCoordinates)) {
    throw new Error(`Invalid ${path}: expected an array.`);
  }

  if (ringCoordinates.length < 4) {
    throw new Error(
      `Invalid ${path}: expected a LinearRing coordinates array with at least four positions.`,
    );
  }

  for (const [index, position] of ringCoordinates.entries()) {
    validateGeoJSONPosition(position, `${path}[${index}]`);
  }

  const firstPosition = ringCoordinates[0];
  const lastPosition = ringCoordinates[ringCoordinates.length - 1];

  const isClosed =
    Array.isArray(firstPosition) &&
    Array.isArray(lastPosition) &&
    firstPosition.length === lastPosition.length &&
    firstPosition.every((value, index) => value === lastPosition[index]);

  if (!isClosed) {
    throw new Error(
      `Invalid ${path}: expected first and last positions to be equivalent (closed LinearRing).`,
    );
  }
}

/**
 * @param {unknown} polygonCoordinates
 * @param {string} path
 */
function validatePolygonCoordinates(polygonCoordinates, path) {
  if (!Array.isArray(polygonCoordinates)) {
    throw new Error(`Invalid ${path}: expected an array.`);
  }

  if (polygonCoordinates.length === 0) {
    throw new Error(
      `Invalid ${path}: expected a Polygon coordinates array with at least one LinearRing.`,
    );
  }

  for (const [index, ringCoordinates] of polygonCoordinates.entries()) {
    validateLinearRingCoordinates(ringCoordinates, `${path}[${index}]`);
  }
}

/**
 * @param {unknown} geometry
 * @param {string} path
 */
function validateGeoJSONGeometry(geometry, path) {
  if (!isPlainObject(geometry)) {
    throw new Error(`Invalid ${path}: expected a GeoJSON geometry object.`);
  }

  if (!geoJSONGeometryTypes.has(geometry.type)) {
    throw new Error(
      `Invalid ${path}.type: expected a supported GeoJSON geometry type.`,
    );
  }

  if (geometry.type !== "GeometryCollection") {
    if (!Array.isArray(geometry.coordinates)) {
      throw new Error(`Invalid ${path}.coordinates: expected an array.`);
    }

    if (geometry.type === "Point") {
      validateGeoJSONPosition(geometry.coordinates, `${path}.coordinates`);
      return;
    }

    if (geometry.type === "MultiPoint") {
      for (const [index, position] of geometry.coordinates.entries()) {
        validateGeoJSONPosition(position, `${path}.coordinates[${index}]`);
      }

      return;
    }

    if (geometry.type === "LineString") {
      validateLineStringCoordinates(
        geometry.coordinates,
        `${path}.coordinates`,
      );
      return;
    }

    if (geometry.type === "MultiLineString") {
      for (const [index, lineCoordinates] of geometry.coordinates.entries()) {
        validateLineStringCoordinates(
          lineCoordinates,
          `${path}.coordinates[${index}]`,
        );
      }

      return;
    }

    if (geometry.type === "Polygon") {
      validatePolygonCoordinates(geometry.coordinates, `${path}.coordinates`);
      return;
    }

    if (geometry.type === "MultiPolygon") {
      for (const [
        index,
        polygonCoordinates,
      ] of geometry.coordinates.entries()) {
        validatePolygonCoordinates(
          polygonCoordinates,
          `${path}.coordinates[${index}]`,
        );
      }
    }

    return;
  }

  if (!Array.isArray(geometry.geometries)) {
    throw new Error(
      `Invalid ${path}.geometries: expected an array for GeometryCollection.`,
    );
  }

  for (const [index, nestedGeometry] of geometry.geometries.entries()) {
    validateGeoJSONGeometry(nestedGeometry, `${path}.geometries[${index}]`);
  }
}

/**
 * @param {unknown} feature
 * @param {string} path
 */
function validateGeoJSONFeature(feature, path) {
  if (!isPlainObject(feature) || feature.type !== "Feature") {
    throw new Error(`Invalid ${path}: expected a GeoJSON Feature object.`);
  }

  if (!Object.hasOwn(feature, "geometry")) {
    throw new Error(`Invalid ${path}.geometry: expected an object or null.`);
  }

  if (feature.geometry !== null && !isPlainObject(feature.geometry)) {
    throw new Error(`Invalid ${path}.geometry: expected an object or null.`);
  }

  if (isPlainObject(feature.geometry)) {
    validateGeoJSONGeometry(feature.geometry, `${path}.geometry`);
  }
}

/**
 * @param {unknown} data
 * @param {string} path
 */
function validateGeoJSONDataShape(data, path) {
  if (!isPlainObject(data)) {
    throw new Error(`Invalid ${path}: expected a GeoJSON object.`);
  }

  if (data.type === "FeatureCollection") {
    if (!Array.isArray(data.features)) {
      throw new Error(`Invalid ${path}.features: expected an array.`);
    }

    for (const [index, feature] of data.features.entries()) {
      validateGeoJSONFeature(feature, `${path}.features[${index}]`);
    }

    return;
  }

  if (data.type === "Feature") {
    validateGeoJSONFeature(data, path);
    return;
  }

  validateGeoJSONGeometry(data, path);
}

/**
 * @param {unknown} mode
 * @returns {'view' | 'debug'}
 */
export function normaliseMode(mode) {
  return mode === "debug" ? "debug" : "view";
}

/**
 * Deterministically keeps JSON-serialisable values only.
 *
 * - object properties with non-serialisable values are dropped
 * - array elements with non-serialisable values become null
 * - non-finite numbers become null
 *
 * @param {unknown} value
 * @returns {unknown}
 */
export function toSerializableValue(value) {
  if (value === null) {
    return null;
  }

  if (typeof value === "string" || typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      const normalisedItem = toSerializableValue(item);
      return normalisedItem === undefined ? null : normalisedItem;
    });
  }

  if (!isPlainObject(value)) {
    return undefined;
  }

  /** @type {Record<string, unknown>} */
  const normalisedObject = {};

  for (const [key, childValue] of Object.entries(value)) {
    const normalisedChild = toSerializableValue(childValue);
    if (normalisedChild !== undefined) {
      normalisedObject[key] = normalisedChild;
    }
  }

  return normalisedObject;
}

/**
 * @param {unknown} mapOptions
 * @returns {Record<string, unknown>}
 */
function normaliseMapOptions(mapOptions) {
  if (!isPlainObject(mapOptions)) {
    return {};
  }

  if (Object.hasOwn(mapOptions, "style")) {
    throw new Error(
      "Invalid config.map.options.style: use config.map.basemaps.vector[] instead.",
    );
  }

  const serialisable = toSerializableValue(mapOptions);
  return isPlainObject(serialisable) ? serialisable : {};
}

/**
 * @param {unknown} value
 * @param {string} path
 */
function expectPlainObject(value, path) {
  if (!isPlainObject(value)) {
    throw new Error(`Invalid ${path}: expected an object.`);
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 */
function normaliseOptionalString(value, path) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Invalid ${path}: expected a non-empty string.`);
  }

  return value;
}

/**
 * @param {unknown} value
 * @param {string} path
 */
function normaliseOptionalNumber(value, path) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid ${path}: expected a finite number.`);
  }

  return value;
}

/**
 * @param {unknown} value
 * @param {string} path
 */
function normaliseOptionalOpacity(value, path) {
  const opacity = normaliseOptionalNumber(value, path);

  if (opacity === undefined) {
    return undefined;
  }

  if (opacity < 0 || opacity > 1) {
    throw new Error(`Invalid ${path}: expected a number between 0 and 1.`);
  }

  return opacity;
}

/**
 * @param {unknown} value
 * @param {string} path
 */
function normaliseVectorStyleURL(value, path) {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (isPlainObject(value)) {
    const serialisable = toSerializableValue(value);

    if (isPlainObject(serialisable)) {
      return serialisable;
    }
  }

  throw new Error(
    `Invalid ${path}: expected a non-empty string or style object.`,
  );
}

/**
 * @param {unknown} entry
 * @param {number} index
 * @returns {WaymarkVectorBasemap}
 */
function normaliseVectorBasemapEntry(entry, index) {
  const path = `config.map.basemaps.vector[${index}]`;
  expectPlainObject(entry, path);

  const allowedKeys = new Set([
    "styleURL",
    "title",
    "attributionHTML",
    "maxZoom",
    "opacity",
  ]);
  for (const key of Object.keys(entry)) {
    if (!allowedKeys.has(key)) {
      throw new Error(
        `Invalid ${path}.${key}: unexpected key for vector basemap entry.`,
      );
    }
  }

  const styleURL = normaliseVectorStyleURL(entry.styleURL, `${path}.styleURL`);

  return {
    styleURL,
    ...(normaliseOptionalString(entry.title, `${path}.title`) !== undefined
      ? { title: normaliseOptionalString(entry.title, `${path}.title`) }
      : {}),
    ...(normaliseOptionalString(
      entry.attributionHTML,
      `${path}.attributionHTML`,
    ) !== undefined
      ? {
          attributionHTML: normaliseOptionalString(
            entry.attributionHTML,
            `${path}.attributionHTML`,
          ),
        }
      : {}),
    ...(normaliseOptionalNumber(entry.maxZoom, `${path}.maxZoom`) !== undefined
      ? { maxZoom: normaliseOptionalNumber(entry.maxZoom, `${path}.maxZoom`) }
      : {}),
    ...(normaliseOptionalOpacity(entry.opacity, `${path}.opacity`) !== undefined
      ? { opacity: normaliseOptionalOpacity(entry.opacity, `${path}.opacity`) }
      : {}),
  };
}

/**
 * @param {unknown} entry
 * @param {number} index
 * @returns {WaymarkRasterBasemap}
 */
function normaliseRasterBasemapEntry(entry, index) {
  const path = `config.map.basemaps.raster[${index}]`;
  expectPlainObject(entry, path);

  const allowedKeys = new Set([
    "tileURLTemplates",
    "title",
    "attributionHTML",
    "tileSize",
    "minZoom",
    "maxZoom",
    "opacity",
  ]);
  for (const key of Object.keys(entry)) {
    if (!allowedKeys.has(key)) {
      throw new Error(
        `Invalid ${path}.${key}: unexpected key for raster basemap entry.`,
      );
    }
  }

  if (
    !Array.isArray(entry.tileURLTemplates) ||
    entry.tileURLTemplates.length === 0
  ) {
    throw new Error(
      `Invalid ${path}.tileURLTemplates: expected a non-empty string array.`,
    );
  }

  const tileURLTemplates = entry.tileURLTemplates.map((tile, tileIndex) => {
    if (typeof tile !== "string" || tile.length === 0) {
      throw new Error(
        `Invalid ${path}.tileURLTemplates[${tileIndex}]: expected a non-empty string.`,
      );
    }

    return tile;
  });

  return {
    tileURLTemplates,
    ...(normaliseOptionalString(entry.title, `${path}.title`) !== undefined
      ? { title: normaliseOptionalString(entry.title, `${path}.title`) }
      : {}),
    ...(normaliseOptionalString(
      entry.attributionHTML,
      `${path}.attributionHTML`,
    ) !== undefined
      ? {
          attributionHTML: normaliseOptionalString(
            entry.attributionHTML,
            `${path}.attributionHTML`,
          ),
        }
      : {}),
    ...(normaliseOptionalNumber(entry.tileSize, `${path}.tileSize`) !==
    undefined
      ? {
          tileSize: normaliseOptionalNumber(entry.tileSize, `${path}.tileSize`),
        }
      : {}),
    ...(normaliseOptionalNumber(entry.minZoom, `${path}.minZoom`) !== undefined
      ? { minZoom: normaliseOptionalNumber(entry.minZoom, `${path}.minZoom`) }
      : {}),
    ...(normaliseOptionalNumber(entry.maxZoom, `${path}.maxZoom`) !== undefined
      ? { maxZoom: normaliseOptionalNumber(entry.maxZoom, `${path}.maxZoom`) }
      : {}),
    ...(normaliseOptionalOpacity(entry.opacity, `${path}.opacity`) !== undefined
      ? { opacity: normaliseOptionalOpacity(entry.opacity, `${path}.opacity`) }
      : {}),
  };
}

/**
 * @param {unknown} rawBasemaps
 * @returns {WaymarkBasemapConfig}
 */
function normaliseBasemaps(rawBasemaps) {
  if (rawBasemaps === undefined) {
    return {
      raster: [],
      vector: [],
    };
  }

  expectPlainObject(rawBasemaps, "config.map.basemaps");

  const allowedKeys = new Set(["vector", "raster"]);
  for (const key of Object.keys(rawBasemaps)) {
    if (!allowedKeys.has(key)) {
      throw new Error(
        `Invalid config.map.basemaps.${key}: expected only vector and raster keys.`,
      );
    }
  }

  if (rawBasemaps.vector !== undefined && !Array.isArray(rawBasemaps.vector)) {
    throw new Error("Invalid config.map.basemaps.vector: expected an array.");
  }

  if (rawBasemaps.raster !== undefined && !Array.isArray(rawBasemaps.raster)) {
    throw new Error("Invalid config.map.basemaps.raster: expected an array.");
  }

  return {
    raster: (rawBasemaps.raster ?? []).map((entry, index) =>
      normaliseRasterBasemapEntry(entry, index),
    ),
    vector: (rawBasemaps.vector ?? []).map((entry, index) =>
      normaliseVectorBasemapEntry(entry, index),
    ),
  };
}

/**
 * @param {unknown} stateMap
 * @returns {WaymarkInstanceDocumentStateMap}
 */
function normaliseStateMapOptions(stateMapOptions) {
  if (!isPlainObject(stateMapOptions)) {
    return {};
  }

  /** @type {WaymarkInstanceDocumentStateMapOptions} */
  const normalised = {};

  for (const key of ["center", "zoom", "bearing", "pitch"]) {
    if (Object.hasOwn(stateMapOptions, key)) {
      normalised[key] = stateMapOptions[key];
    }
  }

  return normalised;
}

/**
 * @param {unknown} stateMap
 * @returns {WaymarkInstanceDocumentStateMap}
 */
function normaliseStateMap(stateMap) {
  if (!isPlainObject(stateMap)) {
    return {};
  }

  const normalisedOptions = normaliseStateMapOptions(stateMap.options);

  return {
    ...(Object.keys(normalisedOptions).length > 0
      ? { options: normalisedOptions }
      : {}),
    ...(Object.hasOwn(stateMap, "basemaps")
      ? { basemaps: normaliseBasemaps(stateMap.basemaps) }
      : {}),
  };
}

/**
 * @param {unknown} layer
 * @param {number} index
 * @returns {WaymarkInstanceDocumentDataLayer}
 */
export function normaliseDataLayer(layer, index = 0) {
  const path = `data.layers[${index}]`;
  expectPlainObject(layer, path);

  const allowedKeys = new Set(["type", "data", "paint"]);
  for (const key of Object.keys(layer)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`Invalid ${path}.${key}: unexpected key for data layer.`);
    }
  }

  const normalisedType = layer.type ?? "geojson";

  if (normalisedType !== "geojson") {
    throw new Error(
      `Invalid ${path}.type: only geojson is currently supported.`,
    );
  }

  if (!Object.hasOwn(layer, "data")) {
    throw new Error(`Invalid ${path}.data: expected a GeoJSON object.`);
  }

  const serialisableData = toSerializableValue(layer.data);
  validateGeoJSONDataShape(serialisableData, `${path}.data`);

  const normalisedPaint = normalisePaint(layer.paint, `${path}.paint`);

  return {
    type: "geojson",
    data: serialisableData,
    ...(normalisedPaint !== undefined ? { paint: normalisedPaint } : {}),
  };
}

/**
 * @param {unknown} layers
 * @returns {WaymarkInstanceDocumentDataLayer[]}
 */
function normaliseDataLayers(layers) {
  if (layers === undefined) {
    return [];
  }

  if (!Array.isArray(layers)) {
    throw new Error("Invalid data.layers: expected an array.");
  }

  return layers.map((layer, index) => normaliseDataLayer(layer, index));
}

/**
 * @param {unknown} instanceDocument
 * @returns {WaymarkInstanceDocument}
 */
export function normaliseInstanceDocument(instanceDocument) {
  const root = isPlainObject(instanceDocument) ? instanceDocument : {};

  const rawConfig = isPlainObject(root.config) ? root.config : {};
  const rawConfigMap = isPlainObject(rawConfig.map) ? rawConfig.map : {};
  const rawConfigUI = isPlainObject(rawConfig.ui) ? rawConfig.ui : {};
  const rawState = isPlainObject(root.state) ? root.state : {};
  const rawStateUI = isPlainObject(rawState.ui) ? rawState.ui : {};
  const rawData = isPlainObject(root.data) ? root.data : {};

  const normalisedPaint = normalisePaint(rawConfig.paint, "config.paint");
  const normalisedTypes = normaliseTypes(rawConfig.types, "config.types");
  const normalisedStateTypes = normaliseStateTypes(rawState.types);

  const normalised = {
    config: {
      map: {
        options: normaliseMapOptions(rawConfigMap.options),
        basemaps: normaliseBasemaps(rawConfigMap.basemaps),
      },
      ui: {
        mode: normaliseMode(rawConfigUI.mode),
      },
      debug: rawConfig.debug === true,
    },
    state: {
      ...(() => {
        const normalisedStateMap = normaliseStateMap(rawState.map);

        return Object.keys(normalisedStateMap).length > 0
          ? { map: normalisedStateMap }
          : {};
      })(),
      ...(rawStateUI.mode !== undefined
        ? {
            ui: {
              mode: normaliseMode(rawStateUI.mode),
            },
          }
        : {}),
      ...(rawState.debug !== undefined
        ? {
            debug: rawState.debug === true,
          }
        : {}),
    },
    data: {
      layers: [],
    },
  };

  if (normalisedPaint !== undefined) {
    normalised.config.paint = normalisedPaint;
  }

  if (normalisedTypes !== undefined) {
    normalised.config.types = normalisedTypes;
  }

  if (normalisedStateTypes !== undefined) {
    normalised.state.types = normalisedStateTypes;
  }

  if (typeof rawConfig.id === "string" && rawConfig.id.length > 0) {
    normalised.config.id = rawConfig.id;
  }

  if (Object.hasOwn(rawData, "layers")) {
    normalised.data.layers = normaliseDataLayers(rawData.layers);
  }

  return normalised;
}

/**
 * Normalise a paint block (per-family paint properties).
 * Paint is an optional object with family keys (point, line, polygon),
 * each containing MapLibre paint properties.
 *
 * @param {unknown} paint
 * @param {string} path
 * @returns {WaymarkPaintByFamily | undefined}
 */
function normalisePaint(paint, path) {
  if (paint === undefined) {
    return undefined;
  }

  expectPlainObject(paint, path);

  for (const key of Object.keys(paint)) {
    if (!PAINT_FAMILY_KEYS.has(key)) {
      throw new Error(
        `Invalid ${path}.${key}: expected a paint family key (point, line, or polygon).`,
      );
    }

    if (paint[key] !== undefined && !isPlainObject(paint[key])) {
      throw new Error(
        `Invalid ${path}.${key}: expected a plain object with paint properties.`,
      );
    }
  }

  return paint;
}

/**
 * Normalise config.types definitions.
 *
 * @param {unknown} types
 * @param {string} path
 * @returns {Record<string, WaymarkTypeDefinition> | undefined}
 */
function normaliseTypes(types, path) {
  if (types === undefined) {
    return undefined;
  }

  expectPlainObject(types, path);

  /** @type {Record<string, WaymarkTypeDefinition>} */
  const normalised = {};

  for (const [typeKey, typeDef] of Object.entries(types)) {
    const typePath = `${path}.${typeKey}`;

    if (!isValidTypeKey(typeKey)) {
      throw new Error(
        `Invalid ${typePath}: type key "${typeKey}" is invalid. Must be 1-64 characters, lowercase a-z, digits 0-9, and hyphens only (no leading/trailing hyphens).`,
      );
    }

    expectPlainObject(typeDef, typePath);

    const allowedKeys = new Set(["title", "paint"]);
    for (const key of Object.keys(typeDef)) {
      if (!allowedKeys.has(key)) {
        throw new Error(
          `Invalid ${typePath}.${key}: unexpected key for type definition.`,
        );
      }
    }

    if (typeDef.title !== undefined) {
      if (typeof typeDef.title !== "string" || typeDef.title.length === 0) {
        throw new Error(
          `Invalid ${typePath}.title: expected a non-empty string.`,
        );
      }
    }

    if (!isPlainObject(typeDef.paint)) {
      throw new Error(
        `Invalid ${typePath}.paint: expected a plain object with family paint keys.`,
      );
    }

    const normalisedPaint = normalisePaint(typeDef.paint, `${typePath}.paint`);

    if (!normalisedPaint) {
      throw new Error(
        `Invalid ${typePath}.paint: expected at least one family paint definition.`,
      );
    }

    const hasValidFamilies = Object.keys(normalisedPaint).some((key) =>
      PAINT_FAMILY_KEYS.has(key),
    );

    if (!hasValidFamilies) {
      throw new Error(
        `Invalid ${typePath}.paint: expected at least one family key (point, line, or polygon).`,
      );
    }

    normalised[typeKey] = {
      ...(typeDef.title !== undefined ? { title: typeDef.title } : {}),
      paint: normalisedPaint,
    };
  }

  return Object.keys(normalised).length > 0 ? normalised : undefined;
}

/**
 * @param {unknown} stateTypes
 * @returns {Record<string, { visible?: boolean }> | undefined}
 */
function normaliseStateTypes(stateTypes) {
  if (stateTypes === undefined) {
    return undefined;
  }

  if (!isPlainObject(stateTypes)) {
    return undefined;
  }

  /** @type {Record<string, { visible?: boolean }>} */
  const normalised = {};

  for (const [typeKey, typeState] of Object.entries(stateTypes)) {
    if (!isValidTypeKey(typeKey)) {
      continue;
    }

    if (!isPlainObject(typeState)) {
      continue;
    }

    const visible =
      typeState.visible === undefined || typeState.visible === true
        ? undefined
        : typeState.visible === false
          ? false
          : undefined;

    if (visible !== undefined) {
      normalised[typeKey] = { visible };
    }
  }

  return Object.keys(normalised).length > 0 ? normalised : undefined;
}

/**
 * @param {WaymarkInstanceDocument} instanceDocument
 */
export function validateInstanceDocument(instanceDocument) {
  if (!isPlainObject(instanceDocument)) {
    return false;
  }

  const { config, state, data } = instanceDocument;
  if (!isPlainObject(config) || !isPlainObject(state) || !isPlainObject(data)) {
    return false;
  }

  const basemaps = config.map?.basemaps;
  const hasValidBasemaps =
    basemaps === undefined ||
    (isPlainObject(basemaps) &&
      (basemaps.vector === undefined || Array.isArray(basemaps.vector)) &&
      (basemaps.raster === undefined || Array.isArray(basemaps.raster)));

  const hasValidStateMap =
    state.map === undefined ||
    (isPlainObject(state.map) &&
      (state.map.options === undefined || isPlainObject(state.map.options)) &&
      (state.map.basemaps === undefined ||
        (isPlainObject(state.map.basemaps) &&
          (state.map.basemaps.vector === undefined ||
            Array.isArray(state.map.basemaps.vector)) &&
          (state.map.basemaps.raster === undefined ||
            Array.isArray(state.map.basemaps.raster)))));

  const hasValidStateUI =
    state.ui === undefined ||
    (isPlainObject(state.ui) &&
      (state.ui.mode === undefined || typeof state.ui.mode === "string"));

  const hasValidDataLayers =
    Array.isArray(data.layers) &&
    data.layers.every((layer, index) => {
      if (
        !isPlainObject(layer) ||
        !Object.hasOwn(layer, "type") ||
        !Object.hasOwn(layer, "data") ||
        layer.type !== "geojson"
      ) {
        return false;
      }

      const allowedLayerKeys = new Set(["type", "data", "paint"]);
      for (const key of Object.keys(layer)) {
        if (!allowedLayerKeys.has(key)) {
          return false;
        }
      }

      try {
        validateGeoJSONDataShape(layer.data, `data.layers[${index}].data`);
        return true;
      } catch {
        return false;
      }
    });

  const hasValidConfigDebug =
    config.debug === undefined || typeof config.debug === "boolean";

  const hasValidStateDebug =
    state.debug === undefined || typeof state.debug === "boolean";

  const hasValidConfigPaint =
    config.paint === undefined || isPlainObject(config.paint);

  const hasValidConfigTypes =
    config.types === undefined || isPlainObject(config.types);

  const hasValidStateTypes =
    state.types === undefined || isPlainObject(state.types);

  return (
    typeof config.ui?.mode === "string" &&
    isPlainObject(config.map?.options) &&
    hasValidBasemaps &&
    hasValidConfigDebug &&
    hasValidConfigPaint &&
    hasValidConfigTypes &&
    hasValidStateMap &&
    hasValidStateUI &&
    hasValidStateDebug &&
    hasValidStateTypes &&
    hasValidDataLayers
  );
}

/**
 * @param {WaymarkInstanceDocument} instanceDocument
 * @returns {WaymarkInstanceDocument}
 */
export function serialiseInstanceDocument(instanceDocument) {
  const cloned = /** @type {WaymarkInstanceDocument | undefined} */ (
    toSerializableValue(instanceDocument)
  );

  if (!cloned || !validateInstanceDocument(cloned)) {
    throw new Error("Failed to serialise instance document.");
  }

  return cloned;
}
