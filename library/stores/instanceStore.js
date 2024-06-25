import { ref, computed } from "vue";
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

	//State
	const id = ref("map");
	const lng = ref(-128.0094);
	const lat = ref(50.6539);
	const zoom = ref(16);
	const mapConfig = ref({});
	const geoJSON = ref({});

	let map = null;

	const overlays = ref([]);
	const visibleOverlays = ref([]);
	const activeOverlay = ref({});
	const barOpen = ref(true);
	const detailExpanded = ref(false);

	function createStore(data = {}) {
		if (data.id) {
			id.value = data.id.value;
		}

		if (data.lng) {
			lng.value = data.lng.value;
		}

		if (data.lat) {
			lat.value = data.lat.value;
		}

		if (data.zoom) {
			zoom.value = data.zoom.value;
		}

		if (data.geoJSON) {
			geoJSON.value = data.geoJSON.value;
		}

		if (data.mapConfig) {
			mapConfig.value = data.mapConfig.value;
		}
	}

	function initMap() {
		map = createMap({
			id: id.value + "-map",
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

	function addMarker(marker, feature) {
		let featureType = "marker";
		let typeKey = feature.properties.type;

		let overlay = {
			id: overlays.value.length + 1,
			typeKey: typeKey,
			typeData: getTypeData("marker", typeKey),
			feature: feature,
			marker: marker,
			featureType: featureType,
			element: marker.getElement(),
			imageURLs: getImageURLs(feature.properties),
		};

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
		addMarker,
		toggleBar,
		setFocus,
	};
});
