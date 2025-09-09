import { ref, shallowRef, computed } from "vue";
import { defineStore } from "pinia";
import { LngLatBounds } from "maplibre-gl";
import { getTypeData, getImageURLs } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

export const useInstanceStore = defineStore("instance", () => {
	// DOM Target
	let containerId = ref(null);
	let container = null;

	// Config
	const mapConfig = shallowRef({});

	// Default Tile Layer
	const activeTileLayer = ref(null);

	// Data
	const geoJSON = shallowRef({});

	let map = shallowRef(null);

	const overlays = ref([]);
	const visibleOverlays = ref([]);
	const activeOverlay = ref({});

	const activePanel = ref("overlays");
	const panelOpen = ref(false);

	const width = ref(0);
	const height = ref(0);

	function createStore(data = {}) {
		if (data.id) {
			containerId.value = data.id;

			// Get DOM Element
			container = document.getElementById(containerId.value);

			// Inital Dimensions
			const getDimensions = () => {
				width.value = container.clientWidth;
				height.value = container.clientHeight;
			};
			getDimensions();

			// Resize Event
			window.addEventListener("resize", getDimensions);
		}

		if (data.geoJSON) {
			geoJSON.value = data.geoJSON;
		}

		// Check for config
		if (data.mapConfig) {
			mapConfig.value = data.mapConfig;
		}
	}

	function storeMap(mapInstance) {
		map.value = mapInstance;

		map.value
			.on("zoomend", updateVisibleOverlays)
			.on("moveend", updateVisibleOverlays);
	}

	function updateTileLayer(layerId = "") {
		// Iterate over tile_layers
		mapConfig.value.tile_layers.forEach((layer) => {
			// Set visibility based on layerId
			map.value.setLayoutProperty(
				layer.layer_name,
				"visibility",
				layer.layer_name == layerId ? "visible" : "none",
			);
		});

		// Update active layer
		activeTileLayer.value = layerId;
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
				const layerId = overlay.layer.id + "-highlight";

				if (highlight) {
					// If layer doesn't exist
					if (!map.value.getLayer(layerId)) {
						// Duplicate layer
						map.value.addLayer({
							id: layerId,
							type: "line",
							source: overlay.layer.source,
							layout: overlay.layer.layout,
							paint: {
								"line-color": "red",
								"line-width": 5,
							},
						});
					}
				} else {
					// If layer exists
					if (map.value.getLayer(layerId)) {
						map.value.removeLayer(layerId);
					}
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

		let overlay = {
			id: overlays.value.length + 1,
			typeKey: typeKey,
			typeData: getTypeData(featureType, typeKey),
			feature: feature,
			layer: line,
			featureType: featureType,
			imageURLs: getImageURLs(feature.properties),
		};

		// Add events
		map.value.on("click", line.id, () => {
			setActiveOverlay(overlay);
		});

		map.value.on("mouseenter", line.id, () => {
			highlightOverlay(overlay, true);
		});

		map.value.on("mouseleave", line.id, () => {
			highlightOverlay(overlay, false);
		});

		overlays.value.push(overlay);

		return overlay;
	}

	function setFocus(overlay = {}) {
		switch (overlay.featureType) {
			case "marker":
				map.value.flyTo({
					center: overlay.layer.getLngLat(),
					zoom: 15,
				});
				break;

			case "line":
				// Get coords
				const coords = overlay.feature.geometry.coordinates;

				// Get bounds extent
				const bounds = coords.reduce(
					(bounds, coord) => {
						return bounds.extend(coord);
					},
					new LngLatBounds(coords[0], coords[0]),
				);

				// Fit to bounds
				map.value.fitBounds(bounds, {
					padding: 30,
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
					contains = mapBounds.contains(overlay.layer.getLngLat());

					break;
				case "line":
					// Check if coords are in view
					overlay.feature.geometry.coordinates.forEach((coords) => {
						if (!contains && mapBounds.contains(coords)) {
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
		createStore,
		storeMap,
		storeLine,
		containerId,
		overlays,
		geoJSON,
		map,
		mapConfig,
		activeTileLayer,
		updateTileLayer,
		overlayCount,
		visibleOverlays,
		activeOverlay,
		setActiveOverlay,
		highlightOverlay,
		activePanel,
		panelOpen,
		storeMarker,
		togglePanel,
		setActivePanel,
		setFocus,
		markers,
		lines,
		shapes,
		width,
		height,
		orientation,
		classAppend,
	};
});
