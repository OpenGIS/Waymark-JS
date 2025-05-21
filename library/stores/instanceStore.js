import { shallowRef } from "vue";
import { defineStore } from "pinia";

import { deepMerge } from "@/helpers/Common.js";

export const useInstanceStore = defineStore("instance", () => {
	// State
	const config = shallowRef({});
	const container = shallowRef(null);
	const dataLayer = shallowRef({});
	const map = shallowRef(null);

	const panelOpen = shallowRef(true);

	const tileLayers = shallowRef({});
	const activeTileLayer = shallowRef({});

	const activeLayer = shallowRef(null);

	const activePanelKey = shallowRef("overlays");
	const activeFeatureType = shallowRef("marker");

	const mapReady = shallowRef(false);

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
		activeLayer,
		activePanelKey,
		activeFeatureType,

		// Getters

		// Actions
		init,
	};
});
