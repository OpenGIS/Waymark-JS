# Paint & Types

Paint hierarchy (5 levels from FAMILY_TYPES/pool up to feature-level waymarkPaint) with first-class type support for Waymark JS data layers.

---

## Paint hierarchy (ascending priority)

```
Feature-level waymarkPaint (per GeoJSON feature, internal expressions)
  └── Type-level paint (config.types[typeKey].paint, typed features only)
       └── Layer-level paint (data.layers[].paint, fallback for untyped)
             └── Instance-level paint (config.paint)
                 └── Colour pool (auto-assigned per layer index)
                      └── FAMILY_TYPES non-colour defaults (lowest)
```

| Level    | Where defined                                                       | Scope                       | Consumer writes?       |
| -------- | ------------------------------------------------------------------- | --------------------------- | ---------------------- |
| Default  | `src/geojson/createGeoJSONModule.js` — `FAMILY_TYPES` + colour pool | Codebase constant + pool    | No                     |
| Instance | `config.paint`                                                      | All layers in the instance  | Yes                    |
| Layer    | `data.layers[].paint`                                               | One logical data layer      | Yes                    |
| Type     | `config.types[typeKey].paint`                                       | Features with matching type | Yes                    |
| Feature  | `properties.waymarkPaint`                                           | Individual GeoJSON feature  | Yes (simple key/value) |

### Resolution semantics

Each paint level specifies per-family paint properties (`point`, `line`, `polygon`). They partially overlap — a level only needs to define the properties it wants to override:

```js
// Instance-level: set a default line colour
config.paint: {
  line: { "line-color": "#dc2626" }
}

// Type-level: override just the line width for "route" features
config.types: {
  route: {
    title: "Route",
    paint: {
      line: { "line-width": 6 }
    }
  }
}
```

Resolution is shallow merge at paint-plan build time:

1. **Start with `FAMILY_TYPES[family]` non-colour defaults** (width, radius, opacity) plus a colour from the pool assigned by layer index.
2. Merge in `config.paint[family]` keys (if any).
3. For the untyped fallback sublayer: merge in `layerPaint[family]` keys (if any).
4. For each typed sublayer: merge in `typePaint[family]` keys (if any).

Because the colour is assigned at step 1 (lowest level), if the user sets a colour at any higher level it overrides the pool colour. If they don't, each data layer gets a distinct visual identity from the pool.

Feature-level `waymarkPaint` is different — it's not a merge. It wraps each resolved paint property in a MapLibre expression at sublayer mount time, so individual features can override on a per-property basis. See [Feature-level waymarkPaint](#feature-level-waymarkpaint).

### Instance-level paint

```js
{
  config: {
    paint: {
      point: {
        "circle-color": "#ef4444",
        "circle-radius": 8
      },
      line: {
        "line-color": "#3b82f6",
        "line-width": 4
      },
      polygon: {
        "fill-color": "#10b981",
        "fill-opacity": 0.3
      }
    }
  }
}
```

Instance-level paint sets the baseline for all layers, overriding the colour pool and `FAMILY_TYPES` non-colour defaults. Only define the families and properties you want to override — missing families fall through to the colour pool and `FAMILY_TYPES`.

Serialised in `config.paint` only (stable baseline, no runtime delta).

### Layer-level paint

```js
{
  data: {
    layers: [
      {
        type: "geojson",
        paint: {
          line: { "line-color": "#f59e0b", "line-width": 2 }
        },
        data: { ... }
      }
    ]
  }
}
```

Layer paint overrides instance/default paint, but only for **untyped features** in that layer. Typed features use type-level paint instead (in their own sublayer).

Serialised in `data.layers[].paint` — part of the canonical document.

### Type-level paint

```js
{
  config: {
    types: {
      route: {
        title: "Route",
        paint: {
          line: { "line-color": "#22c55e", "line-width": 5 },
          point: { "circle-color": "#22c55e", "circle-radius": 6 }
        }
      },
      danger: {
        title: "Danger",
        paint: {
          line: { "line-color": "#ef4444", "line-width": 5 }
        }
      }
    }
  }
}
```

Type paint is the baseline for all features with matching `waymarkType`. Defined instance-wide in `config.types`. Each type maps a type key to paint config + title (for UI).

Types only define paint for geometry families they use. If a type only has line features, only `line` paint is needed.

**Family coverage**: A sublayer is only created for a (family, type) pair when the type defines paint for that family. If a type defines `point` paint but not `line` paint, and a feature has `waymarkType: "route"` with a LineString geometry, that feature won't match any sublayer — it's not in the `point-type-route` sublayer (wrong geometry type) and the untyped fallback excludes features with `waymarkType`. **Result**: features whose geometry family isn't covered by the type's paint are invisible. Developers must define paint for all geometry families a type uses.

Serialised in `config` only (stable baseline).

### Feature-level waymarkPaint

```js
{
  type: "Feature",
  properties: {
    waymarkType: "route",
    waymarkPaint: {
      "line-color": "#ff0000"
    }
  },
  geometry: { ... }
}
```

Feature `waymarkPaint` is authored as simple key-value paint properties on the GeoJSON feature. Waymark converts these to internal MapLibre expressions at sublayer mount time. Consumers never write expressions.

For each paint property on a sublayer, if that layer has _any_ features with `waymarkPaint`, the static paint value is wrapped:

```js
// Static paint value (no waymarkPaint features):
"line-color": "#e6194b"   // pool colour for layer 0

// Expression paint (waymarkPaint features exist):
"line-color": [
  "coalesce",
  ["get", "line-color", ["get", "waymarkPaint", ["properties"]]],
  "#e6194b"
]
```

The `["coalesce", ...]` pattern tries the feature-level value first, falls back to the resolved (merged) type/layer/instance/pool/default value.

Whether to use expressions is determined per sublayer at mount time: scan features that will hit this sublayer, check if any have `waymarkPaint`.

> [!NOTE]
> `waymarkPaint` is runtime-only metadata on GeoJSON features. It is not serialised into `toJSON()` — it remains part of the GeoJSON `data` payload and round-trips through the data layer's `.data` field.

**Structure**: Unlike the other paint levels (which are family-keyed), `waymarkPaint` is flat. It contains MapLibre paint property keys directly (`"line-color"`, `"circle-radius"`, etc.) without a family wrapper. The feature's geometry type determines which properties are applicable — a Point feature has no `line-color`.

```js
// Point feature waymarkPaint
{ "circle-color": "#ff0000", "circle-radius": 8 }

// Line feature waymarkPaint
{ "line-color": "#00ff00", "line-width": 5 }

// Polygon feature waymarkPaint
{ "fill-color": "#0000ff", "fill-opacity": 0.8 }
```

**Expression wrapping**: Waymark wraps each resolved static paint property with a `["coalesce", ...]` expression. The `["get", ...]` call reads from the feature's `properties.waymarkPaint` object — it extracts the specific paint key (e.g. `"line-color"`) from within that nested object.

```js
// How the expression reads waymarkPaint:
["get", "line-color", ["get", "waymarkPaint", ["properties"]]];
//         ↑ key            ↑ source object       ↑ from feature properties
```

### Colour pool (absolute lowest fallback)

When no paint is configured at any level, `FAMILY_TYPES` provides non-colour defaults (`line-width`, `circle-radius`, `fill-opacity`) and the colour pool provides the family colour keys (`line-color`, `circle-color`, `fill-color`).

The pool is an array of 20 bright, distinct colours. Colour assignment is deterministic by data layer index:

```js
const colour = COLOUR_POOL[layerIndex % COLOUR_POOL.length];
```

This means:

- **Layer 0** gets `COLOUR_POOL[0]`, **layer 1** gets `COLOUR_POOL[1]`, etc.
- Same layer index always gets the same colour (stable across style reloads).
- All geometry families within a single data layer share the same pool colour.

The pool colours are deliberately bright, serving as a visual indicator that no explicit paint was configured. Once any higher level provides a colour, it overrides the pool.

```js
const COLOUR_POOL = [
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#42d4f4",
  "#f032e6",
  "#bfef45",
  "#fabed4",
  "#469990",
  "#dcbeff",
  "#9a6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#a9a9a9",
];
```

`FAMILY_TYPES` drops its hardcoded colour values and retains only the non-colour structural defaults:

```js
const FAMILY_TYPES = {
  point: {
    geometryTypes: new Set(["Point", "MultiPoint"]),
    layerType: "circle",
    paint: { "circle-radius": 5 },
  },
  line: {
    geometryTypes: new Set(["LineString", "MultiLineString"]),
    layerType: "line",
    paint: { "line-width": 3 },
  },
  polygon: {
    geometryTypes: new Set(["Polygon", "MultiPolygon"]),
    layerType: "fill",
    paint: { "fill-opacity": 0.35 },
  },
};

const FAMILY_COLOUR_KEYS = {
  point: "circle-color",
  line: "line-color",
  polygon: "fill-color",
};
```

The resolved paint for a family is computed by `resolvePaint()`:

```js
/**
 * Resolve paint properties for a single (family, sublayer) pair.
 *
 * @param {'point'|'line'|'polygon'} family
 * @param {number} layerIndex — data layer index for colour pool selection
 * @param {object|null} instancePaint — from config.paint (family-keyed, or null)
 * @param {object|null} layerPaint — from data.layers[].paint (family-keyed, or null)
 * @param {object|null} typePaint — pre-scoped to family by caller (flat paint props, or null)
 * @returns {object} — fully resolved MapLibre paint properties
 */
function resolvePaint(
  family,
  layerIndex,
  instancePaint,
  layerPaint,
  typePaint,
) {
  const paint = {
    // 1. Start with FAMILY_TYPES non-colour defaults (width, radius, opacity)
    ...FAMILY_TYPES[family].paint,
    // 2. Assign colour from pool by layer index
    [FAMILY_COLOUR_KEYS[family]]: COLOUR_POOL[layerIndex % COLOUR_POOL.length],
    // 3. Merge in config.paint (instance-wide overrides, scoped to family)
    ...(instancePaint?.[family] || {}),
  };

  if (typePaint) {
    // 4a. Typed sublayer: typePaint is already family-scoped by caller
    Object.assign(paint, typePaint);
  } else {
    // 4b. Untyped sublayer: layerPaint is family-keyed — scope to current family
    Object.assign(paint, layerPaint?.[family] || {});
  }

  return paint;
}
```

Usage:

```js
// Untyped fallback sublayer — instancePaint + layerPaint
resolvePaint(family, layerIndex, instancePaint, layerPaint, null);

// Typed sublayer — instancePaint + typePaint (layerPaint ignored)
resolvePaint(family, layerIndex, instancePaint, null, typePaint);
```

The order guarantees every level can override any property from the level below, including the pool colour. Feature-level `waymarkPaint` is handled separately via MapLibre expressions at mount time (see [Feature-level waymarkPaint](#feature-level-waymarkpaint)).

---

## Types system

### Definition

Types are defined instance-wide in `config.types` — a first-class config section alongside `config.map` and `config.ui`.

```js
{
  config: {
    types: {
      route: { title: "Route", paint: { line: { ... } } },
      danger: { title: "Danger", paint: { line: { ... } } },
      poi: { title: "Point of Interest", paint: { point: { ... } } }
    },
    map: { ... },
    ui: { ... }
  }
}
```

### typeKey

The `typeKey` is the programmatic identifier for a type. It is used in multiple places across the system:

| Context                  | Usage                                                       |
| ------------------------ | ----------------------------------------------------------- |
| `config.types`           | Object key                                                  |
| `properties.waymarkType` | Feature property value (must match a key in `config.types`) |
| Sublayer ID              | `waymark-...-{family}-type-{typeKey}`                       |
| MapLibre filter          | `["==", ["get", "waymarkType"], typeKey]`                   |
| `state.types`            | Object key for visibility delta                             |
| Public API               | `instance.types.setVisibility(typeKey, bool)`               |

**Constraints**:

- Minimum 1 character, maximum 64 characters
- Allowed characters: lowercase `a-z`, digits `0-9`, and hyphens `-`
- Must not start or end with a hyphen
- Case-sensitive — always use the exact key as defined
- Must be unique across all types in `config.types`

```js
// Valid keys
"route"; // simple
"danger-zone"; // hyphenated
"type-2"; // mixed alpha-numeric
"a"; // minimum
"abcdefghijklmnopqrstuvwxyz-0123456789-abcdefghijklmno"; // 64 chars

// Invalid keys
""; // empty
"Route"; // uppercase not allowed
"danger_zone"; // underscore not allowed
"danger zone"; // space not allowed
"-leading"; // leading hyphen
"trailing-"; // trailing hyphen
"-only-"; // both
```

### typeKey vs title

|            | typeKey                           | title                       |
| ---------- | --------------------------------- | --------------------------- |
| Purpose    | Programmatic identifier (slug)    | Human-readable label        |
| Used in    | Filters, sublayer IDs, state, API | UI panels, legends (future) |
| Required   | Yes (as config key)               | No                          |
| Validation | Slug format (enforced)            | Free text (unvalidated)     |

When `title` is omitted and a type is displayed in UI, the `typeKey` is used as the display fallback.

### Helpers

```js
// src/utils/typeUtils.js

/**
 * Validate a type key against slug constraints.
 * Returns `true` if valid, `false` otherwise.
 */
function isValidTypeKey(key) {
  return (
    typeof key === "string" &&
    key.length >= 1 &&
    key.length <= 64 &&
    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)
  );
}

/**
 * Sanitise a string for use in a type sublayer ID.
 * This is a belt-and-braces safety transform for sublayer ID generation,
 * even though type keys are validated at config time.
 */
function sanitiseTypeKey(key) {
  return String(key).replace(/[^a-zA-Z0-9_-]/g, "-");
}
```

> [!WARNING]
> `isValidTypeKey` is called during config normalisation (Slice 1). Invalid type keys cause normalisation to **throw**, matching existing Waymark behaviour for malformed input (e.g. unknown layer keys, invalid GeoJSON). There is no silent skip — if a type key is invalid, `createInstance(...)` fails.

Because type keys are validated at config time, sublayer ID builders can safely use `typeKey` directly without sanitisation in normal operation.

`sanitiseTypeKey` is a safety net for programmatic type keys that might bypass config validation (e.g. future runtime API additions). It replaces any non-alphanumeric/non-hyphen/non-underscore character with a hyphen.

### Feature association

Features reference their type via `properties.waymarkType`:

```js
{
  type: "Feature",
  properties: {
    waymarkType: "route",
    name: "A1 Highway"
  },
  geometry: {
    type: "LineString",
    coordinates: [[...], [...]]
  }
}
```

The value must match a key in `config.types`. Features with a `waymarkType` that doesn't match any defined type are treated as untyped (rendered in the fallback sublayer).

### Per-type visibility

Types are visible by default. Visibility can be toggled at runtime:

```js
// Set visibility
instance.types.setVisibility("route", false);

// Query visibility
instance.types.getVisibility("route"); // false

// Get all types
instance.types.getAll();

// Reset all types to visible
instance.types.resetVisibility();
```

Type visibility state is serialised as a runtime delta in `state.types`:

```js
toJSON().state.types: {
  route: { visible: false }
}
```

When a type is hidden, its sublayers are set to `visibility: none` via `map.setLayoutProperty(...)`. Only changed visibility is serialised (omitted when true).

**Style reload persistence**: After `style.load` fires (e.g. vector basemap switch), the mount handler re-creates all GeoJSON source/sublayers. After mount, the module must replay any non-default type visibility by calling `map.setLayoutProperty(typeLayerId, 'visibility', 'none')` for each type where `state.types[typeKey].visible === false`.

**Runtime state wiring**: Type visibility is tracked in the instance state module (`createInstanceState`). The state owns the authoritative `types` map of `{ typeKey: { visible: boolean } }`. Commands flow:

1. `instance.types.setVisibility(key, bool)` → calls `runtimeState.dispatch('types.visibility.set', { typeKey, visible })`
2. State module updates its internal map, emits `waymark:state.types.changed` + `waymark:state.changed`
3. GeoJSON module (or a visibility sync adapter) subscribes to state events and calls `map.setLayoutProperty(...)` on the affected sublayers
4. `toJSON()` reads from runtime state to produce `state.types` delta

> [!NOTE]
> Type visibility is initial-implementation scope. UI controls for type toggling come later, but the API and sublayer plumbing are part of this build.

---

## Sublayer naming

| Purpose          | Pattern                                                      |
| ---------------- | ------------------------------------------------------------ |
| Untyped fallback | `waymark-{id}-geojson-layer-{index}-{family}`                |
| Typed sublayer   | `waymark-{id}-geojson-layer-{index}-{family}-type-{typeKey}` |

The untyped fallback uses the existing naming so adding types doesn't break existing sublayer references. Each typed sublayer appends `-type-{typeKey}` for clean identification.

## Sublayer ordering within a data layer

Sublayer order (top to bottom, highest to lowest visual):

```
... (previous data layer sublayers)

waymark-...-{family}-type-{typeA}   ← type sublayers (stacked in config order)
waymark-...-{family}-type-{typeB}
waymark-...-{family}                ← untyped fallback (bottom of family group)

... (family groups repeat: point, line, polygon)
```

Family ordering stays as `point → line → polygon` (existing convention). Within a family, typed sublayers stack above the untyped fallback so typed features render on top.

## Render plan evolution

Current `createRenderPlan(data, baseLayerId)` returns simple per-family entries:

```js
{
  (family, layerId, type, paint);
}
```

The new plan adds type awareness. The data structure per render entry becomes:

```js
{
  family: "line",
  layerId: "waymark-...-line" | "waymark-...-line-type-route",
  type: "line",           // MapLibre layer type
  paint: { ... },         // resolved paint for this sublayer
  filter: null | object,  // MapLibre filter expression or null
  hasWaymarkPaint: false, // whether any matching feature has waymarkPaint
}
```

`createRenderPlan(data, baseLayerId, layerIndex, types, instancePaint, layerPaint)` evolves to consider types:

- **No types defined (`types` is empty or absent)**: Render plan stays identical to today. Single sublayer per family, no filters. Feature `waymarkType` is ignored at the render level (it's just another property on the GeoJSON).

- **Types defined**: Two sublayer groups per family:
  - **Untyped fallback**: `filter: ["!", ["has", "waymarkType"]]`. Paint resolved from `FAMILY_TYPES → pool → instancePaint → layerPaint`.
  - **Per-type sublayer**: `filter: ["==", ["get", "waymarkType"], typeKey]`. One sublayer per (family, type) pair where the type defines paint for that family. Paint resolved from `FAMILY_TYPES → pool → instancePaint → typePaint`.

```js
function createRenderPlan(data, baseLayerId, layerIndex, types, instancePaint, layerPaint) {
  const discoveredFamilies = collectGeometryFamilies(data);
  const renderFamilies = /* ordered family list */;
  const hasTypes = Object.keys(types || {}).length > 0;

  if (!hasTypes) {
    // Original behaviour — no type awareness needed
    return renderFamilies.map(family => ({
      family, layerId: `${baseLayerId}-${family}`,
      type: FAMILY_TYPES[family].layerType,
      paint: resolvePaint(family, layerIndex, instancePaint, layerPaint),
      filter: null,
      hasWaymarkPaint: hasFeaturesWithWaymarkPaint(data, null),
    }));
  }

  // Types defined — untyped fallback + per-type sublayers
  const entries = [];

  for (const family of renderFamilies) {
    // Untyped fallback
    entries.push({
      family, layerId: `${baseLayerId}-${family}`,
      type: FAMILY_TYPES[family].layerType,
      paint: resolvePaint(family, layerIndex, instancePaint, layerPaint),
      filter: ["!", ["has", "waymarkType"]],
      hasWaymarkPaint: hasFeaturesWithWaymarkPaint(data, ["!", ["has", "waymarkType"]]),
    });

    // Per-type sublayers (in config.types key order)
    for (const [typeKey, typeDef] of Object.entries(types)) {
      const typePaint = typeDef.paint?.[family];
      if (!typePaint) continue; // type doesn't cover this family

      entries.push({
        family,
        layerId: `${baseLayerId}-${family}-type-${typeKey}`,
        type: FAMILY_TYPES[family].layerType,
        paint: resolvePaint(family, layerIndex, instancePaint, null, typePaint),
        filter: ["==", ["get", "waymarkType"], typeKey],
        hasWaymarkPaint: hasFeaturesWithWaymarkPaint(data, ["==", ["get", "waymarkType"], typeKey]),
      });
    }
  }

  return entries;
}
```

## Feature-level waymarkPaint expression detection

To determine if a sublayer needs expressions, scan features that will match the sublayer's filter:

```js
function hasFeaturesWithWaymarkPaint(geoJSON, filter) {
  // Walk features, apply the sublayer filter, check for waymarkPaint
}
```

This is called during render-plan assembly. The result is stored on each render-plan entry:

```js
{ family, layerId, type, paint, filter, hasWaymarkPaint: true }
```

When `hasWaymarkPaint` is true, each paint property value is wrapped in the `["coalesce", ...]` expression at mount time.

For large GeoJSON payloads this scan is O(n) once during mount. The scan is across GeoJSON data in memory, not the DOM/rendering.

---

## InstanceDocument shape changes

### config.types addition (first-class, alongside config.map / config.ui)

```js
{
  config: {
    types?: Record<string, {
      title?: string,
      paint: {
        point?: object,
        line?: object,
        polygon?: object
      }
    }>,
    map: { ... },
    ui: { ... }
  }
}
```

### config.paint addition

```js
{
  config: {
    paint?: {
      point?: object,
      line?: object,
      polygon?: object
    }
  }
}
```

### data.layers[].paint addition

```js
{
  data: {
    layers: [
      {
        type: "geojson",
        paint?: {
          point?: object,
          line?: object,
          polygon?: object
        },
        data: { ... }
      }
    ]
  }
}
```

### state.types addition (alongside state.map / state.ui)

```js
{
  state: {
    types?: Record<string, {
      visible?: boolean      // omitted when true
    }>
  }
}
```

---

## Public API additions

```js
const instance = createInstance({
  config: {
    id: "map",
    types: {
      route: { title: "Route", paint: { line: { "line-color": "#22c55e" } } }
    }
  },
  data: {
    layers: [
      {
        paint: { line: { "line-color": "#3b82f6" } },
        data: { type: "FeatureCollection", features: [...] }
      }
    ]
  }
});

// Type API
instance.types.setVisibility("route", false);   // hide route features
instance.types.getVisibility("route");           // false
instance.types.getAll();
// → { route: { title: "Route", visible: false } }

instance.types.resetVisibility();  // all types back to visible
```

**`setVisibility(typeKey, visible)`**: Validates that `typeKey` exists in `config.types`. No-ops for unknown type keys (no throw, no state change). Visibility changes persist through style reloads — re-applied via `style.load` listener.

**`setVisibility(typeKey, visible) → { previous, next }`**: Returns a delta object so callers can observe what changed. Emits `waymark:state.changed` + `waymark:state.types.changed` on real mutations; no-ops emit nothing.

**`getAll()`**: Returns `Record<typeKey, { title: string, visible: boolean }>` — all defined types with current visibility. Title comes from the type definition.

**`resetVisibility()`**: Sets all types to `visible: true`, clearing `state.types` entirely (omitted from `toJSON()`). Emits state events if any types were previously hidden.

---

## `waymark:data.layer.mounted` event change

The mounted event payload adds a `mountedTypes` field:

```js
{
  id: string,
  layerIndex: number,
  mountedFamilies: Array<"point" | "line" | "polygon">,
  mountedLayerIds: string[],
  mountedTypes: string[]   // type keys mounted for this layer (new)
}
```

---

## Out of scope (v1)

- UI controls for type visibility toggling (buttons/panels)
- Drag-to-reorder types
- Runtime addition/removal of types
- Per-type z-ordering beyond the stacking order described above
- Type-specific legend generation
- Auto-fallback for features whose type doesn't cover their geometry family (documented as intentional: invisible)
- Type-level `waymarkPaint` override merging with feature-level `waymarkPaint` (feature-level always wins via coalesce)

---

## Implementation plan (tracer-bullet slices)

### Slice 1: Document model changes

**Files**: `src/document/instanceDocument.js`, `src/config/defaults.js`, `src/utils/typeUtils.js` (new)

- Create `src/utils/typeUtils.js`:
  - `isValidTypeKey(key)` — validates slug format (`/^[a-z0-9]+(-[a-z0-9]+)*$/`, len 1-64)
  - `sanitiseTypeKey(key)` — replaces non-alphanumeric/hyphen chars with `-` (safety net)
- Add `config.paint` to config normalisation/defaults (optional, family-keyed per `point`/`line`/`polygon`)
- Add `paint` to data layer normalisation (allow `paint` key alongside `type`/`data`)
- Add `types` to config normalisation/defaults
  - Validate each type key with `isValidTypeKey` — reject (throw) on invalid keys
  - Validate type structure: `title` (optional string), `paint` (required object with valid family keys)
- Add types visibility to state normalisation
- Update `toJSON()` serialisation to include new fields

### Slice 2: Render plan evolution

**Files**: `src/geojson/createGeoJSONModule.js`

- Define `COLOUR_POOL` array and `FAMILY_COLOUR_KEYS` mapping; strip colours from `FAMILY_TYPES`
- Refactor `createRenderPlan()` to accept `types`, `instancePaint`, and `layerIndex`
- Colour is resolved as `COLOUR_POOL[layerIndex % COLOUR_POOL.length]`
- Apply paint merge (pool colour + FAMILY_TYPES → instance → layer/type) per render entry
- Add `collectTypeFamilies()` — discover what types and families exist across the GeoJSON
- Generate per-type render entries with filters
- Add `hasWaymarkPaint` detection with GeoJSON feature scan
- Wrap paint in expressions when `hasWaymarkPaint` is true

### Slice 3: Sublayer mounting

**Files**: `src/geojson/createGeoJSONModule.js`, `src/runtime/createInstanceCore.js`

- Update `createGeoJSONModule()` signature:
  - Add `options.types: Record<string, { title?: string, paint: object }>` — type definitions from `config.types`
  - Add `options.instancePaint: { point?, line?, polygon? }` — sourced from `config.paint`
  - Add `options.typeVisibility: Record<string, { visible: boolean }>` — initial type visibility state
  - Remove the need for consumers to manually compute paint/colour assignments
- Per-data-layer: `layerRecord` stores `layerPaint` from `data.layers[].paint`
- `createRenderPlan()` receives all paint/type inputs and resolves paint per sublayer
- Mount per-type sublayers alongside existing family sublayers
- Maintain correct insertion order (typed above untyped per family)
- After mount, replay type visibility: for each type with `visible === false`, call `map.setLayoutProperty(...)` on matching sublayers
- Subscribe to runtime state `types.visibility.set` events to reactively toggle sublayer visibility
- Update `onLayerMounted` callback with `mountedTypes`

### Slice 4: Public type API

**Files**: `src/geojson/createGeoJSONModule.js`, `src/runtime/createInstanceCore.js`

- Add `instance.types` methods to the public API
- `setVisibility(typeKey, visible)` → dispatch state command → update sublayer layout property
- `getVisibility(typeKey)` → read from state
- `getAll()` → return defined types with current visibility
- `resetVisibility()` → set all to visible
- Wire type visibility state into instance state module

### Slice 5: Instance state & serialisation

**Files**: `src/runtime/createInstanceCore.js`, `src/runtime/state/createInstanceState.js`, `src/document/instanceDocument.js`

- Add `types.visibility.set` command handler to instance state module (`createInstanceState`)
  - Command accepts `{ typeKey, visible }`, updates internal `types` map
  - Emits `waymark:state.types.changed` + `waymark:state.changed` on real mutation
  - No-ops emit nothing; unknown type keys no-op silently
- `toJSON()` reads `state.types` from runtime state — serialises only non-default visibility (omitted when `visible: true`)
- `config.types` stays in config baseline, never mutated
- Handle type visibility on style reload: after GeoJSON layers re-mount, replay visibility state for all hidden types

### Slice 6: Event & docs updates

**Files**: `docs/1.api.md`, `docs/6.data.md`, `docs/7.types.md` (new)

- Update API doc with new config/data shapes
- Update data doc with paint and waymarkPaint details
- Create `docs/7.types.md` documenting the types system
- Update `docs/README.md` index
- Add `waymarkPaint` and type-related entries to doc-test-contract if needed
