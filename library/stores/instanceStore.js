import { ref, markRaw, shallowRef } from "vue";
import { defineStore } from "pinia";

import L from "leaflet";
import { deepMerge } from "@/helpers/Common.js";

export const useInstanceStore = defineStore("instance", () => {
	// State
	const config = shallowRef({});
	const container = shallowRef(null);
	const panelOpen = ref(true);
	const dataLayer = shallowRef({});
	const map = shallowRef({});

	const state = shallowRef({
		// dataLayer: null,

		// Map

		// map: null,

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

		activeFeatureType: "marker",
	});

	const mapReady = ref(false);

	// Getters

	// Actions
	function init(initConfig = {}) {
		// Parse config & set defaults
		config.value = deepMerge(
			structuredClone({
				geoJSON: {},
				map_options: {
					div_id: "map",
					leaflet_options: {
						center: [51.1788144, -1.8261632],
						zoom: 17,
						attributionControl: false,
					},
				},
			}),
			initConfig,
		);
	}

	return {
		// State
		config,
		mapReady,
		container,
		panelOpen,
		dataLayer,
		map,

		// Del...
		state,

		// Getters

		// Actions
		init,
	};
});
