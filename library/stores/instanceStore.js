import { ref, shallowRef, computed } from "vue";
import { defineStore } from "pinia";
import {
	getTypeData,
	getFeatureType,
	getIconData,
	getImageURLs,
} from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

export const useInstanceStore = defineStore("instance", () => {
	// DOM Target
	let id = null;
	let container = null;

	// Config
	const mapConfig = shallowRef({});

	// Data
	const geoJSON = shallowRef({});

	let map = null;

	const overlays = ref([]);
	const visibleOverlays = ref([]);
	const activeOverlay = ref({});

	const detailExpanded = ref(false);

	const activePanel = ref("overlay");
	const panelOpen = ref(false);

	const width = ref(0);
	const height = ref(0);

	function createStore(data = {}) {
		if (data.id) {
			id = data.id;

			// Get DOM Element
			container = document.getElementById(id);

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

		if (data.mapConfig) {
			mapConfig.value = data.mapConfig;
		}
	}

	function storeMap(mapInstance) {
		map = mapInstance;

		map
			.on("zoomend", updateVisibleOverlays)
			.on("moveend", updateVisibleOverlays);
	}

	function togglePanel() {
		panelOpen.value = !panelOpen.value;
	}

	function setActivePanel(panel = "overlay") {
		activePanel.value = panel;
		panelOpen.value = true;
	}

	function toggleHoverOverlay(overlay) {
		switch (overlay.featureType) {
			case "marker":
				overlay.element.classList.toggle("overlay-highlight");
				break;

			case "line":
				const colour = map.getPaintProperty(overlay.layer.id, "line-color");

				// Invert HEX colour
				const hex = colour.replace("#", "");

				const r = 255 - parseInt(hex.substring(0, 2), 16);
				const g = 255 - parseInt(hex.substring(2, 4), 16);
				const b = 255 - parseInt(hex.substring(4, 6), 16);

				const newColour = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

				map.setPaintProperty(overlay.layer.id, "line-color", newColour);

				break;
		}
	}

	function setActiveOverlay(overlay) {
		setActivePanel("detail");

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
			toggleHoverOverlay(overlay);
		});

		markerElement.addEventListener("mouseleave", () => {
			toggleHoverOverlay(overlay);
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

		overlays.value.push(overlay);

		return overlay;
	}

	function setFocus(overlay = {}) {
		switch (overlay.featureType) {
			case "marker":
				map.flyTo({
					center: overlay.layer.getLngLat(),
					zoom: 15,
				});
				break;

			case "line":
				const bounds = overlay.layer.getBounds();

				// Fly to center of line
				map.flyTo({
					center: bounds.getCenter(),
					zoom: 15,
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
		const mapBounds = map.getBounds();

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

	const classAppend = computed(() => {
		let classes = [""];

		// Panels
		if (panelOpen.value) {
			classes.push("panel-open");
		} else {
			classes.push("panel-closed");
		}

		classes.push(orientation.value);

		return classes.join(" ");
	});

	return {
		createStore,
		storeMap,
		storeLine,
		id,
		overlays,
		geoJSON,
		map,
		mapConfig,
		overlayCount,
		visibleOverlays,
		activeOverlay,
		setActiveOverlay,
		toggleHoverOverlay,
		// toggleDetailExpanded,
		// detailExpanded,
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
