import { ref, shallowRef, computed, watch } from "vue";
import { defineStore } from "pinia";
import L from "leaflet";
import { getFeatureType } from "@/helpers/Overlay.js";
import { makeKey, deepMerge } from "@/helpers/Common.js";

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

	const config = shallowRef({
		map_options: {},
		viewer_options: {},
		editor_options: {},
	});

	// === STATE ===

	const state = {
		geoJSON: L.geoJSON(),
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

		// Get DOM Element
		state.container = document.getElementById(config.value.map_options.div_id);

		// Inital Dimensions
		const getDimensions = () => {
			state.width = state.container.clientWidth;
			state.height = state.container.clientHeight;

			console.log(`Width: ${state.width}, Height: ${state.height}`);
		};
		getDimensions();

		// Resize Event
		window.addEventListener("resize", getDimensions);
	}

	return {
		createStore,
		config,
		state,
	};
});
