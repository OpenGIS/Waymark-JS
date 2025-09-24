import { ref, shallowRef } from "vue";
import { defineStore } from "pinia";
import { deepMerge } from "@/helpers/Common.js";

export const useInstanceStore = defineStore("instance", () => {
	// State
	const config = shallowRef({});
	const container = shallowRef(null);
	const dataLayer = shallowRef({});
	const map = shallowRef(null);
	const mapBounds = shallowRef(null);
	const layersByType = shallowRef({
		markers: {},
		lines: {},
		shapes: {},
	});

	const panelOpen = shallowRef(true);

	const tileLayerGroup = shallowRef({});
	const activeTileLayer = shallowRef({});

	const activeLayer = shallowRef(null);

	const activePanelKey = shallowRef("basemaps");
	const activeFeatureType = shallowRef("marker");

	const mapReady = shallowRef(false);

	const layerFilters = ref({
		text: "",
		inBounds: false,
	});

	// Getters

	// Actions
	const init = (initConfig = {}) => {
		// Parse config & set defaults
		config.value = deepMerge(
			structuredClone({
				geoJSON: {},
				map_options: {
					div_id: "map",
					units: "metric",
					mapLibreOptions: {
						center: [-1.8261632, 51.1788144],
						zoom: 4,
					},
				},
			}),
			initConfig,
		);
	};

	return {
		// State
		config,
		mapReady,
		container,
		panelOpen,
		dataLayer,
		layersByType,
		map,
		mapBounds,
		layerFilters,
		tileLayerGroup,
		activeTileLayer,
		activeLayer,
		activePanelKey,
		activeFeatureType,

		// Actions
		init,
	};
});
