import { ref, markRaw, shallowRef } from "vue";
import { defineStore } from "pinia";

import L from "leaflet";
import { deepMerge } from "@/helpers/Common.js";

export const useInstanceStore = defineStore("instance", () => {
	// State
	const config = shallowRef({});
	const container = shallowRef(null);
	const dataLayer = shallowRef({});
	const map = shallowRef({});

	const panelOpen = ref(true);

	const tileLayers = shallowRef({});
	const activeTileLayer = shallowRef({});

	const state = shallowRef({
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
		tileLayers,
		activeTileLayer,

		// Del...
		state,

		// Getters

		// Actions
		init,
	};
});
