import { ref, shallowRef, computed } from "vue";
import { defineStore } from "pinia";
import { useMaplibre } from "@/composables/useMaplibre.js";
import {
	getTypeData,
	getFeatureType,
	getIconData,
	getImageURLs,
} from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

export const useInstanceStore = defineStore("instance", () => {
	const { createMap } = useMaplibre();

	// DOM Target
	let id = null;

	// View
	const lng = ref(null);
	const lat = ref(null);
	const zoom = ref(null);

	// Config
	const mapConfig = shallowRef({});

	// Data
	const geoJSON = shallowRef({});

	let map = null;

	const overlays = ref([]);
	const visibleOverlays = ref([]);
	const activeOverlay = ref({});
	const barOpen = ref(true);
	const detailExpanded = ref(false);

	function createStore(data = {}) {
		if (data.id) {
			id.value = data.id;
		}

		if (data.lng) {
			lng.value = data.lng;
		}

		if (data.lat) {
			lat.value = data.lat;
		}

		if (data.zoom) {
			zoom.value = data.zoom;
		}

		if (data.geoJSON) {
			geoJSON.value = data.geoJSON;
		}

		if (data.mapConfig) {
			mapConfig.value = data.mapConfig;
		}
	}

	function initMap() {
		map = createMap({
			id: id + "-map",
			lng: lng.value,
			lat: lat.value,
			zoom: zoom.value,
			geoJSON: geoJSON.value,
		});

		//Update Visible whenever view changes
		map
			.on("zoomend", updateVisibleOverlays)
			.on("moveend", updateVisibleOverlays);

		return map;
	}

	function toggleBar() {
		barOpen.value = !barOpen.value;
	}

	function toggleDetailExpanded() {
		detailExpanded.value = !detailExpanded.value;
	}

	function toggleHoverOverlay(overlay) {
		overlay.element.classList.toggle("overlay-highlight");
	}

	function setActiveOverlay(overlay) {
		//Overlay already open
		if (activeOverlay.value && activeOverlay.value.id == overlay.id) {
			//Focus On
			setFocus(overlay.marker.getLngLat());

			//Increase info
			detailExpanded.value = true;

			//Switching Overlay
		} else {
			activeOverlay.value = overlay;
		}
	}

	function storeMarker(marker, feature) {
		let featureType = "marker";
		let typeKey = feature.properties.type;

		const markerElement = marker.getElement();

		let overlay = {
			id: overlays.value.length + 1,
			typeKey: typeKey,
			typeData: getTypeData("marker", typeKey),
			feature: feature,
			marker: marker,
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

	function setFocus(coords) {
		map.setZoom(14);
		map.setCenter(coords);
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
					contains = mapBounds.contains(overlay.marker.getLngLat());

					break;
				// case 'line':
				//   if (contains) break

				//   overlay.layer.getLatLngs().forEach((element) => {
				//     if (mapBounds.contains(element)) {
				//       contains = true
				//     }
				//   })

				//   break
				//In view
				// return mapBounds.contains()

				// case 'shape':
				//In view
				// return mapBounds.contains(overlay.layer.getLatLng())
			}

			return contains;
		});
	};

	return {
		createStore,
		initMap,
		lng,
		lat,
		zoom,
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
		toggleDetailExpanded,
		detailExpanded,
		barOpen,
		storeMarker,
		toggleBar,
		setFocus,
	};
});
