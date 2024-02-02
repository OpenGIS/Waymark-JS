# Map Instances

Maps can either be read-only using the Viewer, or editable using the Editor. Both the Viewer and Editor extend the `Waymark_Map` class.

Multiple maps can be used on a single page, each with their own configuration. A single Map is known as an Instance and is created using the `Waymark_Map_Factory` which is attached to the `window` object.

For example, to create a new (read-only) Instance:

```javascript
// This Waymark_Map_Viewer Instance extends Waymark_Map class
const waymark_viewer = window.Waymark_Map_Factory.viewer();
```

## Configuration

Maps are configured using a JavaScript object. The configuration object is passed to the `init` method of the Map Instance.

For example here is a basic configuration, which sets the height of the map to 800 pixels and enables the Elevation profile:

```javascript
const waymark_config = {
  map_options: {
    map_height: 800,
  },
  viewer_options: {
    show_elevation: "1",
  },
};
```

### Example Configuration

```javascript
const user_config = {
  map_options: {
    map_height: "800",
    tile_layers: [
      {
        layer_name: "OpenStreetMap",
        layer_url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?r=1",
        layer_attribution:
          '@copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        layer_max_zoom: "18",
      },
    ],

    marker_types: [
      {
        marker_title: "Beer",
        marker_shape: "marker",
        marker_size: "large",
        icon_type: "icon",
        marker_icon: "ion-beer",
        marker_colour: "#fbfbfb",
        icon_colour: "#754423",
      },
    ],
    line_types: [
      {
        line_title: "Bike Path",
        line_colour: "#3cbc47",
        line_weight: "2",
        line_opacity: "0.85",
      },
    ],
  },
  viewer_options: {
    show_gallery: "1",
    show_filter: "1",
    show_cluster: "1",
    show_elevation: "1",
  },
};
```

The configuration object can be used to set the following options:

## Map Options

<!--

  $this->tabs['misc'] = array(
      'name' => esc_html__('Misc.', 'waymark'),
      'description' => '',
      'sections' => array(
        'map_options' => array(
          'title' => esc_html__('Map Options', 'waymark'),
          'description' => esc_html__('Use these options to change how Maps are displayed.', 'waymark'),
          'help' => array(
            'url' => esc_attr(Waymark_Helper::site_url('docs-cat/examples')),
            'text' => esc_attr__('See Examples &raquo;', 'waymark'),
          ),
          'fields' => array(
            'map_default_latlng' => array(
              'name' => 'map_default_latlng',
              'id' => 'map_default_latlng',
              'type' => 'text',
              'class' => '',
              'title' => esc_html__('Default Centre', 'waymark'),
              'default' => Waymark_Config::get_setting('misc', 'map_options', 'map_default_latlng'),
              'tip' => esc_attr__('Waymark centres the Map automatically when displaying data. These coordinates (Latitude,Longitude) will be used when there is no data available.', 'waymark'),
              'input_processing' => array(
                'preg_replace("/[^0-9.,-]+/", "", $param_value);',
              ),
              'output_processing' => array(
                sprintf('(! empty($param_value)) ? $param_value : "%s";', Waymark_Config::get_default('misc', 'map_options', 'map_default_latlng')),
              ),
            ),
            'map_height' => array(
              'name' => 'map_height',
              'id' => 'map_height',
              'type' => 'text',
              'class' => 'waymark-short-input waymark-align-top',
              'title' => esc_html__('Map Height', 'waymark'),
              'default' => Waymark_Config::get_setting('misc', 'map_options', 'map_height'),
              'append' => '<br />' . sprintf(esc_attr__('Or set in Shortcode: %s', 'waymark'), '<code>[' . Waymark_Config::get_item('shortcode') . ' map_height=&quot;' . Waymark_Config::get_setting('misc', 'map_options', 'map_height') . '&quot; map_width=&quot;320&quot;]</code>'),
              'tip' => sprintf(esc_attr__('Specify the desired height of the Map (in pixels). Pro Tip! This will affect all Maps, but you can change the height (and width) of an individual Map through the Shortcode: %s', 'waymark'), '[' . Waymark_Config::get_item('shortcode') . ' map_id=&quot;1234&quot; map_height=&quot;' . Waymark_Config::get_setting('misc', 'map_options', 'map_height') . '&quot;]'),
              'input_processing' => array(
                'preg_replace("/[^0-9]/", "", $param_value);',
              ),
              'output_processing' => array(
                sprintf('(! empty($param_value)) ? $param_value : %d;', Waymark_Config::get_default('misc', 'map_options', 'map_height')),
              ),
            ),
            'map_default_zoom' => array(
              'name' => 'map_default_zoom',
              'id' => 'map_default_zoom',
              'type' => 'text',
              'class' => 'waymark-short-input',
              'title' => esc_html__('Default Zoom', 'waymark'),
              'default' => Waymark_Config::get_setting('misc', 'map_options', 'map_default_zoom'),
              'tip' => esc_attr__('Waymark zooms the Map automatically when displaying data. This zoom level (0-18) will be used when there is no data available.', 'waymark'),
              'input_processing' => array(
                'preg_replace("/[^0-9]/", "", $param_value);',
              ),
              'output_processing' => array(
                sprintf('(! empty($param_value)) ? $param_value : "%d";', Waymark_Config::get_default('misc', 'map_options', 'map_default_zoom')),
              ),
            ),
            'show_gallery' => array(
              'name' => 'show_gallery',
              'id' => 'show_gallery',
              'type' => 'boolean',
              'title' => esc_html__('Image Gallery', 'waymark'),
              'default' => Waymark_Config::get_setting('misc', 'map_options', 'show_gallery'),
              'tip' => sprintf(esc_attr__('Whether to display an image gallery for Markers that have images associated with them. Pro Tip! This will affect all Maps, but you can choose to show/hide the gallery of an individual Map through the shortcode: %s', 'waymark'), '[' . Waymark_Config::get_item('shortcode') . ' show_gallery=&quot;1&quot;]'),
              'options' => array(
                '1' => esc_html__('Show', 'waymark'),
                '0' => esc_html__('Hide', 'waymark'),
              ),
            ),
            'show_filter' => array(
              'name' => 'show_filter',
              'id' => 'show_filter',
              'type' => 'boolean',
              'title' => esc_html__('Overlay Filter', 'waymark'),
              'default' => Waymark_Config::get_setting('misc', 'map_options', 'show_filter'),
              'tip' => sprintf(esc_attr__('Allow the user to filter which Markers, Lines and Shapes are currently visible on the Map. Pro Tip! This will affect all Maps, but you can choose to show/hide the filter for individual Maps through the shortcode: %s', 'waymark'), '[' . Waymark_Config::get_item('shortcode') . ' show_filter=&quot;1&quot;]'),
              'options' => array(
                '1' => esc_html__('Show', 'waymark'),
                '0' => esc_html__('Hide', 'waymark'),
              ),
            ),
            'allow_export' => array(
              'name' => 'allow_export',
              'id' => 'allow_export',
              'type' => 'boolean',
              'title' => esc_html__('Public Export', 'waymark'),
              'default' => Waymark_Config::get_setting('misc', 'map_options', 'allow_export'),
              'tip' => sprintf(esc_attr__('Offer visitors the ability to Download all Collection/Map Overlays in the Shortcode Header and on the Map Details page. GeoJSON, GPX and KML formats supported.', 'waymark')),
            ),
            'show_scale' => array(
              'name' => 'show_scale',
              'id' => 'show_scale',
              'type' => 'boolean',
              'title' => esc_html__('Show Scale', 'waymark'),
              'default' => Waymark_Config::get_setting('misc', 'map_options', 'show_scale'),
              'tip' => sprintf(esc_attr__('Show a distance scale (km and miles) on the Map.', 'waymark')),
            ),
          ),
        ),


-->

| Option             | Values  | Description                                                                      | Example                    |
| ------------------ | ------- | -------------------------------------------------------------------------------- | -------------------------- |
| `map_div_id`       | string  | The ID of the HTML element to contain the Map.                                   | "map"                      |
| `map_height`       | number  | Specify the desired height of the Map (in pixels).                               | "420"                      |
| `map_width`        | number  | Specify the desired width of the Map (in pixels).                                | "800"                      |
| `map_init_zoom`    | number  | The initial zoom level of the Map.                                               | "10"                       |
| `map_init_latlng`  | array   | The initial centre coordinates of the Map (Latitude,Longitude).                  | `[51.5074, 0.1278]`        |
| `map_init_basemap` | string  | The initial basemap of the Map. Use the exact title, including spaces.           | "Satellite Imagery"        |
| `map_max_zoom`     | number  | The maximum zoom level of the Map.                                               | "12"                       |
| `debug_mode`       | boolean | Whether to enable debug mode. This will output debug information to the console. | "1"                        |
| `show_scale`       | boolean | Whether to show the scale on the Map.                                            | "1"                        |
| `tile_layers`      | array   | The basemaps available to the Map.                                               |                            |
| `marker_types`     | array   | An array of Type objects representing Markers available to the Map.              | [See Below](#marker-types) |
| `line_types`       | array   | An array of Type objects representing Lines available to the Map.                | [See Below](#line-types)   |
| `shape_types`      | array   | An array of Type objects representing Shapes available to the Map.               | [See Below](#shape-types)  |

### Basemaps

Basemaps are added to the Map using the `tile_layers` array, each Basemap is an object with the following options:

| Option              | Values | Description                                                                                               | Example                                                                                   |
| ------------------- | ------ | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `layer_name`        | string | The Name will appear in a dropdown list shown by the Map when multiple Basemaps have been entered.        | "OpenStreetMap"                                                                           |
| `layer_url`         | string | Many mapping services support the Slippy Map format. Waymark requires URLs that contain {z}, {x} and {y}. | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?r=1`                                  |
| `layer_attribution` | string | The attribution to be displayed on the Map.                                                               | `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors` |
| `layer_max_zoom`    | 1-18   | The maximum zoom level of the Basemap.                                                                    | 10                                                                                        |

Example:

```javascript
const user_config = {
  map_options: {
    tile_layers: [
      {
        layer_name: "OpenStreetMap",
        layer_url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?r=1",
        layer_attribution:
          '@copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        layer_max_zoom: "18",
      },
      {
        layer_name: "OpenTopoMap",
        layer_url: "https://{a|b|c}.tile.opentopomap.org/{z}/{x}/{y}.png",
        layer_attribution:
          '© <a href="https://openstreetmap.org/copyright">OSM</a>-Mitwirkende, SRTM | © <a href="http://opentopomap.org" data-moz-translations-id="285">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>',
        layer_max_zoom: "17",
      },
    ],
  },
};
```

### Types

Customise how Overlays are displayed on the Map. When you add an Overlay (a Marker, Line or Shape) to the Map you may want to style it in a certain way. In the case of Markers, you may want to use certain icons.

Types allow you set these styles once, using the `marker_types`, `line_types` and `shape_types` arrays. Once a type has been provided, an Overlay can be assigned to it using the `type` feature property.

We can create a new Marker Type called `pub` by adding it to the `marker_types` array like this:

```javascript
const config = {
  map_options: {
    marker_types: [
      {
        marker_title: "Pub",
        marker_shape: "marker",
        marker_size: "large",
        icon_type: "icon",
        marker_icon: "ion-beer",
        marker_colour: "#fbfbfb",
        icon_colour: "#754423",
      },
    ],
  },
};
```

When a Marker is added to the Map, it can be assigned the `pub` type by adding the `type` property to the GeoJSON Feature.

```geojson
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [
      -2.548828125,
      51.46769693762546
    ]
  },
  "properties": {
    "title": "Great place for a pint!",
    "type": "pub"
  }
}
```

#### Type Keys

When assigning a type to an Overlay, the `type` feature property must be the Key of the appropriate Type, which is generated from the Overlay `title`.

This is done by the `Waymark_Map.make_key()` method, which removes any non-alpha-numeric characters from the `title` and converts it to lowercase.

Waymark JS adds the Type Key to the Overlay container like this:

```html
<!-- "Beer" Marker with Font Icon       ***BEER*** -->
<div
  class="waymark-marker waymark-marker-beer waymark-marker-circle waymark-marker-small"
>
  <div class="waymark-marker-background" style="background:#70af00;"></div>
  <i
    style="color:#ffffff;"
    class="waymark-marker-icon waymark-icon-icon ion ion-beer"
  ></i>
</div>
```

You can use this to style specific Types in your CSS, for example:

```css
/* Adjust the "Beer" Marker Text Icon size */
.waymark-marker-beer .waymark-icon-text {
  font-size: 18px !important;
}
```

> [!TIP]
> The key for "A Much Longer Title" would be `amuchlongertitle`.

Use your browser’s inspector ([Firefox](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector/How_to/Open_the_Inspector) / [Chrome](https://developer.chrome.com/docs/devtools/open/)) to find Type keys.

#### Marker Types

Marker Types are added to the Map using the `marker_types` array, each Marker Type is an object with the following options:

| Option          | Values                          | Description                                                                                                                                                       | Example   |
| --------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `marker_title`  | string                          | What kind of Marker is this? E.g. "Photo", "Grocery Store", "Warning!".                                                                                           | "Pub"     |
| `marker_shape`  | `marker`, `circle`, `rectangle` | Which shape of Marker to use. Circles and Squares are centered at the specified location, Markers point down to that location.                                    | "marker"  |
| `marker_size`   | `small`, `medium`, `large`      | Which size of Marker to use.                                                                                                                                      | "large"   |
| `marker_colour` | CSS Color                       | The Marker background colour, provided as a CSS colour (e.g. "white", "#ffba00", rgb(255, 186, 0)).                                                               | "#da3d20" |
| `marker_icon`   | string                          | Either the **Text** (including [Emojis](https://emojifinder.com/)!), **HTML**, or **Icon Name** from Ionicons or Font Awesome, e.g. "ion-camera", or "fa-camera". | "🍺"      |
| `icon_type`     | `icon`, `text`, `html`          | Font Icons are available from Font Awesome and Ionic Icons. Simple Text or Emojis are supported, as well as custom HTML.                                          | "icon"    |
| `icon_colour`   | string                          | The colour of the icon.                                                                                                                                           | "#ffba00" |

Example:

```javascript
const user_config = {
  map_options: {
    marker_types: [
      {
        marker_title: "Pub",
        marker_shape: "marker",
        marker_size: "large",
        icon_type: "icon",
        marker_icon: "ion-beer",
        marker_colour: "#fbfbfb",
        icon_colour: "#754423",
      },
    ],
  },
};
```

#### Line Types

Line Types are added to the Map using the `line_types` array, each Line Type is an object with the following options:

| Option         | Values     | Description                                                              | Example     |
| -------------- | ---------- | ------------------------------------------------------------------------ | ----------- |
| `line_title`   | string     | What kind of Line is this? E.g. "Bike Path", "Walking Only", "Dark Red". | "Bike Path" |
| `line_colour`  | CSS Colour | The colour of the Line.                                                  | "#3cbc47"   |
| `line_weight`  | number     | The width of the Line, in pixels.                                        | "2"         |
| `line_opacity` | number     | The opacity of the Line, between 0.0 and 1.0.                            | "0.85"      |

Example:

```javascript
const user_config = {
  map_options: {
    line_types: [
      {
        line_title: "Bike Path",
        line_colour: "#3cbc47",
        line_weight: "2",
        line_opacity: "0.85",
      },
    ],
  },
};
```

#### Shape Types

Shape Types are added to the Map using the `shape_types` array, each Shape Type is an object with the following options:

| Option         | Values     | Description                                                       | Example   |
| -------------- | ---------- | ----------------------------------------------------------------- | --------- |
| `shape_title`  | string     | What kind of Shape is this? E.g. "Park", "Danger!", "Light Blue". | "Park"    |
| `shape_colour` | CSS Colour | The colour of the Shape.                                          | "#81d742" |
| `fill_opacity` | number     | The opacity of the inside of the Shape, between 0.0 and 1.0.      | "0.5"     |

Example:

```javascript
const user_config = {
  map_options: {
    shape_types: [
      {
        shape_title: "Park",
        shape_colour: "#81d742",
        fill_opacity: "0.5",
      },
    ],
  },
};
```
