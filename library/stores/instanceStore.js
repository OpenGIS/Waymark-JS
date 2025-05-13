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

	let config = {};
	let state = {};

	// === STATE ===

	state = {
		dataLayer: null,

		container: {},
		width: 0,
		height: 0,

		// Map

		map: null,

		hasInit: false,

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
		config = deepMerge(structuredClone(defaultConfig), initConfig);

		state.hasInit = true;
	}

	return {
		createStore,
		config,
		state,
	};
});
