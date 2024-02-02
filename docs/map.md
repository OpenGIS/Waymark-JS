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
				layer_name: "Open Street Map",
				layer_url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?r=1",
				layer_attribution:
					'\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				layer_max_zoom: "18",
			},

			// TODO - Update to use OpenTopoOpen

			{
				layer_name: "Cycle",
				layer_url:
					"https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=your_api_key",
				layer_attribution:
					'Data \u00a9 <a href="https://www.openstreetmap.org/copyright">OSM</a>',
				layer_max_zoom: "18",
			},
		],

		marker_types: [
			{
				marker_title: "Food",
				marker_shape: "marker",
				marker_size: "large",
				icon_type: "icon",
				marker_icon: "ion-pizza",
				marker_colour: "#da3d20",
				icon_colour: "#ffba00",
			},
			{
				marker_title: "Shelter",
				marker_shape: "marker",
				marker_size: "large",
				icon_type: "icon",
				marker_icon: "ion-home",
				marker_colour: "#72820d",
				icon_colour: "white",
			},
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
		show_gallery: "0",
		show_filter: "1",
		show_cluster: "0",
		show_elevation: false,
		cluster_radius: "40",
		cluster_threshold: "10",
		elevation_units: "metric",
		elevation_initial: "1",
		sleep_delay_seconds: "0",
		sleep_do_message: "0",
		sleep_wake_message: "Click to Interact with Map",
	},
	editor_options: { confirm_delete: "0" },
};
```

The configuration object can be used to set the following options:

## Map Options

<!-- Display table: option key, type, default, description -->

| Option           | Type    | Default | Description                                                                      |
| ---------------- | ------- | ------- | -------------------------------------------------------------------------------- |
| map_div_id       | string  |         | The ID of the HTML element to contain the Map.                                   |
| map_height       | number  | 400     | The height of the Map in pixels.                                                 |
| map_width        | number  |         | The width of the Map in pixels.                                                  |
| map_init_zoom    | number  |         | The initial zoom level of the Map.                                               |
| map_init_latlng  | array   |         | The initial latitude and longitude of the Map.                                   |
| map_init_basemap | string  |         | The initial basemap of the Map.                                                  |
| map_max_zoom     | number  |         | The maximum zoom level of the Map.                                               |
| debug_mode       | boolean | 0       | Whether to enable debug mode. This will output debug information to the console. |
| show_scale       | boolean | 0       | Whether to show the scale on the Map.                                            |
| tile_layers      | array   | []      | The basemaps available to the Map.                                               |
| marker_types     | array   | []      | The types of Markers available to the Map.                                       |
| line_types       | array   | []      | The types of Lines available to the Map.                                         |
| shape_types      | array   | []      | The types of Shapes available to the Map.                                        |

### Basemaps

Basemaps are added to the Map using the `tile_layers` array, each Basemap is an object with the following options:
-->

<!-- TODO: Improve Basemaps Table description based on Settings.php definitions -->

| Option            | Example                                                                                 | Description                                                                                                                              | Link                                                               |
| ----------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| layer_name        | Open Street Map                                                                         | The Name will appear in a dropdown list shown by the Map when multiple Basemaps have been entered.                                       |                                                                    |
| layer_url         | https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?r=1                                  | Many mapping services support the Slippy Map format. Waymark requires URLs that contain {z} (zoom level) and {x}/{y} (tile coordinates). | [Thunderforest](https://www.thunderforest.com/docs/map-tiles-api/) |
| layer_attribution | \u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | The attribution to be displayed on the Map.                                                                                              | [OpenStreetMap](https://www.openstreetmap.org/copyright)           |
| layer_max_zoom    | 18                                                                                      | The maximum zoom level of the Basemap.                                                                                                   | [OSM Wiki](https://wiki.openstreetmap.org/wiki/Zoom_levels)        |

### Types

Customise how Overlays are displayed on the Map. When you add an Overlay (a Marker, Line or Shape) to the Map you may want to style it in a certain way. In the case of Markers, you may want to use certain icons.

Types allow you set these styles once, using the `marker_types`, `line_types` and `shape_types` arrays. Once a type has been provided, an Overlay can be assigned to it using the `type` feature property.

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

In this example, the Marker has been assigned the `pub` type, which has been defined in the `marker_types` array.

#### Marker Types

Marker Types are added to the Map using the `marker_types` array, each Marker Type is an object with the following options:

<!--
$this->tabs['markers'] = array(
			'name' => esc_html__('Markers', 'waymark'),
			'description' => '',
			'sections' => array(
				'marker_types' => array(
					'repeatable' => true,
					'title' => esc_html__('Marker', 'waymark') . ' ' . esc_html__('Types', 'waymark'),
					'description' => '<span class="waymark-lead">' . __('Customise how Markers are displayed on the Map. Set these styles once, then select the appropriate Type when you add to the Map.', 'waymark') . '</span>',
					'footer' => '<small>' . __('<b>Pro Tip!</b> The first listed will be used as the default. Drag to re-order, remove all to restore defaults.', 'waymark') . '</small>',
					'help' => array(
						'url' => esc_attr(Waymark_Helper::site_url('docs/types')),
						'text' => esc_attr__('Type Docs &raquo;', 'waymark'),
					),
					'fields' => array(
						'marker_title' => array(
							'name' => 'marker_title',
							'id' => 'marker_title',
							'type' => 'text',
							'class' => 'waymark-uneditable',
							'title' => '<u>' . esc_html__('Marker', 'waymark') . '</u> ' . esc_html__('Label', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_title'),
							'tip' => esc_attr__('What kind of Marker is this? E.g. "Photo", "Grocery Store", "Warning!". Once saved, Marker labels can not be edited. The Marker Label is displayed in the Tooltip (when hovering over the Marker) and in the Info Window (once the Marker is clicked). Hide in Settings > Map > Misc. > Type Labels.', 'waymark'),
							'input_processing' => array(
								'(! empty($param_value)) ? $param_value : "' . esc_html__('Marker', 'waymark') . ' ' . substr(md5(rand(0, 999999)), 0, 5) . '";', //Fallback
							),
						),
						'marker_shape' => array(
							'name' => 'marker_shape',
							'id' => 'marker_shape',
							'type' => 'select',
							'class' => '',
							'title' => '<span class="waymark-invisible">' . esc_html__('Marker', 'waymark') . '</span> ' . esc_html__('Shape', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_shape'),
							'tip' => esc_attr__('Which shape of Marker to use. Circles and Squares are centered at the specified location, Markers point down to that location.', 'waymark'),
							'options' => array(
								'marker' => esc_html__('Marker', 'waymark'),
								'circle' => esc_html__('Circle', 'waymark'),
								'rectangle' => esc_html__('Square', 'waymark'),
							),
						),
						'marker_size' => array(
							'name' => 'marker_size',
							'id' => 'marker_size',
							'type' => 'select',
							'class' => '',
							'title' => '<span class="waymark-invisible">' . esc_html__('Marker', 'waymark') . '</span> ' . esc_html__('Size', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_size'),
							'tip' => esc_attr__('Which size of Marker to use.', 'waymark'),
							'options' => array(
								'small' => esc_html__('Small', 'waymark'),
								'medium' => esc_html__('Medium', 'waymark'),
								'large' => esc_html__('Large', 'waymark'),
							),
						),
						'marker_colour' => array(
							'name' => 'marker_colour',
							'id' => 'marker_colour',
							'type' => 'text',
							'class' => 'waymark-short-input',
							'title' => '<span class="waymark-invisible">' . esc_html__('Marker', 'waymark') . '</span> ' . esc_html__('Background', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_colour'),
							'tip' => esc_attr__('The Marker background colour. Click "Select Colour" to select.', 'waymark'),
							'input_processing' => array(
								'(! empty($param_value)) ? $param_value : "white";', //Fallback
							),
						),
						'marker_display' => array(
							'name' => 'marker_display',
							'id' => 'marker_display',
							'type' => 'boolean',
							'title' => '<span class="waymark-invisible">' . esc_html__('Marker', 'waymark') . '</span> ' . esc_html__('Show Initially', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_display'),
							'tip' => esc_attr__('When using the Overlay Filter you can choose to show/hide certain Types when the Map initially loads.', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value)) ? $param_value : 1;', //Fallback
							),
						),
						'marker_submission' => array(
							'name' => 'marker_submission',
							'id' => 'marker_submission',
							'type' => 'boolean',
							'title' => '<span class="waymark-invisible">' . esc_html__('Marker', 'waymark') . '</span> ' . esc_html__('Submissions?', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_submission'),
							'tip' => esc_attr__('Make this Type available in front-end Submissions?', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value)) ? $param_value : 1;', //Fallback
							),
						),
						'icon_type' => array(
							'name' => 'icon_type',
							'id' => 'icon_type',
							'type' => 'select',
							'class' => '',
							'title' => '<span style="display:inline-block;min-width:50px">' . esc_html__('Icon', 'waymark') . '</span>' . esc_html__('Type', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'icon_type'),
							'tip' => esc_attr__('Font Icons are available from Font Awesome and Ionic Icons. Simple Text or Emojis are supported, as well as custom HTML. So you can pretty much use anything you like!', 'waymark'),
							'tip_link' => 'https://emojifinder.com/',
							'options' => array(
								'icon' => esc_html__('Font Icon', 'waymark'),
								'text' => esc_html__('Text (or Emoji!)', 'waymark'),
								'html' => esc_html__('HTML', 'waymark'),
							),
						),
						'marker_icon' => array(
							'name' => 'marker_icon',
							'id' => 'marker_icon',
							'type' => 'text',
							'class' => 'waymark-short-input',
							'title' => '<span class="waymark-invisible" style="display:inline-block;min-width:50px">' . esc_html__('Icon', 'waymark') . '</span><span class="waymark-icon-type">' . esc_html__('Name', 'waymark') . '</span>',
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_icon'),
							'tip' => esc_attr__('The desired icon name from Ionicons or Font Awesome, e.g. "ion-camera", or "fa-camera". Click the links to see the full list of icons available.|Text to display inside the Marker, in the chosen colour. Space is very limited! Pro Tip: adjust text size using CSS; for all Markers: .waymark-icon-text{font-size: 18px}, or by Type: .waymark-marker-photo .waymark-icon-text{...}. Use your browser\'s inspector to dig for Type class names.|The HTML entered will be added inside each Marker. Pro Tip! HTML Entities supported (e.g. &amp;cross; as well as Unicode and Emojis!), or provide HTML to integrate with other Icon providers.', 'waymark'),
							'input_processing' => array(
								'(strpbrk($param_value, "\">")) ? htmlspecialchars($param_value) : $param_value',
							),
							'append' => '<div class="waymark-icons-help"><a href="https://ionic.io/ionicons/v2/cheatsheet.html">Ionic Icons</a><a href="https://fontawesome.com/v4.7.0/cheatsheet/">Font Awesome</a></div>',
						),
						'icon_colour' => array(
							'name' => 'icon_colour',
							'id' => 'icon_colour',
							'type' => 'text',
							'class' => 'waymark-short-input waymark-colour-picker',
							'title' => '<span class="waymark-invisible" style="display:inline-block;min-width:50px">' . esc_html__('Icon', 'waymark') . '</span>' . esc_html__('Colour', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'icon_colour'),
							'tip' => esc_attr__('The colour of the icon. Click "Select Colour" to select.', 'waymark'),
							'input_processing' => array(
								'(! empty($param_value)) ? $param_value : "#81d742";', //Fallback
							),
						),
					),
				),
			),
		);
-->

| Option        | Example   | Description                                                                                                                                                                                                                                             | Values                                                                                                                   |
| ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| marker_title  | "Pub"     | What kind of Marker is this? E.g. "Photo", "Grocery Store", "Warning!".                                                                                                                                                                                 |                                                                                                                          |
| marker_shape  | "circle"  | Which shape of Marker to use. Circles and Squares are centered at the specified location, Markers point down to that location.                                                                                                                          | "marker", "circle", "rectangle"                                                                                          |
| marker_size   | "large"   | Which size of Marker to use.                                                                                                                                                                                                                            | "small", "medium", "large"                                                                                               |
| marker_colour | "#da3d20" | The Marker background colour.                                                                                                                                                                                                                           | Any CSS colour, i.e. "white", "#ffba00", rgb(255, 186, 0)                                                                |
| marker_icon   | 🍺        | Either the **Text** (including [Emojis](https://emojifinder.com/)!), **HTML**, or **Icon Name** from Ionicons or Font Awesome, e.g. "ion-camera", or "fa-camera". The desired icon name from Ionicons or Font Awesome, e.g. "ion-beer", or "fa-camera". | [Ionic v2](https://ionic.io/ionicons/v2/cheatsheet.html) / [Font Awesome v4](https://fontawesome.com/v4.7.0/cheatsheet/) |
| icon_type     | "text"    | Font Icons are available from Font Awesome and Ionic Icons. Simple Text or Emojis are supported, as well as custom HTML.                                                                                                                                | "icon", "text", "html"                                                                                                   |
| icon_colour   | "#ffba00" | The colour of the icon.                                                                                                                                                                                                                                 |                                                                                                                          |

#### Line Types

Line Types are added to the Map using the `line_types` array, each Line Type is an object with the following options:

| Option       | Type   | Description                   |
| ------------ | ------ | ----------------------------- |
| line_title   | string | The title of the Line Type.   |
| line_colour  | string | The colour of the Line Type.  |
| line_weight  | string | The weight of the Line Type.  |
| line_opacity | string | The opacity of the Line Type. |

#### Shape Types

Shape Types are added to the Map using the `shape_types` array, each Shape Type is an object with the following options:

| Option       | Type   | Description                    |
| ------------ | ------ | ------------------------------ |
| shape_title  | string | The title of the Shape Type.   |
| shape_colour | string | The colour of the Shape Type.  |
| fill_opacity | string | The opacity of the Shape Type. |

## Source Code

The Full Waymark_Map Source Code is:

```javascript
/*
	==================================
	========== LOCALIZATION ==========
	==================================
*/

var waymark_js_localize = {
	//Viewer
	action_fullscreen_activate: "View Fullscreen",
	action_fullscreen_deactivate: "Exit Fullscreen",
	action_locate_activate: "Show me where I am",
	action_zoom_in: "Zoom in",
	action_zoom_out: "Zoom out",
	label_total_length: "Total Length: ",
	label_max_elevation: "Max. Elevation: ",
	label_min_elevation: "Min. Elevation: ",
	label_ascent: "Total Ascent: ",
	label_descent: "Total Descent: ",
	//Editor
	add_line_title: "Draw a Line",
	add_photo_title: "Upload an Image",
	add_marker_title: "Place a Marker",
	add_rectangle_title: "Draw a Rectangle",
	add_polygon_title: "Draw a Polygon",
	add_circle_title: "Draw a Circle",
	upload_file_title:
		"Read Lines and Markers from file (GPX/KML/GeoJSON supported, which most apps should Export to)",
	action_duplicate: "Duplicate",
	action_delete: "Delete",
	action_edit: "Edit",
	action_edit_done: "Finish editing",
	action_upload_image: "Upload Image",
	object_title_placeholder: "Title",
	object_image_placeholder: "Image URL",
	object_description_placeholder: "Description",
	object_type_label: "Type",
	marker_latlng_label: "Lat,Lng",
	action_delete_confirm: "Are you sure you want to delete this",
	action_search_placeholder: "Search...",
	object_label_marker: "Marker",
	object_label_line: "Line",
	object_label_shape: "Shape",
	object_label_marker_plural: "Markers",
	object_label_line_plural: "Lines",
	object_label_shape_plural: "Shapes",
	error_message_prefix: "Waymark Error",
	info_message_prefix: "Waymark Info",
	debug_message_prefix: "Waymark Debug",
	error_file_type: "This file type is not supported.",
	error_file_conversion: "Could not convert this file to GeoJSON.",
	error_file_upload: "File upload error.",
	error_photo_meta: "Could not retrieve Image metadata.",
	info_exif_yes: "Image location metadata (EXIF) detected!",
	info_exif_no: "Image location metadata (EXIF) NOT detected.",
	error_no_wpmedia: "WordPress Media Library not found",
	no_direction: "No Direction",
	show_direction: "Show Direction",
	reverse_direction: "Reverse Direction",
};

if (typeof waymark_js === "undefined") {
	var waymark_js = {
		lang: {},
	};
}
for (key in waymark_js_localize) {
	if (typeof waymark_js.lang[key] === "undefined") {
		waymark_js.lang[key] = waymark_js_localize[key];
	}
}

/*
	==================================
	=============== MAP ==============
	==================================
*/

function Waymark_Map() {
	this.fallback_latlng = [51.38436, -68.74923];
	this.fallback_zoom = 9;

	this.init = function (user_config = {}) {
		Waymark = this;

		//Start timer
		Waymark.start_time = new Date().getTime();

		// jQuery Map Container
		Waymark.jq_map_container = null;

		//Default config
		Waymark.config = {
			// Map (Common Options

			map_options: {
				debug_mode: 0,

				map_height: 400,
				map_div_id: "waymark-map",
				map_width: null,
				map_init_zoom: null,
				map_init_latlng: null,
				map_init_basemap: null,
				map_max_zoom: null,

				// Basemaps

				tile_layers: [
					{
						layer_name: "Open Street Map",
						layer_url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?r=1",
						layer_attribution:
							'\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
						layer_max_zoom: "18",
					},
				],

				// Types - defaults

				line_types: [],
				shape_types: [],
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

				// Common Features
				show_scale: 0,
			},

			// Viewer

			viewer_options: {
				// Features
				show_gallery: 1,
				show_filter: 1,

				// Cluster
				show_cluster: 1,
				cluster_radius: 80,
				cluster_threshold: 14,

				// Elevation
				show_elevation: 0,
				elevation_div_id: "waymark-elevation",
				elevation_units: "metric",
				elevation_initial: 1,

				// Sleep
				sleep_delay_seconds: 2,
				sleep_do_message: 0,
				sleep_wake_message: waymark_js.lang.action_sleep_wake_message,
			},

			// Editor

			editor_options: {
				confirm_delete: 1,
				data_div_id: "waymark-data",
			},

			// Media Library

			image_size_names: ["thumbnail", "medium", "large", "full"],

			// Defaults
			marker_data_defaults: {
				title: undefined,
				type: undefined,
				image_thumbnail_url: undefined,
				image_medium_url: undefined,
				image_large_url: undefined,
				description: undefined,
			},
			line_data_defaults: {
				type: undefined,
				title: undefined,
				image_thumbnail_url: undefined,
				image_medium_url: undefined,
				image_large_url: undefined,
				description: undefined,
				direction: undefined,
			},
			shape_data_defaults: {
				type: undefined,
				title: undefined,
				image_thumbnail_url: undefined,
				image_medium_url: undefined,
				image_large_url: undefined,
				description: undefined,
			},
		};

		// Merge config

		//Iterate over user config (Only map_options, viewer_options, editor_options)

		for (key in user_config) {
			// Only allow the following keys: map_options, viewer_options, editor_options
			if (
				["map_options", "viewer_options", "editor_options"].indexOf(key) > -1
			) {
				//Iterate over user config
				for (sub_key in user_config[key]) {
					//Check key exists
					if (typeof Waymark.config[key][sub_key] !== "undefined") {
						// If Object
						if (typeof user_config[key][sub_key] === "object") {
							// Keep Arrays	as Arrays
							if (Array.isArray(user_config[key][sub_key])) {
								Waymark.config[key][sub_key] = user_config[key][sub_key];
								// Else, merge
							} else {
								Waymark.config[key][sub_key] = Object.assign(
									{},
									Waymark.config[key][sub_key],
									user_config[key][sub_key],
								);
							}

							Waymark.debug(
								"Setting config: " +
									key +
									" - " +
									sub_key +
									" - " +
									JSON.stringify(user_config[key][sub_key]),
							);
							// Else, set
						} else {
							Waymark.config[key][sub_key] = user_config[key][sub_key];

							Waymark.debug(
								"Setting config: " +
									key +
									" - " +
									sub_key +
									" - " +
									user_config[key][sub_key],
							);
						}
					}
				}
			}
		}

		//Set defaults
		var default_line_type = Waymark.get_type("line");
		var default_line_type_key = Waymark.make_key(default_line_type.line_title);
		Waymark.config.line_data_defaults.type = default_line_type_key;

		var default_shape_type = Waymark.get_type("shape");
		var default_shape_type_key = Waymark.make_key(
			default_shape_type.shape_title,
		);
		Waymark.config.shape_data_defaults.type = default_shape_type_key;

		var default_marker_type = Waymark.get_type("marker");
		var default_marker_type_key = Waymark.make_key(
			default_marker_type.marker_title,
		);
		Waymark.config.marker_data_defaults.type = default_marker_type_key;

		// Debug
		if (Waymark.config.map_options.debug_mode) {
			console.log(Waymark.config);
		}

		//Groups
		Waymark.marker_parent_group = Waymark_L.layerGroup();
		Waymark.marker_sub_groups = {};
		Waymark.line_parent_group = Waymark_L.layerGroup();
		Waymark.line_sub_groups = {};
		Waymark.shape_parent_group = Waymark_L.layerGroup();
		Waymark.shape_sub_groups = {};

		//Setup...
		Waymark.pre_map_setup();
		Waymark.setup_map();
		Waymark.handle_resize();
		Waymark.init_done();
	};

	//Thanks! https://stackoverflow.com/questions/2631001/test-for-existence-of-nested-javascript-object-key
	this.get_property = function (obj, ...args) {
		return args.reduce((obj, level) => obj && obj[level], obj);
	};

	/**
	 *
	 * Output debugging content
	 * 	- Only if config.map_options.debug_mode is enabled
	 *
	 * @param  {string} thing  Thing to debug
	 * @param  {string} output Output method (console|alert)
	 * @return {void}
	 * @since  0.9
	 *
	 * @example
	 * Waymark.debug('Hello World');
	 * Waymark.debug({foo: 'bar'});
	 * Waymark.debug({foo: 'bar'}, 'alert');
	 *
	 */
	this.debug = function (thing, output = "console") {
		if (this.config.map_options.debug_mode) {
			//String
			if (typeof thing === "string") {
				this.message(thing, "debug", output);

				//Object
			} else {
				// Ensure if plain object
				if (typeof thing === "object" && thing !== null) {
					thing = JSON.parse(JSON.stringify(thing));
				}

				// Console
				if (output == "console") {
					console.debug(thing);

					//Alert
				} else {
					this.message(JSON.stringify(thing), "debug", output);
				}
			}
		}
	};

	this.message = function (text = null, type = "info", output = "console") {
		if (text) {
			var prefix = "";

			switch (type) {
				case "debug":
				case "error":
					prefix = waymark_js.lang[type + "_message_prefix"];

					break;
				default:
				case "info":
					prefix = waymark_js.lang.info_message_prefix;

					break;
			}

			if (prefix) {
				prefix = "[" + prefix + "] ";
			}

			if (output == "console") {
				if (type == "error") {
					console.error(prefix + text);
				} else if (type == "debug") {
					console.debug(prefix + text);
				} else {
					console.log(prefix + text);
				}
			} else {
				alert(prefix + text);
			}
		}
	};

	this.title_case = function (str) {
		return str.replace(/(?:^|\s)\w/g, function (match) {
			return match.toUpperCase();
		});
	};

	//Cyrillic to latin

	// TODO - move to... somewhere

	//Thanks! https://stackoverflow.com/a/11404121
	this.transliterate = function (word) {
		var a = {
			Ё: "YO",
			Й: "I",
			Ц: "TS",
			У: "U",
			К: "K",
			Е: "E",
			Н: "N",
			Г: "G",
			Ш: "SH",
			Щ: "SCH",
			З: "Z",
			Х: "H",
			Ъ: "'",
			ё: "yo",
			й: "i",
			ц: "ts",
			у: "u",
			к: "k",
			е: "e",
			н: "n",
			г: "g",
			ш: "sh",
			щ: "sch",
			з: "z",
			х: "h",
			ъ: "'",
			Ф: "F",
			Ы: "I",
			В: "V",
			А: "a",
			П: "P",
			Р: "R",
			О: "O",
			Л: "L",
			Д: "D",
			Ж: "ZH",
			Э: "E",
			ф: "f",
			ы: "i",
			в: "v",
			а: "a",
			п: "p",
			р: "r",
			о: "o",
			л: "l",
			д: "d",
			ж: "zh",
			э: "e",
			Я: "Ya",
			Ч: "CH",
			С: "S",
			М: "M",
			И: "I",
			Т: "T",
			Ь: "'",
			Б: "B",
			Ю: "YU",
			я: "ya",
			ч: "ch",
			с: "s",
			м: "m",
			и: "i",
			т: "t",
			ь: "'",
			б: "b",
			ю: "yu",
		};

		return word
			.split("")
			.map(function (char) {
				return a[char] || char;
			})
			.join("");
	};

	this.make_key = function (str) {
		if (!str) {
			return str;
		}

		//No cyrillic
		str = this.transliterate(str);

		//No underscores
		str = str.replace(/[^a-z0-9+]+/gi, "");

		//Lower
		str = str.toLowerCase();

		return str;
	};

	this.get_feature_overlay_type = function (feature) {
		if (typeof feature.geometry.type == "undefined") {
			return false;
		}

		switch (feature.geometry.type) {
			// CIRCLES & MARKERS

			case "Point":
				//Circle
				if (feature.properties.radius) {
					return "shape";

					//Marker
				} else {
					return "marker";
				}

			// LINES
			case "LineString":
			case "MultiLineString":
				return "line";

			// Polygon & Rectangle
			case "Polygon":
				//Is this a retangle?
				//				if(feature.properties.rectangle) {}

				return "shape";

				break;
		}

		return false;
	};

	/*
	==================================
	========= COMMOM METHODS =========
	==================================
*/

	this.setup_map = function () {
		Waymark = this;

		Waymark.jq_map_container = jQuery(
			"#" + Waymark.config.map_options.map_div_id,
		);
		Waymark.jq_map_container.addClass("waymark-map-container");
		Waymark.jq_map_container.css(
			"height",
			Waymark.config.map_options.map_height + "px",
		);

		//Create Map
		var map_options = {
			fullscreenControl: false,
			attributionControl: false,
			editable: true,
			zoomControl: false,
			sleep: false,
		};

		// === Viewer ===

		if (Waymark.mode == "view") {
			//START Sleep
			//  			map_options.scrollWheelZoom = false;
			//Let Sleep enable this on Wake
			map_options.dragging = false;

			//Sleep
			map_options.sleep = true;
			map_options.wakeTime =
				1000 * Waymark.config.viewer_options.sleep_delay_seconds;

			//If Sleep Note
			if (Waymark.config.viewer_options.sleep_do_message === "1") {
				map_options.sleepNote = true;
				map_options.wakeMessage =
					Waymark.config.viewer_options.sleep_wake_message;
				//No Sleep Note
			} else {
				map_options.sleepNote = false;
				map_options.wakeMessage = false;
			}

			// 	    hoverToWake: false,
			map_options.sleepOpacity = 1;
			//END Sleep

			// === Editor ===
		} else {
			//Sleep not used, enable
			map_options.dragging = true;
		}

		//Merge Map options
		if (typeof Waymark.config.map_options !== "undefined") {
			// If not undefined
			if (
				typeof Waymark.config.map_options.map_max_zoom !== "undefined" &&
				Waymark.config.map_options.map_max_zoom
			) {
				// Set
				map_options.maxZoom = Waymark.config.map_options.map_max_zoom;

				console.log("Max Zoom: " + map_options.maxZoom);
			}
		}

		//Create Map

		Waymark.map = Waymark_L.map(
			Waymark.config.map_options.map_div_id,
			map_options,
		);
		Waymark_L.control
			.attribution({
				prefix:
					'<a href="https://www.waymark.dev/" title="Share your way">Waymark</a>',
			})
			.addTo(Waymark.map);

		//Show scale?
		if (Waymark.config.map_options.show_scale == true) {
			Waymark_L.control.scale().addTo(Waymark.map);
		}

		//Add reference
		Waymark.jq_map_container.data("Waymark", Waymark);

		//View
		const initial_latlng = Waymark.config.map_options.map_init_latlng;
		if (typeof initial_latlng !== "undefined" && initial_latlng) {
			Waymark.map.setView(initial_latlng);
		} else {
			Waymark.map.setView(Waymark.fallback_latlng);
		}

		const initial_zoom = Waymark.config.map_options.map_init_zoom;
		if (typeof initial_zoom !== "undefined" && initial_zoom) {
			Waymark.map.setZoom(initial_zoom);
		} else {
			Waymark.map.setZoom(Waymark.fallback_zoom);
		}

		//Set default style
		Waymark_L.Path.mergeOptions({
			color: "#b42714",
		});

		//Zoom Control
		Waymark_L.control
			.zoom({
				position: "topleft",
				zoomInTitle: waymark_js.lang.action_zoom_in,
				zoomOutTitle: waymark_js.lang.action_zoom_out,
			})
			.addTo(Waymark.map);

		//Locate Button
		Waymark_L.control
			.locate({
				position: "bottomright",
				icon: "ion ion-android-locate",
				drawCircle: false,
				strings: {
					title: waymark_js.lang.action_locate_activate,
				},
				locateOptions: {
					enableHighAccuracy: true,
				},
			})
			.addTo(Waymark.map);

		//Fullscreen Control
		Waymark_L.control
			.fullscreen({
				position: "topleft",
				title: {
					false: waymark_js.lang.action_fullscreen_activate,
					true: waymark_js.lang.action_fullscreen_deactivate,
				},
			})
			.addTo(Waymark.map);

		//Add parent groups to map
		Waymark.marker_parent_group.addTo(Waymark.map);
		Waymark.line_parent_group.addTo(Waymark.map);
		Waymark.shape_parent_group.addTo(Waymark.map);

		//Setup
		Waymark.setup_layers();
		Waymark.create_data_layer();
		Waymark.create_buttons();
	};

	this.create_data_layer = function () {
		Waymark = this;

		//Create data layer
		Waymark.map_data = Waymark_L.geoJSON(null, {
			pointToLayer: function (feature, latlng) {
				if (
					typeof feature.properties !== "undefined" &&
					feature.properties.radius
				) {
					return new Waymark_L.Circle(
						latlng,
						parseFloat(feature.properties.radius),
					);
				} else {
					return Waymark.create_marker(latlng);
				}
			},
			onEachFeature: function (feature, layer) {
				switch (feature.geometry.type) {
					// CIRCLES & MARKERS

					case "Point":
						//Circle
						if (feature.properties.radius) {
							//Build Waymark data
							feature.properties = Waymark.parse_layer_data(
								"shape",
								feature.properties,
							);

							//Set style
							var type = Waymark.get_type("shape", feature.properties.type);
							layer.setStyle({
								color: type.shape_colour,
								fillOpacity: type.fill_opacity,
							});

							//Set info window
							Waymark.info_window("shape", feature, layer);

							//Set title tooltip
							Waymark.tooltip("shape", feature, layer);

							//Add to group
							Waymark.add_to_group("shape", layer);
							//Marker
						} else {
							//Build Waymark data
							feature.properties = Waymark.parse_layer_data(
								"marker",
								feature.properties,
							);

							//Set marker style
							var type = Waymark.get_type("marker", feature.properties.type);

							//Create Icon
							layer.setIcon(Waymark_L.divIcon(Waymark.build_icon_data(type)));

							//Add any photos to photo gallery
							if (typeof Waymark.gallery_images !== "undefined") {
								Waymark.add_to_gallery(layer);
							}

							//Set info window
							Waymark.info_window("marker", feature, layer);

							//Set title tooltip
							Waymark.tooltip("marker", feature, layer);

							//Add to group
							Waymark.add_to_group("marker", layer);
						}

						break;

					// LINES

					case "LineString":
					case "MultiLineString":
						//Build Waymark data
						feature.properties = Waymark.parse_layer_data(
							"line",
							feature.properties,
						);

						//Set line style
						var type = Waymark.get_type("line", feature.properties.type);
						layer.setStyle({
							color: type.line_colour,
							weight: type.line_weight,
							opacity: type.line_opacity,
						});

						//Set info window
						Waymark.info_window("line", feature, layer);

						//Set title tooltip
						Waymark.tooltip("line", feature, layer);

						//Line direction, shown initially?
						var show_initially = parseInt(type.line_display);
						Waymark.draw_line_direction(layer, show_initially);

						//Add to group
						Waymark.add_to_group("line", layer);

						break;

					// Polygon & Rectangle

					case "Polygon":
						//Build Waymark data
						feature.properties = Waymark.parse_layer_data(
							"shape",
							feature.properties,
						);

						//Is this a rectangle?
						if (feature.properties.rectangle) {
							//...
						}

						//Set shape style
						var type = Waymark.get_type("shape", feature.properties.type);
						layer.setStyle({
							color: type.shape_colour,
							fillOpacity: type.fill_opacity,
						});

						//Set info window
						Waymark.info_window("shape", feature, layer);

						//Set title tooltip
						Waymark.tooltip("shape", feature, layer);

						//Add to group
						Waymark.add_to_group("shape", layer);

						break;
				}
			},
		});
	};

	this.draw_line_direction = function (layer, show_initially = true) {
		var feature = layer.feature;
		var direction = feature.properties.direction;
		var type = Waymark.get_type("line", feature.properties.type);

		if (typeof layer.direction_layer === "object") {
			Waymark.map.removeLayer(layer.direction_layer);
		}

		//Valid direction
		if (
			typeof direction === "string" &&
			(direction == "default" || direction == "reverse")
		) {
			var head_angle = 45;
			//Reverse
			if (direction == "reverse") {
				head_angle = 360 - head_angle;
			}

			var decorator = Waymark_L.polylineDecorator(layer, {
				patterns: [
					{
						// 	            	offset: 25,
						repeat: 100,
						symbol: L.Symbol.arrowHead({
							pixelSize: 15,
							headAngle: head_angle,
							polygon: true,
							pathOptions: {
								color: "#fff",
								fillColor: type.line_colour,
								opacity: "0.7",
								stroke: true,
								fillOpacity: 0.7,
								weight: 2,
							},
						}),
					},
				],
			});

			if (show_initially) {
				decorator.addTo(Waymark.map);
			}

			layer.direction_layer = decorator;
		}
	};

	this.setup_layers = function () {
		Waymark = this;

		Waymark.layer_control = Waymark_L.control.layers();

		var basemaps = [];
		var initial_basemap_index = 0;

		//Determine initial basemap
		//Set by name?
		if (
			typeof Waymark.config.map_options.map_init_basemap !== "undefined" &&
			Waymark.config.map_options.map_init_basemap
		) {
			//Search
			for (var i in Waymark.config.map_options.tile_layers) {
				var init_basemap_name =
					Waymark.config.map_options.map_init_basemap.toUpperCase();
				var this_basemap_name =
					Waymark.config.map_options.tile_layers[i].layer_name.toUpperCase();

				//Found
				if (init_basemap_name === this_basemap_name) {
					//Use
					initial_basemap_index = i;
				}
			}
		}

		//For each tile layer
		for (var i in Waymark.config.map_options.tile_layers) {
			//Append URL?
			if (
				typeof Waymark.config.map_options.tile_layers[i].append !== "undefined"
			) {
				Waymark.config.map_options.tile_layers[i].layer_url +=
					Waymark.config.map_options.tile_layers[i].append;
			}

			//Create key
			var basemap_key = Waymark.config.map_options.tile_layers[
				i
			].layer_name.replace(/ /g, "");

			//Create tile layer
			var layer_options = {
				id: basemap_key,
				attribution:
					Waymark.config.map_options.tile_layers[i].layer_attribution,
			};

			//Max zoom?
			var layer_max_zoom = parseInt(
				Waymark.config.map_options.tile_layers[i].layer_max_zoom,
			);
			if (layer_max_zoom) {
				layer_options.maxZoom = layer_max_zoom;
			}

			var basemap = Waymark_L.tileLayer(
				Waymark.config.map_options.tile_layers[i].layer_url,
				layer_options,
			);
			basemaps[Waymark.config.map_options.tile_layers[i].layer_name] = basemap;

			//Set initial basemap
			if (i == initial_basemap_index) {
				basemap.addTo(Waymark.map);
			}
		}

		//More than one tile layer
		if (i >= 1) {
			//Layer control
			Waymark.layer_control.addTo(Waymark.map);
			for (basemap_name in basemaps) {
				Waymark.layer_control.addBaseLayer(
					basemaps[basemap_name],
					basemap_name,
				);
			}
		}
	};

	this.get_type = function (layer_type, type_key) {
		Waymark = this;

		var type = null;

		//Iterate over all types
		for (var i in Waymark.config.map_options[layer_type + "_types"]) {
			//Use first as default
			if (i == 0) {
				type = Waymark.config.map_options[layer_type + "_types"][i];
			}

			//Grab title
			var type_title =
				Waymark.config.map_options[layer_type + "_types"][i][
					layer_type + "_title"
				];

			//Has title
			if (type_title) {
				//Found (run both through make_key, just to be on safe side)
				if (Waymark.make_key(type_key) == Waymark.make_key(type_title)) {
					type = Waymark.config.map_options[layer_type + "_types"][i];
				}
			}
		}

		//Set key
		type = Waymark.parse_type(type, layer_type);

		return type;
	};

	//Checks for types
	this.parse_type = function (type = {}, layer_type = "marker") {
		Waymark = this;

		if (typeof type === "undefined" || type === null) {
			type = {};
		}

		switch (layer_type) {
			case "line":
				//Checks
				var required = [
					{
						key: "line_colour",
						default: "#b42714",
					},
					{
						key: "line_weight",
						default: "3",
					},
					{
						key: "line_opacity",
						default: "0.7",
					},
				];

				for (var i in required) {
					//If undefined
					if (typeof type[required[i]["key"]] !== "string") {
						//Set default
						type[required[i]["key"]] = required[i]["default"];
					}
				}

				break;
		}

		type.type_key = Waymark.make_key(type[layer_type + "_title"]);

		return type;
	};

	this.handle_resize = function () {
		Waymark = this;

		jQuery(window).on("resize", function () {
			Waymark.config.map_options.map_height = Waymark.jq_map_container.height();
			Waymark.config.map_options.map_width = Waymark.jq_map_container.width();

			if (typeof Waymark.size_gallery === "function") {
				Waymark.size_gallery();
			}
		});
	};

	this.tooltip = function (layer_type, feature, layer) {
		Waymark = this;

		var text = "";

		//Displaying Type?
		var type = Waymark.get_type(layer_type, feature.properties.type);

		if (type && typeof type[layer_type + "_title"] !== "undefined") {
			var title = type[layer_type + "_title"];
			text = '<span class="waymark-type-label">[' + title + "]</span>";
		}

		//Title
		if (feature.properties.title) {
			text += feature.properties.title;
		}

		if (!text) {
			return;
		}

		layer.bindTooltip(text);

		layer.on("mouseover", function (e) {
			var tooltip = e.target.getTooltip();
			tooltip.setLatLng(e.latlng);
			tooltip.openTooltip();
		});

		layer.on("mousemove", function (e) {
			var tooltip = e.target.getTooltip();
			tooltip.setLatLng(e.latlng);
		});
	};

	this.get_data_defaults = function (layer_type) {
		return Object.assign({}, Waymark.config[layer_type + "_data_defaults"]);
	};

	this.parse_layer_data = function (layer_type, data_in) {
		Waymark = this;

		//Start with defaults
		var data_out = Waymark.get_data_defaults(layer_type);

		//Check for stored properties
		if (typeof data_in === "object") {
			//Iterate
			for (key in data_out) {
				//If we have something
				if (typeof data_in[key] != "undefined" && data_in[key]) {
					//Use it
					data_out[key] = data_in[key];
				}
			}
		}

		//Migrate some parameters

		//Iterate
		for (key in data_in) {
			//Has value
			if (data_in[key]) {
				switch (key) {
					case "name":
						data_out.title = data_in[key];

						break;
					case "desc":
					case "notes":
						data_out.description = data_in[key];

						break;

					case "radius":
						data_out[key] = parseFloat(data_in[key]);

						break;
				}
			}
		}

		return data_out;
	};

	this.add_to_group = function (layer_type, layer) {
		Waymark = this;

		var feature = layer.feature;

		//If we have a type
		if (typeof feature.properties.type !== "undefined") {
			//Get Type
			var type_key = feature.properties.type;
			var type = Waymark.get_type(layer_type, type_key);

			if (
				typeof Waymark[layer_type + "_sub_groups"][type.type_key] == "undefined"
			) {
				//Create the sub-group
				var group = Waymark_L.featureGroup.subGroup(
					Waymark[layer_type + "_parent_group"],
				);

				//Add to groups
				Waymark[layer_type + "_sub_groups"][type.type_key] = group;

				//Add to Map
				if (
					Waymark.mode == "view" &&
					typeof type[layer_type + "_display"] !== "undefined"
				) {
					if (type[layer_type + "_display"] == "1") {
						group.addTo(Waymark.map);
					}
				} else {
					group.addTo(Waymark.map);
				}
			}

			//Add Layer to group
			layer.addTo(Waymark[layer_type + "_sub_groups"][type.type_key]);
			//Direction layer?
			if (layer_type == "line" && typeof layer.direction_layer === "object") {
				layer.direction_layer.addTo(
					Waymark[layer_type + "_sub_groups"][type.type_key],
				);
			}

			//If Overlay Filter is enabled
			if (
				parseInt(Waymark.config.viewer_options.show_filter) &&
				Waymark.mode == "view"
			) {
				//Ensure the control is added
				Waymark.layer_control.addTo(Waymark.map);

				//Redraw in layer Control
				Waymark.layer_control.removeLayer(
					Waymark[layer_type + "_parent_group"],
				);
				Waymark.layer_control.addOverlay(
					Waymark[layer_type + "_parent_group"],
					"<b>" +
						waymark_js_localize["object_label_" + layer_type + "_plural"] +
						"</b>",
				);

				Waymark_L.stamp(Waymark[layer_type + "_parent_group"]);
				for (key in Waymark[layer_type + "_sub_groups"]) {
					var this_type = Waymark.get_type(layer_type, key);
					var group = Waymark[layer_type + "_sub_groups"][key];

					//(Re-?)add to control
					Waymark.layer_control.removeLayer(group);
					Waymark.layer_control.addOverlay(
						group,
						Waymark.type_to_text(layer_type, this_type),
					);
				}
			}
			//No type key - just add to Map
		} else {
			layer.addTo(Waymark[layer_type + "_parent_group"]);
		}
	};

	//Represent Type as text
	this.type_to_text = function (layer_type = "", type = {}, ele = "span") {
		Waymark = this;

		var preview_class = "waymark-type-text waymark-" + layer_type + "-type";
		var preview_style = "";

		switch (layer_type) {
			case "marker":
				preview_style += "color:" + type.icon_colour + ";";
				preview_style +=
					"background:" + Waymark.get_marker_background(type.marker_colour);

				break;
			case "line":
				preview_style += "background:" + type.line_colour;

				break;
			case "shape":
				preview_style += "background:" + type.shape_colour;

				break;
		}

		return (
			"<" +
			ele +
			' class="' +
			preview_class +
			'" style="' +
			preview_style +
			'">' +
			type[layer_type + "_title"] +
			"</" +
			ele +
			">"
		);
	};

	//Create marker
	this.create_marker = function (latlng) {
		return Waymark_L.marker(latlng);
	};

	this.build_icon_data = function (type = {}) {
		Waymark = this;

		// Ensure is a an object with a non-empty type key
		if (typeof type !== "object" || typeof type.type_key === "undefined") {
			return false;
		}

		var icon_data = {
			className: "waymark-marker waymark-marker-" + type.type_key,
		};

		//Shape
		if (
			typeof type.marker_shape !== "undefined" &&
			typeof type.marker_size !== "undefined"
		) {
			icon_data.className += " waymark-marker-" + type.marker_shape;
			icon_data.className += " waymark-marker-" + type.marker_size;

			switch (type.marker_shape) {
				//Markers & Circles
				case "rectangle":
				case "circle":
				case "marker":
					//Size
					switch (type.marker_size) {
						case "small":
							icon_data.iconSize = [16, 16];

							break;
						case "medium":
							icon_data.iconSize = [25, 25];

							break;
						default:
						case "large":
							icon_data.iconSize = [32, 32];

							break;
					}

					break;
			}

			//Marker only
			if (type.marker_shape == "marker") {
				icon_data.iconAnchor = [
					icon_data.iconSize[0] / 2,
					icon_data.iconSize[1] * 1.25,
				];
			}
		}

		//CSS Styles
		var background_css =
			"background:" + Waymark.get_marker_background(type.marker_colour) + ";";
		var icon_css = "color:" + type.icon_colour + ";";

		//HTML
		icon_data.html =
			'<div class="waymark-marker-background" style="' +
			background_css +
			'"></div>';

		// Ensure we have type.marker_icon
		if (typeof type.marker_icon === "undefined") {
			Waymark.debug(
				"No marker_icon for type: " + JSON.stringify(type),
				"alert",
			);
		}

		//Classes
		var icon_class = "waymark-marker-icon";

		//Text, HTML or Icon Name
		switch (type.icon_type) {
			//Text
			case "text":
				icon_class += " waymark-icon-text";

				icon_data.html +=
					'<div style="' +
					icon_css +
					'" class="' +
					icon_class +
					'">' +
					type.marker_icon +
					"</div>";

				break;

			//HTML
			case "html":
				icon_class += " waymark-icon-html";

				//Decode HTML entities using jQuery
				var icon_html = jQuery("<div/>").html(type.marker_icon).text();

				icon_data.html +=
					'<div class="' + icon_class + '">' + icon_html + "</div>";

				break;

			//Icon Name
			case "icon":
			default:
				icon_class += " waymark-icon-icon";

				//If Ionic Icons
				if (type.marker_icon.indexOf("ion-") === 0) {
					icon_class += " ion ";
					icon_class += " " + type.marker_icon;
					//Font Awesome
				} else if (type.marker_icon.indexOf("fa-") === 0) {
					icon_class += " fa";
					icon_class += " " + type.marker_icon;
					//Default to Ionic
				} else {
					icon_class += " ion";
					icon_class += " ion-" + type.marker_icon;
				}

				icon_data.html +=
					'<i style="' + icon_css + '" class="' + icon_class + '"></i>';

				break;
		}

		return icon_data;
	};

	this.build_type_heading = function (
		overlay_type = "marker",
		type_key = "photo",
	) {
		//Get Type
		const type = Waymark.get_type(overlay_type, type_key);

		if (!type) {
			Waymark.message("Type not found: " + type_key, "error");
		}

		// Defaults
		let text_color = "inherit";
		let background_color = type.shape_colour;

		// Switch
		switch (overlay_type) {
			case "marker":
				background_color = Waymark.get_marker_background(type.marker_colour);

				break;
			case "line":
				background_color = type.line_colour;

				break;

			case "shape":
				background_color = type.shape_colour;

				break;
		}

		if (type) {
			heading = `
				<div class="waymark-type-heading" style="background:${background_color}">
					${Waymark.type_preview(overlay_type, type)}
					${Waymark.type_to_text(overlay_type, type)}
				</div>
			`;
		}

		return heading;
	};

	this.type_preview = function (
		overlay_type = "marker",
		type = {},
		ele = "div",
	) {
		let out = `<${ele} class="waymark-type-preview waymark-${overlay_type}-type waymark-${overlay_type}-${type.type_key}">`;

		// By overlay type
		switch (overlay_type) {
			case "marker":
				// Get Icon Data
				const icon_data = Waymark.build_icon_data(type);

				// Add Icon
				out += `<div class="${icon_data.className}">${icon_data.html}</div>`;

				break;
			case "line":
				out += Waymark.type_to_text(overlay_type, type, "span");

				break;

			case "shape":
				out += Waymark.type_to_text(overlay_type, type, "span");

				break;
		}

		out += `</${ele}>`;

		return out;
	};

	this.get_marker_background = function (colour) {
		var old_background_options = [
			"red",
			"darkred",
			"orange",
			"green",
			"darkgreen",
			"blue",
			"purple",
			"darkpurple",
			"cadetblue",
			"white",
			"black",
		];

		//Convert
		if (old_background_options.includes(colour)) {
			switch (colour) {
				case "red":
					return "#da3d20";
					break;
				case "darkred":
					return "#a43233";
					break;
				case "orange":
					return "#f9960a";
					break;
				case "green":
					return "#70af00";
					break;
				case "darkgreen":
					return "#72820d";
					break;
				case "blue":
					return "#2aabe1";
					break;
				case "purple":
					return "#d553bd";
					break;
				case "darkpurple":
					return "#5c3a6e";
					break;
				case "cadetblue":
					return "#416979";
					break;
				case "white":
					return "#fbfbfb";
					break;
				case "black":
					return "#303030";
					break;
			}
		}

		return colour;
	};

	this.create_marker_json = function (lat_lng, properties = {}) {
		var marker_properties = Object.assign(
			{},
			Waymark.config.marker_data_defaults,
			properties,
		);

		var marker_json = {
			geometry: {
				type: "Point",
				coordinates: [lat_lng.lng, lat_lng.lat],
			},
			type: "Feature",
			properties: marker_properties,
		};

		return marker_json;
	};

	this.get_exif_latlng = function (data) {
		if (
			data.GPSLatitudeNum &&
			!isNaN(data.GPSLatitudeNum) &&
			data.GPSLongitudeNum &&
			!isNaN(data.GPSLongitudeNum)
		) {
			Waymark.debug(waymark_js.lang.info_exif_yes);

			return L.latLng(data.GPSLatitudeNum, data.GPSLongitudeNum);
		} else {
			Waymark.debug(waymark_js.lang.info_exif_no);
		}

		return false;
	};

	this.get_image_sizes = function (data, fallback) {
		Waymark = this;

		var image_sizes = {};

		//Grab these
		for (var i in Waymark.config.image_size_names) {
			//Use fallback
			image_sizes["image_" + Waymark.config.image_size_names[i] + "_url"] =
				fallback;

			//We have the data we want
			if (
				typeof data[Waymark.config.image_size_names[i]] !== "undefined" &&
				typeof data[Waymark.config.image_size_names[i]]["url"] !== "undefined"
			) {
				//Use it
				image_sizes["image_" + Waymark.config.image_size_names[i] + "_url"] =
					data[Waymark.config.image_size_names[i]]["url"];
			}
		}

		return image_sizes;
	};

	this.build_overlay_content = function (
		feature = [],
		feature_type = "",
		type_data = [],
	) {
		Waymark = this;

		const has_title = feature.properties.title
			? "waymark-overlay-has-title"
			: "";
		const has_desc = feature.properties.description
			? "waymark-overlay-has-desc"
			: "";
		const has_image = feature.properties.image_large_url
			? "waymark-overlay-has-image"
			: "";

		var content = `<div class="waymark-overlay-content ${has_title} ${has_desc} ${has_image} waymark-overlay-${feature_type}">`;

		//Expected Waymark properties
		const property_keys = ["type", "title", "description", "image_large_url"];
		//Iterate over each

		for (index in property_keys) {
			var property_key = property_keys[index];

			//Wrap in div
			content += `<div class="waymark-overlay-property waymark-overlay-property-${property_key}">`;

			switch (property_key) {
				//Type
				case "type":
					content += Waymark.type_to_text(feature_type, type_data);

					break;

				//Title
				case "title":
					content += feature.properties.title
						? feature.properties.title
						: "<em>Untitled " +
							type_data[feature_type + "_title"] +
							" " +
							Waymark.title_case(feature_type) +
							"</em>";

					break;

				//Description
				case "description":
					var description = feature.properties.description;

					//We have a description
					if (description) {
						//HTML
						if (description.indexOf("<") === 0) {
							content += description;
							//Plain text
						} else {
							content += `<p>${description}</p>`;
						}
					}

					break;

				//Image
				case "image_large_url":
					//We have an image
					if (!feature.properties.image_large_url) {
						break;
					}

					// Perform basic URL validation, must start with http:// or https://
					if (!feature.properties.image_large_url.match(/^(https?:\/\/)/)) {
						break;
					}

					//We have an image
					if (feature.properties.image_large_url) {
						//Use Medium if we have it
						var thumb_url = feature.properties.image_large_url;
						if (feature.properties.image_medium_url) {
							thumb_url = feature.properties.image_medium_url;
						}

						content += `<a href="${feature.properties.image_large_url}" target="_blank" style="background-image:url(${thumb_url})"></a>`;
					}

					break;
			}

			content += "</div>";
		}

		content += "</div>";

		return content;
	};

	this.load_done = function () {
		Waymark = this;

		// Calculate execution time
		let end_time = new Date().getTime();
		let execution_time = (end_time - Waymark.start_time) / 1000;

		Waymark.debug(
			"Waymark Loaded in " + execution_time.toFixed(3) + " seconds",
		);
		// Waymark.debug(this);

		// Check for callback waymark_loaded_callback
		if (typeof waymark_loaded_callback === "function") {
			Waymark.debug(
				"Global Callback detected! waymark_loaded_callback(waymark_instance)",
			);

			// Call it
			waymark_loaded_callback(Waymark);
		} else {
			Waymark.debug("No Global Callback detected.");
		}
	};

	/*
	==================================
	======== ABSTRACT METHODS ========
	==================================
*/

	this.pre_map_setup = function () {};
	this.init_done = function () {};
	this.info_window = function (layer_type, feature, layer) {};
	this.build_content = function (layer_type, feature) {};
}
```

Settings.php definitions:

```php
<?php

class Waymark_Settings {
	private $settings_id = 'Waymark_Settings';
	private $page_slug = 'waymark-settings';
	private $default_content = 'waymark-settings-tab-tiles';
	private $current_settings = array();
	public $tabs = array();
	public $settings_nav;

	function __construct() {

		//Execute action?
		if (sizeof($_POST)) {
			//Clear cache
			if (isset($_POST['Waymark_Settings']['advanced']['performance']['clear_cache'])) {
				$this->execute_action('clear_cache');
			}
		}

		//Get current settings from DB
		$current_settings = get_option('Waymark_Settings');
		if (is_array($current_settings)) {
			$this->current_settings = $current_settings;
		}

		/**
		 * ===========================================
		 * =============== SETTINGS NAV ==============
		 * ===========================================
		 */

		$this->settings_nav = [
			'label_maps' => esc_html__('Maps'),
			'waymark-settings-tab-tiles' => '-- ' . esc_html__('Basemaps', 'waymark'),
			'waymark-settings-section-shortcode_options' => '-- ' . esc_html__('Shortcodes', 'waymark'),
			'waymark-settings-section-elevation_options' => '-- ' . esc_html__('Elevation', 'waymark'),
			'waymark-settings-tab-meta' => '-- ' . esc_html__('Meta', 'waymark'),
			'waymark-settings-section-collection_options' => '-- ' . esc_html__('Collections', 'waymark'),
			'waymark-settings-section-interaction_options' => '-- ' . esc_html__('Sleep', 'waymark'),
			'waymark-settings-section-cluster_options' => '-- ' . esc_html__('Clustering', 'waymark'),
			'waymark-settings-section-map_options' => '-- ' . esc_html__('Misc.', 'waymark'),
			'label_overlays' => esc_html__('Overlays'),
			'waymark-settings-tab-markers' => '-- ' . esc_html__('Markers', 'waymark'),
			'waymark-settings-tab-lines' => '-- ' . esc_html__('Lines', 'waymark'),
			'waymark-settings-tab-shapes' => '-- ' . esc_html__('Shapes', 'waymark'),
			'label_sources' => esc_html__('Sources'),
			'waymark-settings-tab-submission' => '-- ' . esc_html__('Submissions', 'waymark'),
// 			'waymark-settings-tab-query' => '-- ' . esc_html__('Queries', 'waymark'),
			'waymark-settings-tab-misc' => esc_html__('Advanced', 'waymark'),
		];

		/**
		 * ===========================================
		 * ================= BASEMAPS ================
		 * ===========================================
		 */

		$this->tabs['tiles'] = array(
			'name' => esc_html__('Basemaps', 'waymark'),
			'description' => '',
			'sections' => array(
				'layers' => array(
					'repeatable' => true,
					'title' => esc_html__('Basemaps', 'waymark'),
					'description' => sprintf(__('<span class="waymark-lead">Waymark uses the excellent <a href="%s">OpenStreetMap</a> as it’s default Basemap and supports many <a href="%s">other providers</a>.<br /><br /><a href="%s">Thunderforest</a> and <a href="%s">Mapbox</a> are examples of providers that offer easy access to beautiful Basemaps (including satellite imagery). They require registration, but have a free usage tier.', 'waymark'), 'https://www.openstreetmap.org/fixthemap', 'https://leaflet-extras.github.io/leaflet-providers/preview/', 'https://www.thunderforest.com/', 'https://www.mapbox.com/maps/'),
					'footer' => sprintf(__('<small><b>Pro Tip!</b> If you have more than one Basemap, you can switch between them when viewing the Map. The first listed will be used as the default, unless specified in the shortcode like this: %s. Drag to re-order, remove all to restore defaults.</small>', 'waymark'), '[' . Waymark_Config::get_item('shortcode') . ' map_id=&quot;1234&quot; basemap=&quot;Basemap Name&quot;]'),
					'help' => array(
						'url' => esc_attr(Waymark_Helper::site_url('docs/basemaps')),
						'text' => esc_attr__('Basemap Docs &raquo;', 'waymark'),
					),
					'fields' => array(
						'layer_name' => array(
							'name' => 'layer_name',
							'id' => 'layer_name',
							'type' => 'text',
							'class' => '',
							'title' => '<u>' . esc_html__('Basemap', 'waymark') . '</u> ' . esc_html__('Name', 'waymark'),
							'default' => Waymark_Config::get_setting('tiles', 'layers', 'layer_name'),
							'tip' => sprintf(esc_attr__('The Layer Name will appear in a dropdown list shown by the Map when multiple Basemaps have been entered. You can change the default basemap in the shortcode: %s', 'waymark'), '[' . Waymark_Config::get_item('shortcode') . ' map_id=&quot;1234&quot; basemap=&quot;Basemap Name&quot;]'),
							'input_processing' => array(
								'(! empty($param_value)) ? $param_value : "' . esc_html__('Basemap', 'waymark') . ' ' . substr(md5(rand(0, 999999)), 0, 5) . '";', //Fallback
							),
						),
						'layer_url' => array(
							'name' => 'layer_url',
							'id' => 'layer_url',
							'type' => 'text',
							'class' => '',
							'title' => '<span class="waymark-invisible">' . esc_html__('Basemap', 'waymark') . '</span> URL',
							'default' => Waymark_Config::get_setting('tiles', 'layers', 'layer_url'),
							'tip' => sprintf(esc_attr__('Many mapping services support the Slippy Map format. Waymark requires URLs that contain {z} (zoom level) and {x}/{y} (tile coordinates). For example the OpenCycleMap URL is %s.', 'waymark'), 'https://tile.thunderforest.com/cycle/{z}/{x}/{y}@2x.png?apikey=[your_api_key]'),
							'tip_link' => 'https://www.thunderforest.com/docs/map-tiles-api/',
						),
						'layer_attribution' => array(
							'name' => 'layer_attribution',
							'id' => 'layer_attribution',
							'type' => 'text',
							'class' => '',
							'title' => '<span class="waymark-invisible">' . esc_html__('Basemap', 'waymark') . '</span> Attribution',
							'default' => Waymark_Config::get_setting('tiles', 'layers', 'layer_attribution'),
							'tip' => esc_attr__('Mapping services often have the requirement that attribution is displayed by the map. Text and HTML links are supported.', 'waymark'),
							'tip_link' => 'https://www.thunderforest.com/terms/#attribution',
							'input_processing' => array(
								'(! strpos($param_value, "&")) ? htmlspecialchars($param_value) : $param_value',
							),
						),
						'layer_max_zoom' => array(
							'name' => 'layer_max_zoom',
							'id' => 'layer_max_zoom',
							'type' => 'text',
							'class' => 'waymark-short-input',
							'title' => '<span class="waymark-invisible">' . esc_html__('Basemap', 'waymark') . '</span> ' . esc_html__('Max Zoom', 'waymark'),
							'default' => Waymark_Config::get_setting('tiles', 'layers', 'layer_max_zoom'),
							'tip' => esc_attr__('Set a maximum zoom level for this Basemap, the default is 18.', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value) && $param_value >= 1 && $param_value <= 18) ? $param_value : 18;', //Fallback
							),
						),
					),
				),
			),
		);

		/**
		 * ===========================================
		 * ================= MARKERS =================
		 * ===========================================
		 */

		$this->tabs['markers'] = array(
			'name' => esc_html__('Markers', 'waymark'),
			'description' => '',
			'sections' => array(
				'marker_types' => array(
					'repeatable' => true,
					'title' => esc_html__('Marker', 'waymark') . ' ' . esc_html__('Types', 'waymark'),
					'description' => '<span class="waymark-lead">' . __('Customise how Markers are displayed on the Map. Set these styles once, then select the appropriate Type when you add to the Map.', 'waymark') . '</span>',
					'footer' => '<small>' . __('<b>Pro Tip!</b> The first listed will be used as the default. Drag to re-order, remove all to restore defaults.', 'waymark') . '</small>',
					'help' => array(
						'url' => esc_attr(Waymark_Helper::site_url('docs/types')),
						'text' => esc_attr__('Type Docs &raquo;', 'waymark'),
					),
					'fields' => array(
						'marker_title' => array(
							'name' => 'marker_title',
							'id' => 'marker_title',
							'type' => 'text',
							'class' => 'waymark-uneditable',
							'title' => '<u>' . esc_html__('Marker', 'waymark') . '</u> ' . esc_html__('Label', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_title'),
							'tip' => esc_attr__('What kind of Marker is this? E.g. "Photo", "Grocery Store", "Warning!". Once saved, Marker labels can not be edited. The Marker Label is displayed in the Tooltip (when hovering over the Marker) and in the Info Window (once the Marker is clicked). Hide in Settings > Map > Misc. > Type Labels.', 'waymark'),
							'input_processing' => array(
								'(! empty($param_value)) ? $param_value : "' . esc_html__('Marker', 'waymark') . ' ' . substr(md5(rand(0, 999999)), 0, 5) . '";', //Fallback
							),
						),
						'marker_shape' => array(
							'name' => 'marker_shape',
							'id' => 'marker_shape',
							'type' => 'select',
							'class' => '',
							'title' => '<span class="waymark-invisible">' . esc_html__('Marker', 'waymark') . '</span> ' . esc_html__('Shape', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_shape'),
							'tip' => esc_attr__('Which shape of Marker to use. Circles and Squares are centered at the specified location, Markers point down to that location.', 'waymark'),
							'options' => array(
								'marker' => esc_html__('Marker', 'waymark'),
								'circle' => esc_html__('Circle', 'waymark'),
								'rectangle' => esc_html__('Square', 'waymark'),
							),
						),
						'marker_size' => array(
							'name' => 'marker_size',
							'id' => 'marker_size',
							'type' => 'select',
							'class' => '',
							'title' => '<span class="waymark-invisible">' . esc_html__('Marker', 'waymark') . '</span> ' . esc_html__('Size', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_size'),
							'tip' => esc_attr__('Which size of Marker to use.', 'waymark'),
							'options' => array(
								'small' => esc_html__('Small', 'waymark'),
								'medium' => esc_html__('Medium', 'waymark'),
								'large' => esc_html__('Large', 'waymark'),
							),
						),
						'marker_colour' => array(
							'name' => 'marker_colour',
							'id' => 'marker_colour',
							'type' => 'text',
							'class' => 'waymark-short-input',
							'title' => '<span class="waymark-invisible">' . esc_html__('Marker', 'waymark') . '</span> ' . esc_html__('Background', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_colour'),
							'tip' => esc_attr__('The Marker background colour. Click "Select Colour" to select.', 'waymark'),
							'input_processing' => array(
								'(! empty($param_value)) ? $param_value : "white";', //Fallback
							),
						),
						'marker_display' => array(
							'name' => 'marker_display',
							'id' => 'marker_display',
							'type' => 'boolean',
							'title' => '<span class="waymark-invisible">' . esc_html__('Marker', 'waymark') . '</span> ' . esc_html__('Show Initially', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_display'),
							'tip' => esc_attr__('When using the Overlay Filter you can choose to show/hide certain Types when the Map initially loads.', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value)) ? $param_value : 1;', //Fallback
							),
						),
						'marker_submission' => array(
							'name' => 'marker_submission',
							'id' => 'marker_submission',
							'type' => 'boolean',
							'title' => '<span class="waymark-invisible">' . esc_html__('Marker', 'waymark') . '</span> ' . esc_html__('Submissions?', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_submission'),
							'tip' => esc_attr__('Make this Type available in front-end Submissions?', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value)) ? $param_value : 1;', //Fallback
							),
						),
						'icon_type' => array(
							'name' => 'icon_type',
							'id' => 'icon_type',
							'type' => 'select',
							'class' => '',
							'title' => '<span style="display:inline-block;min-width:50px">' . esc_html__('Icon', 'waymark') . '</span>' . esc_html__('Type', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'icon_type'),
							'tip' => esc_attr__('Font Icons are available from Font Awesome and Ionic Icons. Simple Text or Emojis are supported, as well as custom HTML. So you can pretty much use anything you like!', 'waymark'),
							'tip_link' => 'https://emojifinder.com/',
							'options' => array(
								'icon' => esc_html__('Font Icon', 'waymark'),
								'text' => esc_html__('Text (or Emoji!)', 'waymark'),
								'html' => esc_html__('HTML', 'waymark'),
							),
						),
						'marker_icon' => array(
							'name' => 'marker_icon',
							'id' => 'marker_icon',
							'type' => 'text',
							'class' => 'waymark-short-input',
							'title' => '<span class="waymark-invisible" style="display:inline-block;min-width:50px">' . esc_html__('Icon', 'waymark') . '</span><span class="waymark-icon-type">' . esc_html__('Name', 'waymark') . '</span>',
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'marker_icon'),
							'tip' => esc_attr__('The desired icon name from Ionicons or Font Awesome, e.g. "ion-camera", or "fa-camera". Click the links to see the full list of icons available.|Text to display inside the Marker, in the chosen colour. Space is very limited! Pro Tip: adjust text size using CSS; for all Markers: .waymark-icon-text{font-size: 18px}, or by Type: .waymark-marker-photo .waymark-icon-text{...}. Use your browser\'s inspector to dig for Type class names.|The HTML entered will be added inside each Marker. Pro Tip! HTML Entities supported (e.g. &amp;cross; as well as Unicode and Emojis!), or provide HTML to integrate with other Icon providers.', 'waymark'),
							'input_processing' => array(
								'(strpbrk($param_value, "\">")) ? htmlspecialchars($param_value) : $param_value',
							),
							'append' => '<div class="waymark-icons-help"><a href="https://ionic.io/ionicons/v2/cheatsheet.html">Ionic Icons</a><a href="https://fontawesome.com/v4.7.0/cheatsheet/">Font Awesome</a></div>',
						),
						'icon_colour' => array(
							'name' => 'icon_colour',
							'id' => 'icon_colour',
							'type' => 'text',
							'class' => 'waymark-short-input waymark-colour-picker',
							'title' => '<span class="waymark-invisible" style="display:inline-block;min-width:50px">' . esc_html__('Icon', 'waymark') . '</span>' . esc_html__('Colour', 'waymark'),
							'default' => Waymark_Config::get_setting('markers', 'marker_types', 'icon_colour'),
							'tip' => esc_attr__('The colour of the icon. Click "Select Colour" to select.', 'waymark'),
							'input_processing' => array(
								'(! empty($param_value)) ? $param_value : "#81d742";', //Fallback
							),
						),
					),
				),
			),
		);

		/**
		 * ===========================================
		 * ================== LINES ==================
		 * ===========================================
		 */

		$this->tabs['lines'] = array(
			'name' => esc_html__('Lines', 'waymark'),
			'description' => '',
			'sections' => array(
				'line_types' => array(
					'repeatable' => true,
					'title' => esc_html__('Line', 'waymark') . ' ' . esc_html__('Types', 'waymark'),
					'description' => '<span class="waymark-lead">' . __('Customise how Lines are displayed on the Map. Set these styles once, then select the appropriate Type when you add to the Map.', 'waymark') . '</span>',
					'help' => array(
						'url' => esc_attr(Waymark_Helper::site_url('docs/types')),
						'text' => esc_attr__('Type Docs &raquo;', 'waymark'),
					),
					'footer' => '<small>' . __('<b>Pro Tip!</b> The first listed will be used as the default. Drag to re-order, remove all to restore defaults.', 'waymark') . '</small>',
					'fields' => array(
						'line_title' => array(
							'name' => 'line_title',
							'id' => 'line_title',
							'type' => 'text',
							'class' => 'waymark-uneditable',
							'title' => '<u>' . esc_html__('Line', 'waymark') . '</u> ' . esc_html__('Label', 'waymark'),
							'default' => Waymark_Config::get_setting('lines', 'line_types', 'line_title'),
							'tip' => esc_attr__('What kind of Line is this? E.g. "Easy", "Walking Only", "Dark Red". The Line Label is displayed in the Tooltip (when hovering over the Line) and in the Line Info Window. Once saved, Line labels can not be edited.', 'waymark'),
							'input_processing' => array(
								'(! empty($param_value)) ? $param_value : "' . esc_html__('Line', 'waymark') . ' ' . substr(md5(rand(0, 999999)), 0, 5) . '";', //Fallback
							),
						),
						'line_colour' => array(
							'name' => 'line_colour',
							'id' => 'line_colour',
							'type' => 'text',
							'class' => 'waymark-short-input waymark-colour-picker',
							'title' => '<span class="waymark-invisible">' . esc_html__('Line', 'waymark') . '</span> ' . esc_html__('Colour', 'waymark'),
							'default' => Waymark_Config::get_setting('lines', 'line_types', 'line_colour'),
							'tip' => esc_attr__('The colour of the Line. Click "Select Colour" to select.', 'waymark'),
							'input_processing' => array(
								'(! empty($param_value)) ? $param_value : "#81d742";', //Fallback
							),
						),
						'line_weight' => array(
							'name' => 'line_weight',
							'id' => 'line_weight',
							'type' => 'text',
							'class' => 'waymark-short-input',
							'title' => '<span class="waymark-invisible">' . esc_html__('Line', 'waymark') . '</span> ' . esc_html__('Weight', 'waymark'),
							'default' => Waymark_Config::get_setting('lines', 'line_types', 'line_weight'),
							'tip' => esc_attr__('The width of the Line, in pixels.', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value)) ? $param_value : 3;', //Fallback
							),
						),
						'line_opacity' => array(
							'name' => 'line_opacity',
							'id' => 'line_opacity',
							'type' => 'text',
							'class' => 'waymark-short-input',
							'title' => '<span class="waymark-invisible">' . esc_html__('Line', 'waymark') . '</span> ' . esc_html__('Opacity', 'waymark'),
							'default' => Waymark_Config::get_default('lines', 'line_types', 'line_opacity'),
							'tip' => esc_attr__('The opacity of the Line, between 0.0 and 1.0 (e.g. "0.5").', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value) && $param_value > 0 && $param_value <= 1) ? $param_value : 0.7;', //Fallback
							),
						),
						'line_display' => array(
							'name' => 'line_display',
							'id' => 'line_display',
							'type' => 'boolean',
							'title' => '<span class="waymark-invisible">' . esc_html__('Line', 'waymark') . '</span> ' . esc_html__('Show Initially', 'waymark'),
							'default' => Waymark_Config::get_setting('lines', 'line_types', 'line_display'),
							'tip' => esc_attr__('When using the Overlay Filter you can choose to show/hide certain Types when the Map initially loads.', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value)) ? $param_value : 1;', //Fallback
							),
						),
						'line_submission' => array(
							'name' => 'line_submission',
							'id' => 'line_submission',
							'type' => 'boolean',
							'title' => '<span class="waymark-invisible">' . esc_html__('Line', 'waymark') . '</span> ' . esc_html__('Submissions?', 'waymark'),
							'default' => Waymark_Config::get_setting('lines', 'line_types', 'line_submission'),
							'tip' => esc_attr__('Make this Type available in front-end Submissions?', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value)) ? $param_value : 1;', //Fallback
							),
						),
					),
				),
			),
		);

		/**
		 * ===========================================
		 * ================= SHAPES ==================
		 * ===========================================
		 */

		$this->tabs['shapes'] = array(
			'name' => esc_html__('Shapes', 'waymark'),
			'description' => '',
			'sections' => array(
				'shape_types' => array(
					'repeatable' => true,
					'title' => esc_html__('Shape', 'waymark') . ' ' . esc_html__('Types', 'waymark'),
					'description' => '<span class="waymark-lead">' . __('Customise how Shapes are displayed on the Map. Set these styles once, then select the appropriate Type when you add to the Map.', 'waymark') . '</span>',
					'help' => array(
						'url' => esc_attr(Waymark_Helper::site_url('docs/types')),
						'text' => esc_attr__('Type Docs &raquo;', 'waymark'),
					),
					'footer' => '<small>' . __('<b>Pro Tip!</b> The first listed will be used as the default. Drag to re-order, remove all to restore defaults.', 'waymark') . '</small>',
					'fields' => array(
						'shape_title' => array(
							'name' => 'shape_title',
							'id' => 'shape_title',
							'type' => 'text',
							'class' => 'waymark-uneditable',
							'title' => '<u>' . esc_html__('Shape', 'waymark') . '</u> ' . esc_html__('Label', 'waymark'),
							'default' => Waymark_Config::get_setting('shapes', 'shape_types', 'shape_title'),
							'tip' => esc_attr__('What kind of Shape is this? E.g. "Park", "Danger!", "Light Blue". The Shape Label is displayed in the Tooltip (when hovering over the Shape) and in the Shape Info Window. Once saved, Shape labels can not be edited.', 'waymark'),
							'input_processing' => array(
								'(! empty($param_value)) ? $param_value : "' . esc_html__('Shape', 'waymark') . ' ' . substr(md5(rand(0, 999999)), 0, 5) . '";', //Fallback
							),
						),
						'shape_colour' => array(
							'name' => 'shape_colour',
							'id' => 'shape_colour',
							'type' => 'text',
							'class' => 'waymark-short-input waymark-colour-picker',
							'title' => '<span class="waymark-invisible">' . esc_html__('Shape', 'waymark') . '</span> ' . esc_html__('Colour', 'waymark'),
							'default' => Waymark_Config::get_setting('shapes', 'shape_types', 'shape_colour'),
							'tip' => esc_attr__('The colour of the Shape. Click "Select Colour" to select.', 'waymark'),
							'input_processing' => array(
								'(! empty($param_value)) ? $param_value : "#81d742";', //Fallback
							),
						),
						'fill_opacity' => array(
							'name' => 'fill_opacity',
							'id' => 'fill_opacity',
							'type' => 'text',
							'class' => 'waymark-short-input',
							'title' => '<span class="waymark-invisible">' . esc_html__('Shape', 'waymark') . '</span> ' . esc_html__('Fill Opacity', 'waymark'),
							'default' => Waymark_Config::get_setting('shapes', 'shape_types', 'fill_opacity'),
							'tip' => esc_attr__('The opacity of the inside of the shape, between 0.0 and 1.0 (e.g. "0.5").', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value) && $param_value > 0 && $param_value <= 1) ? $param_value : 0.5;', //Fallback
							),
						),
						'shape_display' => array(
							'name' => 'shape_display',
							'id' => 'shape_display',
							'type' => 'boolean',
							'title' => '<span class="waymark-invisible">' . esc_html__('Shape', 'waymark') . '</span> ' . esc_html__('Show Initially', 'waymark'),
							'default' => Waymark_Config::get_setting('shapes', 'shape_types', 'shape_display'),
							'tip' => esc_attr__('When using the Overlay Filter you can choose to show/hide certain Types when the Map initially loads.', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value)) ? $param_value : 1;', //Fallback
							),
						),
						'shape_submission' => array(
							'name' => 'shape_submission',
							'id' => 'shape_submission',
							'type' => 'boolean',
							'title' => '<span class="waymark-invisible">' . esc_html__('Shape', 'waymark') . '</span> ' . esc_html__('Submissions?', 'waymark'),
							'default' => Waymark_Config::get_setting('shapes', 'shape_types', 'shape_submission'),
							'tip' => esc_attr__('Make this Type available in front-end Submissions?', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value)) ? $param_value : 1;', //Fallback
							),
						),
					),
				),
			),
		);

		/**
		 * ===========================================
		 * =================== META ==================
		 * ===========================================
		 */

		$meta_group_options = Waymark_Helper::repeatable_setting_option_array('meta', 'groups', 'group_title');
		$meta_group_options = array_merge(['' => 'None'], $meta_group_options);

		$this->tabs['meta'] = array(
			'name' => esc_html__('Meta', 'waymark'),
			'description' => '',
			'sections' => array(
				'inputs' => array(
					'repeatable' => true,
					'title' => esc_html__('Meta', 'waymark'),
					'description' => '<span class="waymark-lead">' . sprintf(__('Create additional input fields that appear underneath the Map Editor. Any Meta that has been input is displayed on the <a href="%s">Map Details</a> page, and can also be displayed by the Shortcode.', 'waymark'), 'https://www.waymark.dev/map/route-map/') . '</span>',
					'help' => array(
						'url' => esc_attr(Waymark_Helper::site_url('docs/meta')),
						'text' => esc_attr__('Meta Docs &raquo;', 'waymark'),
					),
					'footer' => '<small>' . __('<b>Pro Tip!</b> The first listed will be used as the default. Drag to re-order, remove all to restore defaults.', 'waymark') . '</small>',
					'fields' => array(
						'meta_title' => array(
							'name' => 'meta_title',
							'id' => 'meta_title',
							'type' => 'text',
							'class' => '',
							'title' => '<u>' . esc_html__('Meta', 'waymark') . '</u> ' . esc_html__('Title', 'waymark'),
							'default' => Waymark_Config::get_setting('meta', 'inputs', 'meta_title'),
							'tip' => esc_attr__('The title appears next to the input field.', 'waymark'),
							'class' => Waymark_Config::get_item('meta', 'inputs') ? 'waymark-uneditable' : '',
							'input_processing' => array(
								'(! empty($param_value)) ? $param_value : "' . esc_html__('Meta', 'waymark') . ' ' . substr(md5(rand(0, 999999)), 0, 5) . '";', //Fallback
							),
						),
						'meta_default' => array(
							'name' => 'meta_default',
							'id' => 'meta_default',
							'type' => 'text',
							'class' => '',
							'title' => '<span class="waymark-invisible">' . esc_html__('Meta', 'waymark') . '</span> ' . esc_html__('Default', 'waymark'),
							'default' => Waymark_Config::get_setting('meta', 'inputs', 'meta_default'),
							'tip' => esc_attr__('The default value for the input field. For Select and Multi-Select enter the option/comma-separated options to be selected by default.', 'waymark'),
						),
						'meta_tip' => array(
							'name' => 'meta_tip',
							'id' => 'meta_tip',
							'type' => 'text',
							'class' => '',
							'title' => '<span class="waymark-invisible">' . esc_html__('Meta', 'waymark') . '</span> ' . esc_html__('Tip', 'waymark'),
							'default' => Waymark_Config::get_setting('meta', 'inputs', 'meta_tip'),
							'tip' => esc_attr__('A tip provides additional information about an input field... just like this!', 'waymark'),
						),
						'meta_type' => array(
							'name' => 'meta_type',
							'id' => 'meta_type',
							'type' => 'select',
							'class' => '',
							'title' => '<span class="waymark-invisible">' . esc_html__('Meta', 'waymark') . '</span> ' . esc_html__('Type', 'waymark'),
							'default' => Waymark_Config::get_setting('meta', 'inputs', 'meta_type'),
							'tip' => esc_attr__('The type of input field to use.', 'waymark'),
							'options' => array(
								'text' => esc_html__('Text', 'waymark'),
								'textarea' => esc_html__('Textarea', 'waymark'),
								'textarea_rich' => esc_html__('Rich Text', 'waymark'),
								'select' => esc_html__('Select', 'waymark'),
								'select_multi' => esc_html__('Multi-Select', 'waymark'),
							),
						),
						'meta_options' => array(
							'name' => 'meta_options',
							'id' => 'meta_options',
							'type' => 'text',
							'class' => '',
							'title' => '<span class="waymark-invisible">' . esc_html__('Meta', 'waymark') . '</span> ' . esc_html__('Options', 'waymark'),
							'default' => Waymark_Config::get_setting('meta', 'inputs', 'meta_options'),
							'tip' => esc_attr__('A comma-separated list of options for the input.', 'waymark'),
						),
						'meta_group' => array(
							'name' => 'meta_group',
							'id' => 'meta_group',
							'type' => 'select',
							'options' => $meta_group_options,
							'class' => (sizeof($meta_group_options) === 1) ? 'waymark-hidden' : '',
							'title' => '<span class="waymark-invisible">' . esc_html__('Meta', 'waymark') . '</span> ' . esc_html__('Group', 'waymark'),
							'default' => Waymark_Config::get_setting('meta', 'inputs', 'meta_group'),
							'tip' => esc_attr__('Which group this Meta belongs to (if any). Meta in the same group will be displayed together when editing and viewing Maps. Meta not in a group will be displayed above any groups.', 'waymark'),
						),
						'meta_shortcode' => array(
							'name' => 'meta_shortcode',
							'id' => 'meta_shortcode',
							'type' => 'boolean',
							'class' => '',
							'title' => '<span class="waymark-invisible">' . esc_html__('Meta', 'waymark') . '</span> ' . esc_html__('In Shortcode?', 'waymark'),
							'default' => Waymark_Config::get_setting('meta', 'inputs', 'meta_shortcode'),
							'tip' => esc_attr__('Whether this content should be displayed when embedding a Map using the Shortcode.', 'waymark'),
						),
						'meta_submission' => array(
							'name' => 'meta_submission',
							'id' => 'meta_submission',
							'type' => 'boolean',
							'class' => '',
							'title' => '<span class="waymark-invisible">' . esc_html__('Meta', 'waymark') . '</span> ' . esc_html__('In Submissions?', 'waymark'),
							'default' => Waymark_Config::get_setting('meta', 'inputs', 'meta_submission'),
							'tip' => esc_attr__('Make this Meta available in front-end Submissions?', 'waymark'),
						),
					),
				),
				'groups' => array(
					'repeatable' => true,
					'title' => esc_html__('Groups', 'waymark'),
					'description' => '<span class="waymark-lead">' . __('Create groups to organise your Map Meta. Meta in the same group will be displayed together when editing and viewing Maps.', 'waymark') . '</span>',
					'footer' => '<small>' . __('<b>Pro Tip!</b> Drag to re-order, remove all to disable groups.', 'waymark') . '</small>',
					'fields' => array(
						'group_title' => array(
							'name' => 'group_title',
							'id' => 'group_title',
							'type' => 'text',
							'class' => '',
							'title' => '<u>' . esc_html__('Group', 'waymark') . '</u> ' . esc_html__('Title', 'waymark'),
							'default' => '',
							'tip' => esc_attr__('The title appears above the Meta in that group.', 'waymark'),
// 							'class' => Waymark_Config::get_item('meta', 'inputs') ? 'waymark-uneditable' : '',
// 							'input_processing' => array(
// 								'(! empty($param_value)) ? $param_value : "' . esc_html__('Meta', 'waymark') . ' ' . substr(md5(rand(0,999999)), 0, 5) . '";'	//Fallback
// 							)
						),
					),
				),
			),
		);

		//Prepare Basemap values for editor option
		$tile_layers = Waymark_Config::get_item('tiles', 'layers', true);

		//Each layer
		$basemap_options = array();
		foreach ($tile_layers as $layer) {
			//If name exists
			if (array_key_exists('layer_name', $layer)) {
				//Add as option
				$basemap_options[$layer['layer_name']] = $layer['layer_name'];
			}
		}

		/**
		 * ===========================================
		 * =============== SUBMISSIONS ===============
		 * ===========================================
		 */

		//Build list of Collections to use as <select> options
		$collection_objects = get_terms([
			'taxonomy' => 'waymark_collection',
			'hide_empty' => false,
		]);
		$collection_array = [
			'' => ' - ',
		];
		foreach ($collection_objects as $collection) {
			$collection_array[$collection->term_id] = $collection->name;
		}

		//Roles
		if (!function_exists('get_editable_roles')) {
			require_once ABSPATH . 'wp-admin/includes/user.php';
		}

		$role_options = array();
		foreach (get_editable_roles() as $key => $role) {
			$role_options[$key] = $role['name'];
		}
		unset($role_options['administrator']);

		//Public upload dir
		$upload_dir = wp_upload_dir();
		$upload_dir['subdir'] = ($upload_dir['subdir']) ? $upload_dir['subdir'] : '/';

		$this->tabs['submission'] = array(
			'name' => esc_html__('Submissions', 'waymark'),
			'sections' => array(
				//Global
				'global' => array(
					'title' => esc_html__('Front-End Submissions', 'waymark'),
					'description' => sprintf(__('Use the %s Shortcode to allow Map submissions from the front-end of your site.', 'waymark'), '<span class="waymark-code">[Waymark content="submission"]</span>'),
					'help' => array(
						'url' => esc_attr(Waymark_Helper::site_url('docs/submissions')),
						'text' => esc_attr__('Submission Docs &raquo;', 'waymark'),
					),
					'fields' => array(
						'submission_enable' => array(
							'name' => 'submission_enable',
							'id' => 'submission_enable',
							'type' => 'boolean',
							'title' => esc_html__('Allow Submissions', 'waymark'),
							'default' => Waymark_Config::get_setting('submission', 'global', 'submission_enable'),
							'tip' => esc_attr__('Submissions will be available only to site administrators by default, but can also be allowed for registered users or even to guests without registration.', 'waymark'),
						),
					),
				),
				//By role
				'from_users' => array(
					'title' => esc_html__('User Submissions', 'waymark'),
					'description' => esc_html__('Allow registered users to create Maps from the front-end.', 'waymark'),
					'fields' => array(
						'submission_roles' => array(
							'name' => 'submission_roles',
							'id' => 'submission_roles',
							'type' => 'select_multi',
							'class' => 'waymark-align-top',
							'title' => esc_html__('Allow From', 'waymark'),
							'default' => Waymark_Config::get_setting('submission', 'from_users', 'submission_roles'),
							'tip' => esc_attr__('Users with the selected roles will be able to make Submissions through the front-end', 'waymark'),
							'options' => $role_options,
						),
						'submission_features' => array(
							'name' => 'submission_features',
							'id' => 'submission_users_features',
							'type' => 'select_multi',
							'class' => 'waymark-align-top',
							'title' => esc_html__('Editor Features', 'waymark'),
							'default' => Waymark_Config::get_setting('submission', 'from_users', 'submission_features'),
							'tip' => esc_attr__('What features to offer in the Editor. Important! Uploaded images are added to the Media Library, reading from file does not keep a copy of the file on the server. Whether an individual Meta input is displayed can be set in the Settings > Map > Meta.', 'waymark'),
							'options' => array(
								'draw' => esc_attr__('Drawing', 'waymark'),
								'photo' => esc_attr__('Image upload', 'waymark'),
								'file' => esc_attr__('Read from File', 'waymark'),
								'title' => esc_attr__('Title', 'waymark'),
								'meta' => esc_attr__('Meta', 'waymark'),
							),
						),
						'submission_status' => array(
							'name' => 'submission_status',
							'id' => 'submission_users_status',
							'type' => 'select',
							'title' => esc_html__('Default Status', 'waymark'),
							'default' => Waymark_Config::get_setting('submission', 'from_users', 'submission_status'),
							'tip' => esc_attr__('This is the initial status of the submitted Map. Note! Publish means that the Map (including any images added) will be *immediately* visible on your site.', 'waymark'),
							'options' => array(
								'publish' => esc_attr__('Publish', 'waymark'),
								'draft' => esc_attr__('Draft', 'waymark'),
							),
						),
						'submission_collection' => array(
							'name' => 'submission_collection',
							'id' => 'submission_users_collection',
							'type' => 'select',
							'title' => esc_html__('Default Collection', 'waymark'),
							'tip' => esc_attr__('If specified, user submissions will be automatically added to this Collection.', 'waymark'),
							'options' => $collection_array,
						),
// 						'submission_alert' => array(
// 							'name' => 'submission_alert',
// 							'id' => 'submission_users_alert',
// 							'type' => 'boolean',
// 							'title' => esc_html__('Email Alert', 'waymark'),
// 							'default' => Waymark_Config::get_setting('submission', 'from_users', 'submission_alert'),
// 							'tip' => esc_attr__('Receive email alerts for new submissions.', 'waymark'),
// 							'class' => 'waymark-hidden'
// 						)
					),
				),

				//Public
				'from_public' => array(
					'title' => esc_html__('Public Submissions', 'waymark'),
					'description' => __('This will allow Submissions from <b>any visitor</b>, without registration.<!--<br /><br /><b>Important!</b>-->', 'waymark'),
					'fields' => array(
						'submission_public' => array(
							'name' => 'submission_public',
							'id' => 'submission_public',
							'type' => 'boolean',
							'title' => esc_html__('Public Submissions', 'waymark'),
							'default' => Waymark_Config::get_setting('submission', 'from_public', 'submission_public'),
							'tip' => esc_attr__('Allow *anyone* to submit Maps to your site, without registration.', 'waymark'),
						),
						'submission_features' => array(
							'name' => 'submission_features',
							'id' => 'submission_public_features',
							'type' => 'select_multi',
							'class' => 'waymark-align-top',
							'title' => esc_html__('Editor Features', 'waymark'),
							'default' => Waymark_Config::get_setting('submission', 'from_public', 'submission_features'),
							'tip' => esc_attr__('What features to offer in the Editor. Important! Uploaded images are added to the Media Library (see Upload Location below), reading from file does not keep a copy of the file on the server. Whether an individual Meta input is displayed can be set in the Settings > Map > Meta.', 'waymark'),
							'options' => array(
								'draw' => esc_attr__('Drawing', 'waymark'),
								'photo' => esc_attr__('Image upload', 'waymark'),
								'file' => esc_attr__('Read from File', 'waymark'),
								'title' => esc_attr__('Title', 'waymark'),
								'meta' => esc_attr__('Meta', 'waymark'),
							),
						),
						'submission_upload_dir' => array(
							'name' => 'submission_upload_dir',
							'id' => 'submission_upload_dir',
							'type' => 'select',
							'title' => esc_html__('Upload Location', 'waymark'),
							'default' => Waymark_Config::get_setting('submission', 'from_public', 'submission_upload_dir'),
							'tip' => esc_attr__('Images upload by non-registered users can be stored seperately from other Media Library uploads, to aid with moderation. All uploaded images will be stored in a single directory (/waymark_submission) found in the upload root.', 'waymark'),
							'class' => '',
							'options' => array(
								'waymark_submission' => esc_attr__('Seperated (/waymark_submission)', 'waymark'),
								'' => sprintf(esc_attr__('Media Library Default (%s)', 'waymark'), $upload_dir['subdir']),
							),
						),
						'submission_status' => array(
							'name' => 'submission_status',
							'id' => 'submission_public_status',
							'type' => 'select',
							'title' => esc_html__('Default Status', 'waymark'),
							'default' => Waymark_Config::get_setting('submission', 'from_public', 'submission_status'),
							'tip' => esc_attr__('This is the initial status of the submitted Map. Note! Publish means that the Map (including any images added) will be *immediately* visible on your site.', 'waymark'),
							'options' => array(
								'draft' => esc_attr__('Draft', 'waymark'),
								'publish' => esc_attr__('Publish (not recommended!)', 'waymark'),
							),
							'class' => '',
						),
						'submission_collection' => array(
							'name' => 'submission_collection',
							'id' => 'submission_public_collection',
							'type' => 'select',
							'title' => esc_html__('Default Collection', 'waymark'),
							'tip' => esc_attr__('If specified, user submissions will be automatically added to this Collection.', 'waymark'),
							'options' => $collection_array,
						),
// 						'submission_alert' => array(
// 							'name' => 'submission_alert',
// 							'id' => 'submission_public_alert',
// 							'type' => 'boolean',
// 							'title' => esc_html__('Email Alert', 'waymark'),
// 							'default' => Waymark_Config::get_setting('submission', 'from_public', 'submission_alert'),
// 							'tip' => esc_attr__('Receive email alerts for new submissions.', 'waymark'),
// 							'class' => 'waymark-hidden'
// 						),
					),
				),
			),
		);

		//Submissions not enabled
		if (!Waymark_Config::get_setting('submission', 'global', 'submission_enable')) {
			//Hide related inputs
			$this->tabs['meta']['sections']['inputs']['fields']['meta_submission']['class'] = ' waymark-hidden';

			$this->tabs['markers']['sections']['marker_types']['fields']['marker_submission']['class'] = 'waymark-hidden';
			$this->tabs['lines']['sections']['line_types']['fields']['line_submission']['class'] = 'waymark-hidden';
			$this->tabs['shapes']['sections']['shape_types']['fields']['shape_submission']['class'] = 'waymark-hidden';

			$this->tabs['submission']['sections']['from_users']['class'] = 'waymark-hidden';
			$this->tabs['submission']['sections']['from_public']['class'] = 'waymark-hidden';
			//If No public submissions
		} elseif (!Waymark_Config::get_setting('submission', 'from_public', 'submission_public')) {
			//Hide settings
			$this->tabs['submission']['sections']['from_public']['fields']['submission_features']['class'] = ' waymark-hidden';
			$this->tabs['submission']['sections']['from_public']['fields']['submission_status']['class'] = ' waymark-hidden';
// 			$this->tabs['submission']['sections']['from_public']['fields']['submission_alert']['class'] .= ' waymark-hidden';
			$this->tabs['submission']['sections']['from_public']['fields']['submission_upload_dir']['class'] = ' waymark-hidden';
			$this->tabs['submission']['sections']['from_public']['fields']['submission_collection']['class'] = ' waymark-hidden';
		}

		/**
		 * ===========================================
		 * ================== MISC ===================
		 * ===========================================
		 */

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

				//Interaction

				//Sleep
				'interaction_options' => array(
					'title' => esc_html__('Sleep Options', 'waymark'),
					'description' => sprintf(__('Waymark Maps will zoom when the user scrolls. This can cause some unexpected/annoying behaviour when scrolling a page.<br /><br /><b>Sleeping</b> the Map initially and <b>Waking</b> upon user interaction (i.e. hovering/clicking/tapping) may create a better experience.', 'waymark'), Waymark_Config::get_default('misc', 'interaction_options', 'delay_seconds')),
					'fields' => array(
						'delay_seconds' => array(
							'name' => 'delay_seconds',
							'id' => 'delay_seconds',
							'type' => 'text',
							'class' => 'waymark-short-input',
							'title' => esc_html__('Hover Wake Time', 'waymark'),
							'append' => esc_html__('Seconds', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'interaction_options', 'delay_seconds'),
							'tip' => esc_attr__('How many seconds before scroll zoom is enabled. 0 seconds will mean no delay (disabling this feature). A large number of seconds like 3600 (an hour) will esentially *disable hover to wake*, meaning the user will need to *click* to wake.', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value)) ? $param_value : ' . Waymark_Config::get_default('misc', 'interaction_options', 'delay_seconds') . ';', //Fallback
							),
						),
						'do_message' => array(
							'name' => 'do_message',
							'id' => 'do_message',
							'type' => 'boolean',
							'title' => esc_html__('Display Message', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'interaction_options', 'do_message'),
							'tip' => esc_attr__('This message will be displayed by the Map while scroll zoom is disabled.', 'waymark'),
						),
						'wake_message' => array(
							'name' => 'wake_message',
							'id' => 'wake_message',
							'type' => 'text',
							'title' => '<span class="waymark-invisible">' . esc_html__('Display', 'waymark') . ' </span> ' . esc_html__('Message Text', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'interaction_options', 'wake_message'),
						),
					),
				),

				// Cluster

				'cluster_options' => array(
					'title' => esc_html__('Cluster Options', 'waymark'),
					'description' => sprintf(__('With Clustering enabled, Markers will be grouped together when they are close together. This can help to reduce clutter on the Map.', 'waymark'), Waymark_Config::get_default('misc', 'cluster_options', 'cluster_threshold')),
					'help' => array(
						'url' => esc_attr(Waymark_Helper::site_url('docs/marker-clustering')),
						'text' => esc_attr__('Clustering Docs &raquo;', 'waymark'),
					),
					'fields' => array(
						'show_cluster' => array(
							'name' => 'show_cluster',
							'id' => 'show_cluster',
							'type' => 'boolean',
							'options' => array(
								'1' => esc_html__('Enabled', 'waymark'),
								'0' => esc_html__('Disabled', 'waymark'),
							),

							'title' => esc_html__('Marker Clustering', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'cluster_options', 'show_cluster'),
							'tip' => esc_attr__('Whether to cluster (stack) Markers that are close together. Pro Tip! This will affect all Maps, but you can also enable/disable clustering through the Shortcode: [Waymark show_cluster="0"]', 'waymark'),
						),
						'cluster_threshold' => array(
							'name' => 'cluster_threshold',
							'id' => 'cluster_threshold',
							'type' => 'text',
							'class' => 'waymark-short-input',
							'title' => esc_html__('Cluster Threshold', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'cluster_options', 'cluster_threshold'),
							'tip' => esc_attr__('Markers will not be clustered above this zoom level.', 'waymark'),
							'input_processing' => array(
								'(is_numeric($param_value)) ? $param_value : ' . Waymark_Config::get_default('misc', 'cluster_options', 'cluster_threshold') . ';', //Fallback
							),
						),
						'cluster_radius' => array(
							'name' => 'cluster_radius',
							'id' => 'cluster_radius',
							'type' => 'text',
							'class' => 'waymark-short-input',
							'title' => '<span class="waymark-invisible">' . esc_html__('Cluster', 'waymark') . ' </span> ' . esc_html__('Radius', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'cluster_options', 'cluster_radius'),
							'tip' => esc_attr__('The maximum radius that a cluster will cover from the central marker (in pixels). Decreasing will make more, smaller clusters.	Default 80.', 'waymark'),

							'input_processing' => array(
								'(is_numeric($param_value)) ? $param_value : ' . Waymark_Config::get_default('misc', 'cluster_options', 'cluster_radius') . ';', //Fallback
							),
						),
					),
				),

				//Collections

				'collection_options' => array(
					'title' => esc_html__('Collection Options', 'waymark'),
					'description' => esc_html__('How Collections are displayed.', 'waymark'),
					'help' => array(
						'url' => esc_attr(Waymark_Helper::site_url('docs/collections')),
						'text' => esc_attr__('Collection Docs &raquo;', 'waymark'),
					),
					'fields' => array(
						'link_to_maps' => array(
							'name' => 'link_to_maps',
							'id' => 'link_to_maps',
							'type' => 'boolean',
							'title' => esc_html__('Link to Maps', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'collection_options', 'link_to_maps'),
							'tip' => esc_attr__('Whether to display a link to the individual Map Details page when clicking on a Marker/Line/Shape displayed by the Collection.', 'waymark'),
						),
						'link_from_maps' => array(
							'name' => 'link_from_maps',
							'id' => 'link_from_maps',
							'type' => 'boolean',
							'title' => esc_html__('Link from Maps', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'collection_options', 'link_from_maps'),
							'tip' => esc_attr__('Whether to display a link to the Collection(s) that a Map belongs to on the Map Details page.', 'waymark'),
						),
						'load_method' => array(
							'name' => 'load_method',
							'id' => 'load_method',
							'type' => 'select',
							'options' => [
								'fetch' => esc_html__('Background', 'waymark'),
								'embed' => esc_html__('Embed', 'waymark'),
							],
							'class' => 'waymark-short-input',
							'title' => esc_html__('Shortcode Method', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'collection_options', 'load_method'),
							'tip' => esc_attr__('Whether to load multiple Maps in the Background (uses AJAX to improve page load) when embedding with the Shortcode, or to Embed them within the page. Embedding may be a bad idea for LARGE COLLECTIONS, but can resolve some issues where Collections are not displaying correctly.', 'waymark'),
						),
					),
				),

				//Shortcode

				'shortcode_options' => array(
					'title' => esc_html__('Shortcode Options', 'waymark'),
					'description' => esc_html__('How Maps are embedded into your content using the shortcode.', 'waymark'),
					'help' => array(
						'url' => esc_attr(Waymark_Helper::site_url('docs/shortcodes')),
						'text' => esc_attr__('Shortcode Docs &raquo;', 'waymark'),
					),
					'fields' => array(
						'shortcode_header' => array(
							'name' => 'shortcode_header',
							'id' => 'shortcode_header',
							'type' => 'select',
							'title' => esc_html__('Shortcode Header', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'shortcode_options', 'shortcode_header'),
							'tip' => sprintf(esc_attr__('The shortcode header displays the title and link to the Map or Collection. Pro Tip! This will affect all shortcodes, but you can override the setting through the shortcode: %s (the value must be either 0 or 1).', 'waymark'), '[' . Waymark_Config::get_item('shortcode') . ' map_id=&quot;1234&quot; shortcode_header=&quot;' . Waymark_Config::get_setting('misc', 'shortcode_options', 'shortcode_header') . '&quot;]'),
							'options' => array(
								'1' => esc_html__('Show', 'waymark'),
								'0' => esc_html__('Hide', 'waymark'),
							),
						),
						'header_override' => array(
							'name' => 'header_override',
							'id' => 'header_override',
							'type' => 'select',
							'title' => esc_html__('Header for Admin', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'shortcode_options', 'header_override'),
							'tip' => esc_attr__('Use this Setting to always show the Shortcode Header when signed in as admin, useful for quickly navigating to embeded Maps.', 'waymark'),
							'options' => array(
								'0' => esc_html__('Use Setting', 'waymark'),
								'1' => esc_html__('Always Show', 'waymark'),
							),
						),
					),
				),

				//Elevation

				'elevation_options' => array(
					'title' => esc_html__('Elevation Options', 'waymark'),
					'description' => esc_html__('Lines with elevation data.', 'waymark'),
					'help' => array(
						'url' => esc_attr(Waymark_Helper::site_url('docs/elevation-profile-colours')),
						'text' => esc_attr__('Elevation Styling &raquo;', 'waymark'),
					),
					'fields' => array(
						'show_elevation' => array(
							'name' => 'show_elevation',
							'id' => 'show_elevation',
							'type' => 'select',
							'title' => esc_html__('Elevation Profile', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'elevation_options', 'show_elevation'),
							'tip' => sprintf(esc_attr__('Display an interactive elevation profile graph below the Map for Lines that have elevation data. Pro Tip! You can choose to show/hide the elevation graph of an individual Map through the shortcode: %s', 'waymark'), '[' . Waymark_Config::get_item('shortcode') . ' map_id=&quot;1234&quot; show_elevation=&quot;1&quot;]'),
							'options' => array(
								'2' => esc_html__('Show on Map Details', 'waymark'),
								'1' => esc_html__('Show everywhere', 'waymark'),
								'0' => esc_html__('Hide everywhere', 'waymark'),
							),
						),
						'elevation_units' => array(
							'name' => 'elevation_units',
							'id' => 'elevation_units',
							'type' => 'select',
							'title' => esc_html__('Elevation Units', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'elevation_options', 'elevation_units'),
							'tip' => sprintf(esc_attr__('Display elevation data in metric (m/km) or imperial (ft/mi) units.', 'waymark')),
							'options' => array(
								'metric' => esc_html__('Metric (m/km)', 'waymark'),
								'imperial' => esc_html__('Imperial (ft/mi)', 'waymark'),
							),
						),
						'elevation_colour' => array(
							'name' => 'elevation_colour',
							'id' => 'elevation_colour',
							'type' => 'text',
							'class' => 'waymark-short-input waymark-colour-picker',
							'title' => esc_html__('Elevation Colour', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'elevation_options', 'elevation_colour'),
							'tip' => sprintf(esc_attr__('The colour of the elevation graph and associated Line.', 'waymark')),
							'input_processing' => array(
								'(! empty($param_value)) ? $param_value : "#b42714";', //Fallback
							),
						),
						'elevation_initial' => array(
							'name' => 'elevation_initial',
							'id' => 'elevation_initial',
							'type' => 'boolean',
							'title' => esc_html__('Show Initially?', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'elevation_options', 'elevation_initial'),
							'tip' => sprintf(esc_attr__('Whether to show the elevation profile when the Map loads. If set to No, the user must click on a Line in order to display the elevation data. If there are multiple Lines with elevation data, the one added to the editor first will be the one shown initially.', 'waymark')),
						),
					),
				),

				//Editor

				'editor_options' => array(
					'title' => esc_html__('Editor Options', 'waymark'),
					'description' => esc_html__('Customising the Map Editor.', 'waymark'),
					'help' => array(
						'url' => esc_attr(Waymark_Helper::site_url('docs/editor')),
						'text' => esc_attr__('Editor Docs &raquo;', 'waymark'),
					),
					'fields' => array(
						'confirm_delete' => array(
							'name' => 'confirm_delete',
							'id' => 'confirm_delete',
							'type' => 'boolean',
							'title' => esc_html__('Confirm Delete?', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'editor_options', 'confirm_delete'),
							'tip' => esc_attr__('Whether to show a confirmation dialog before deleting Markers/Lines/Shapes from the Map. Pro Tip! Even if you accidentally delete something, changes are not saved until the "Update" button is clicked.', 'waymark'),
						),
						'editor_basemap' => array(
							'name' => 'editor_basemap',
							'id' => 'editor_basemap',
							'type' => 'select',
							'title' => esc_html__('Default Basemap', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'editor_options', 'editor_basemap'),
							'tip' => esc_attr__('Which Basemap to use as the editor default.', 'waymark'),
							'options' => $basemap_options,
						),
					),
				),

				//Advanced
				'permalinks' => array(
					'title' => esc_html__('Permalinks', 'waymark'),
					'description' => 'Customise your Map and Collection URLs.',
					'footer' => '<small>For the changes to take affect you must rebuild your Permalinks by going to WP Settings > Permalinks and clicking "Save Changes".</small>',
					'fields' => array(
						'permalink_slug_map' => array(
							'name' => 'permalink_slug_map',
							'id' => 'permalink_slug_map',
							'type' => 'text',
							'class' => 'waymark-short-input',
							'title' => esc_html__('Map Slug', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'permalinks', 'permalink_slug_map'),
							'tip' => esc_attr__('The URL slug that will be used for links to your Maps, i.e. example.com/[map-slug]/example-map/. Only alpha-numeric characters and hyphens (-) are allowed.', 'waymark'),
							'input_processing' => array(
								'preg_replace("/[^0-9a-z-]+/", "", $param_value);',
							),
							'prepend' => '<small>/</small>',
							'append' => '<small>/map-name/</small>',
						),
						'permalink_slug_collection' => array(
							'name' => 'permalink_slug_collection',
							'id' => 'permalink_slug_collection',
							'type' => 'text',
							'class' => 'waymark-short-input',
							'title' => esc_html__('Collection Slug', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'permalinks', 'permalink_slug_collection'),
							'tip' => esc_attr__('The URL slug that will be used for links to your Collections, i.e. example.com/[collection-slug]/example-collection/. Only alpha-numeric characters and hyphens (-) are allowed.', 'waymark'),
							'input_processing' => array(
								'preg_replace("/[^0-9a-z-]+/", "", $param_value);',
							),
							'prepend' => '<small>/</small>',
							'append' => '<small>/collection-name/</small>',
						),
					),
				),

				//Advanced
				'advanced' => array(
					'title' => esc_html__('Debug', 'waymark'),
					'description' => '',
					'fields' => array(
						'debug_mode' => array(
							'name' => 'debug_mode',
							'id' => 'debug_mode',
							'type' => 'boolean',
							'title' => esc_html__('Debug Mode', 'waymark'),
							'default' => Waymark_Config::get_setting('misc', 'advanced', 'debug_mode'),
							'tip' => esc_attr__('With debug mode enabled, the plugin will output Map and Settings data in Admin Dashboard. This may come in handy if you need to report a bug. Pro Tip! Check the browser console for Waymark output when signed in as an administrator.', 'waymark'),
							'tip_link' => 'https://www.waymark.dev/docs/debug-mode/',
							'options' => array(
								'0' => esc_html__('Disable', 'waymark'),
								'1' => esc_html__('Enable', 'waymark'),
							),
						),
					),
				),
			),
		);

		//Debug?
		if (Waymark_Helper::is_debug()) {
			$this->tabs['misc']['sections']['advanced']['fields']['settings_output'] = [
				'name' => 'settings_output',
				'id' => 'settings_output',
				'type' => 'textarea',
				'class' => 'waymark-align-top',
				'title' => esc_html__('Settings Data', 'waymark'),
				'default' => serialize(get_option('Waymark_Settings')),
				//Don't save to DB
				'input_processing' => array(
					'null',
				),
				//Don't allow editing
				'output_processing' => array(
					'serialize(get_option("Waymark_Settings"))',
				),
			];
		}
```
