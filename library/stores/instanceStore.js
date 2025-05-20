import { ref, markRaw } from "vue";
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
				attributionControl: false,
			},
		},
	};

	const config = markRaw({});

	// === STATE ===

	const state = markRaw({
		dataLayer: null,

		container: {},
		width: 0,
		height: 0,

		// Map

		map: null,

		// Tile Layers
		activeTileLayer: L.tileLayer(),
		tileLayers: L.layerGroup(),

		// Overlays
		overlays: {
			markers: L.featureGroup(),
			lines: L.featureGroup(),
			shapes: L.featureGroup(),
		},

		activeLayer: null,

		// Panels
		activePanelKey: "overlays",
		panelOpen: true,

		activeFeatureType: "marker",
	});

	// === REFS ===

	const mapReady = ref(false);

	function init(initConfig = {}) {
		const parsedConfig = deepMerge(structuredClone(defaultConfig), initConfig);

		// Set config
		for (const key in parsedConfig) {
			config[key] = parsedConfig[key];
		}
	}

	return {
		init,
		config,
		state,
		mapReady,
	};
});
