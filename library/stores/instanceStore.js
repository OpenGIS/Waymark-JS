import { ref, shallowRef, computed } from "vue";
import { defineStore } from "pinia";
import L from "leaflet";
import { getTypeData, getImageURLs } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

export const useInstanceStore = defineStore("instance", () => {
	// DOM Target
	let containerId = ref(null);
	let container = null;

	// Config
	const config = shallowRef({
		map_options: {},
	});

	// State
	const state = ref({});

	// Default Tile Layer
	const tileLayers = ref([]);
	const activeTileLayer = ref(null);

	// Data
	// const geoJSON = shallowRef({});

	let map = shallowRef(null);

	const overlays = ref([]);
	const visibleOverlays = ref([]);
	const activeOverlay = ref({});

	const activePanel = ref("overlays");
	const panelOpen = ref(true);

	const width = ref(0);
	const height = ref(0);

	function createStore(instanceConfig = {}) {
		if (instanceConfig.geoJSON) {
			state.value.geoJSON = instanceConfig.geoJSON;
		}

		// Check for config
		if (typeof instanceConfig.map_options === "object") {
			config.value.map_options = instanceConfig.map_options;

			if (typeof instanceConfig.map_options.div_id === "string") {
				// Get DOM Element
				container = document.getElementById(instanceConfig.map_options.div_id);

				// Inital Dimensions
				const getDimensions = () => {
					width.value = container.clientWidth;
					height.value = container.clientHeight;
				};
				getDimensions();

				// Resize Event
				window.addEventListener("resize", getDimensions);
			} else {
				console.error("No map_options.div_id provided");
			}
		}
	}

	function storeMap(mapInstance) {
		map.value = mapInstance;

		map.value
			.on("zoomend", updateVisibleOverlays)
			.on("moveend", updateVisibleOverlays);
	}

	function updateTileLayer(layer) {
		activeTileLayer.value = layer;

		// Remove all layers
		tileLayers.value.forEach((layer) => {
			map.value.removeLayer(layer.layer);
		});

		// Add active layer
		layer.layer.addTo(map.value);
	}

	function togglePanel() {
		panelOpen.value = !panelOpen.value;
	}

	function setActivePanel(panel = "overlays") {
		activePanel.value = panel;
		panelOpen.value = true;
	}

	function highlightOverlay(overlay = {}, highlight = true) {
		switch (overlay.featureType) {
			case "marker":
				if (highlight) {
					overlay.layer.getElement().classList.add("overlay-highlight");
				} else {
					overlay.layer.getElement().classList.remove("overlay-highlight");
				}

				break;

			case "line":
				if (highlight) {
					overlay.layer.setStyle({
						weight: 6,
					});
				} else {
					overlay.layer.setStyle({
						weight: overlay.typeData.line_weight,
					});
				}

				break;
		}
	}

	function setActiveOverlay(overlay) {
		setActivePanel("overlays");

		// Remove all other highlights
		overlays.value.forEach((overlay) => {
			highlightOverlay(overlay, false);
		});

		// Highlight overlay
		highlightOverlay(overlay, true);

		//Overlay already open
		if (activeOverlay.value && activeOverlay.value.id == overlay.id) {
			//Focus On
			setFocus(overlay);

			//Switching Overlay
		} else {
			activeOverlay.value = overlay;
		}
	}

	function storeMarker(marker, feature) {
		let featureType = "marker";
		let typeKey = makeKey(feature.properties.type);

		const markerElement = marker.getElement();

		let overlay = {
			id: overlays.value.length + 1,
			typeKey: typeKey,
			typeData: getTypeData(featureType, typeKey),
			feature: feature,
			layer: marker,
			featureType: featureType,
			element: markerElement,
			imageURLs: getImageURLs(feature.properties),
		};

		//Add Events
		markerElement.addEventListener("click", () => {
			setActiveOverlay(overlay);
		});

		markerElement.addEventListener("mouseenter", () => {
			highlightOverlay(overlay, true);
		});

		markerElement.addEventListener("mouseleave", () => {
			// If not active Overlay
			// if (activeOverlay.value.id != overlay.id) {
			highlightOverlay(overlay, false);
			// }
		});

		overlays.value.push(overlay);

		return overlay;
	}

	function storeLine(line, feature) {
		let featureType = "line";
		let typeKey = makeKey(feature.properties.type);

		const lineElement = line.getElement();

		let overlay = {
			id: overlays.value.length + 1,
			typeKey: typeKey,
			typeData: getTypeData(featureType, typeKey),
			feature: feature,
			layer: line,
			featureType: featureType,
			element: lineElement,
			imageURLs: getImageURLs(feature.properties),
		};

		// Add events

		lineElement.addEventListener("click", () => {
			setActiveOverlay(overlay);
		});

		lineElement.addEventListener("mouseenter", () => {
			highlightOverlay(overlay, true);
		});

		lineElement.addEventListener("mouseleave", () => {
			highlightOverlay(overlay, false);
		});

		overlays.value.push(overlay);

		return overlay;
	}

	function storeTileLayer(layer, data) {
		let tileLayer = {
			id: overlays.value.length + 1,
			layer: layer,
			url: data.layer_url,
			attribution: data.layer_attribution,
			maxZoom: data.layer_max_zoom,
			name: data.layer_name,
		};

		tileLayers.value.push(tileLayer);
	}

	function setFocus(overlay = {}) {
		switch (overlay.featureType) {
			case "marker":
				map.value.flyTo(overlay.layer.getLatLng());
				break;

			case "line":
				// Set to bounds of Line
				const bounds = new L.latLngBounds();

				overlay.layer.getLatLngs().forEach((coords) => {
					bounds.extend(coords);
				});

				// Zoom to bounds
				map.value.fitBounds(bounds, {
					padding: [30, 30],
					animate: true,
				});

				break;
		}
	}

	//Getters
	const getActiveOverlay = computed(() => {
		return activeOverlay.value;
	});

	const overlayCount = computed(() => {
		return overlays.value.length;
	});

	const updateVisibleOverlays = () => {
		const mapBounds = map.value.getBounds();

		//Check if overlay is visible
		visibleOverlays.value = overlays.value.filter((overlay) => {
			let contains = false;

			switch (overlay.featureType) {
				case "marker":
					//In view
					contains = mapBounds.contains(overlay.layer.getLatLng());

					break;
				case "line":
					// Check if coords are in view
					overlay.feature.geometry.coordinates.forEach((coords) => {
						if (
							!contains &&
							mapBounds.contains(L.latLng(coords[1], coords[0]))
						) {
							contains = true;
						}
					});

					break;
				//In view
				// return mapBounds.contains()

				// case 'shape':
				//In view
				// return mapBounds.contains(overlay.layer.getLatLng())
			}

			return contains;
		});
	};

	const markers = computed(() => {
		return overlays.value.filter((overlay) => overlay.featureType == "marker");
	});

	const lines = computed(() => {
		return overlays.value.filter((overlay) => overlay.featureType == "line");
	});

	const shapes = computed(() => {
		return overlays.value.filter((overlay) => overlay.featureType == "shape");
	});

	const orientation = computed(() => {
		return width.value > height.value ? "landscape" : "portrait";
	});

	const small = computed(() => {
		// Small / Medium / Large
		if (width.value <= 320) {
			return "small";
		}
	});

	const classAppend = computed(() => {
		let classes = [""];

		// Panel Open
		if (panelOpen.value) {
			classes.push("panel-open");
		} else {
			classes.push("panel-closed");
		}

		classes.push(orientation.value);

		classes.push(small.value);

		return classes.join(" ");
	});

	return {
		// Init
		createStore,

		// === Configuration ===

		config,

		// - Map Options

		containerId,
		width,
		height,
		//lat
		//lng
		//zoom
		//max zoom
		//tile layers
		//marker types

		//line types
		//shape types
		//debug mode

		//basemap
		//show scale

		// - Viewer Options

		/*
show_gallery	1/0	Whether to display an image gallery for Markers that have images. Thumbnails for Markers currently in view on the Map are displayed and clicking on a thumbnail will centre the Map on the Marker and open the popup.	1
show_filter	1/0	Allow the user to filter which Overlays are currently visible on Map.	1
show_cluster	1/0	Whether to cluster (stack) Markers that are close together, to declutter the Map.	1
cluster_radius	number	The maximum radius that a cluster will cover from the central Marker (in pixels). Decreasing will make more, smaller clusters. Default 80.	80
cluster_threshold	0-18	Markers will not be clustered above this zoom level.	14
show_elevation	1/0	Whether to display an interactive elevation profile graph below the Map for Lines that have elevation data.	1
elevation_div_id	string	The ID of the HTML element to contain the elevation profile graph. The default is waymark-elevation and if this element does not exist, it will be created inside the Map Container.	waymark-elevation
elevation_units	metric/imperial	Display elevation data in metric (m/km) or imperial (ft/mi) units.	metric
elevation_colour	CSS Colour	The colour of the elevation graph and associated Line, provided as a CSS colour (e.g. white, #ffba00, rgb(255, 186, 0)).	#b42714
elevation_initial	1/0	Whether to show the elevation profile initially when the Map loads, or wait for a Line to be clicked.	0
sleep_delay_seconds	number	How many seconds before scroll zoom is enabled. 0 seconds will mean no delay (disabling this feature). A large number of seconds like 3600 (an hour) will essentially disable hover to wake, meaning the user will need to click to wake.	3600
sleep_do_message	1/0	Whether to display a message while scroll zoom is disabled.	1
sleep_wake_message	string	The message to display while scroll zoom is disabled.	Click to Wake
*/

		// - Editor Options

		/*
confirm_delete	1/0	Whether to show a confirmation message when deleting an object.	1
data_div_id	string	The ID of a element to output the GeoJSON into. By default this is a <textarea>.	waymark-data
*/

		// === State ===

		state,

		orientation,

		// - Map

		map,

		tileLayers,
		activeTileLayer,

		// - Overlays

		overlays,
		markers,
		lines,
		shapes,

		overlayCount,
		visibleOverlays,

		activeOverlay,

		// - Panels

		panelOpen,

		activePanel,

		classAppend,

		// === Modifiers ===

		updateTileLayer,

		storeMap,

		storeLine,

		storeMarker,

		storeTileLayer,

		setActiveOverlay,

		highlightOverlay,

		setFocus,

		togglePanel,

		setActivePanel,
	};
});
