import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { waymarkConfig } from "@/data/waymark.js";

import {
	getTypeData,
	getFeatureType,
	getImageURLs,
} from "@/helpers/Overlay.js";

export const useMapStore = defineStore("map", () => {
	//State
	const lng = ref(-128.0094);
	const lat = ref(50.6539);
	const zoom = ref(16);

	const geoJSON = ref({});
	const mapConfig = ref(waymarkConfig);
	const map = ref({});
	const overlays = ref([]);
	const visibleOverlays = ref([]);
	const activeOverlay = ref({});
	const barOpen = ref(false);
	const detailExpanded = ref(false);

	//Actions
	function setMap(m) {
		map.value = m;
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

			console.log(activeOverlay.value.id);
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
		map.value.setZoom(14);
		map.value.setCenter(coords);
	}

	//Getters
	const getActiveOverlay = computed(() => {
		return activeOverlay.value;
	});

	return {
		lng,
		lat,
		zoom,
		overlays,
		geoJSON,
		map,
		setMap,
		mapConfig,
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
