import { ref } from "vue";
import { defineStore } from "pinia";

import L from "leaflet";
import { deepMerge } from "@/helpers/Common.js";

export const useInstanceStore = defineStore("instance", () => {
	// === CONFIGURATION ===

	const defaultConfig = {
		geoJSON: {},
		map_options: {
			div_id: "map",
			leaflet_options: {
				center: [51.1788144, -1.8261632],
				zoom: 17,
			},
		},
	};

	const config = ref({});

	// === STATE ===

	const state = {
		dataLayer: null,

		container: {},
		width: 0,
		height: 0,

		// Map

		map: null,

		orientation: () => {
			return state.width > state.height ? "landscape" : "portrait";
		},

		// Tile Layers
		tileLayers: L.layerGroup(),

		// Overlays
		overlays: L.featureGroup(),
	};

	function createStore(initConfig = {}) {
		// Create a merged config
		config.value = deepMerge(structuredClone(defaultConfig), initConfig);

		isReady.value = true;
	}

	// === READY ===

	const isReady = ref(false);

	return {
		createStore,
		config,
		state,
		isReady,
	};
});
