# Configuration

Waymark JS can be configured using the `waymark_user_config` variable. This variable should be defined before the Waymark JS script is loaded.

## Configuration Options

### Basemaps

Tile layers are the Basemap layers that are displayed on the map. These are defined in the `tile_layers` array. The default Basemap uses [OpenStreetMap](https://www.openstreetmap.org/) tiles.

````javascript

```javascript
const config = {
  tile_layers: [
    {
      layer_name: "OpenStreetMap",
      layer_url:
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      layer_attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      layer_max_zoom: "19",
    },
  ],
};
````

#### Tile Layer Options

| Option              | Description                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `layer_name`        | The name of the tile layer. This is displayed in the Basemap selector.                       |
| `layer_url`         | The URL of the tile layer.                                                                   |
| `layer_attribution` | The attribution for the tile layer. This is displayed in the bottom right corner of the map. |
| `layer_max_zoom`    | The maximum zoom level for the tile layer.                                                   |

### Types

Each Overlay (Marker, Line or Shape) added to the Map has a Type. These are defined in the `marker_types`, `line_types` and `shape_types` arrays.

#### Marker Types

Markers are defined in the `marker_types` array. The default Marker is the Photo Marker.

```javascript
const config = {
  marker_types: [
    {
      marker_title: "Photo",
      marker_shape: "marker",
      marker_size: "medium",
      icon_type: "icon",
      marker_icon: "ion-camera",
      marker_colour: "#70af00",
      icon_colour: "#ffffff",
      marker_display: "1",
      marker_submission: "1",
    },
  ],
};
```

##### Marker Type Options

| Option              | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `marker_title`      | The name of the Marker type. This is displayed in the Marker selector. |
| `marker_shape`      | The shape of the Marker.                                               |
| `marker_size`       | The size of the Marker.                                                |
| `icon_type`         | The type of icon used for the Marker.                                  |
| `marker_icon`       | The icon used for the Marker.                                          |
| `marker_colour`     | The colour of the Marker.                                              |
| `icon_colour`       | The colour of the icon used for the Marker.                            |
| `marker_display`    | Whether the Marker is displayed in the Marker selector.                |
| `marker_submission` | Whether the Marker is available for submission.                        |

### Lines

Lines are defined in the `line_types` array. The default Line is the Green Line.

```javascript
const config = {
  line_types: [
    {
      line_title: "Green",
      line_colour: "#30d100",
      line_weight: "3",
      line_opacity: "0.7",
      line_display: "1",
      line_submission: "1",
    },
  ],
};
```

#### Line Type Options

| Option            | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `line_title`      | The name of the Line type. This is displayed in the Line selector. |
| `line_colour`     | The colour of the Line.                                            |
| `line_weight`     | The weight of the Line.                                            |
| `line_opacity`    | The opacity of the Line.                                           |
| `line_display`    | Whether the Line is displayed in the Line selector.                |
| `line_submission` | Whether the Line is available for submission.                      |

### Shapes

Shapes are defined in the `shape_types` array. The default Shape is the Red Shape.

```javascript
const config = {
  shape_types: [
    {
      shape_title: "Red",
      shape_colour: "#d84848",
      fill_opacity: "0.5",
      shape_display: "1",
      shape_submission: "1",
    },
  ],
};
```

#### Shape Type Options

| Option             | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| `shape_title`      | The name of the Shape type. This is displayed in the Shape selector. |
| `shape_colour`     | The colour of the Shape.                                             |
| `fill_opacity`     | The opacity of the Shape.                                            |
| `shape_display`    | Whether the Shape is displayed in the Shape selector.                |
| `shape_submission` | Whether the Shape is available for submission.                       |

### Map Options

Map options are defined in the `map_options` object. The default options are shown below.

```javascript
const config = {
  map_options: { show_type_labels: "1", button_position: "topleft" },
};
```

#### Map Option Options

| Option             | Description                                                                  |
| ------------------ | ---------------------------------------------------------------------------- |
| `show_type_labels` | Whether the type labels are displayed in the Marker, Line and Shape editors. |
| `button_position`  | The position of the Map buttons.                                             |

### Editor Options

Editor options are defined in the `editor_options` object. The default options are shown below.

```javascript
const config = {
  editor_options: { confirm_delete: "0" },
};
```

#### Editor Option Options

| Option           | Description                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| `confirm_delete` | Whether a confirmation is required before deleting a Marker, Line or Shape. |

## Example Configuration

The example below shows a complete configuration.

```javascript
// TODO!
```

<!-- TODO -->
