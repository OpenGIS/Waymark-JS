import { computed, ref, shallowRef } from "vue";
import { defineStore } from "pinia";
import { Config } from "@/classes/Config.js";
import { LngLatBounds } from "maplibre-gl";

export const useInstanceStore = defineStore("instance", () => {
	// State
	const config = shallowRef(null);
	const container = shallowRef(null);
	const map = shallowRef(null);
	const mapBounds = shallowRef(null);

	const overlays = shallowRef([]);

	const panelOpen = shallowRef(false);

	const activeTileLayer = shallowRef({});

	const activeOverlay = shallowRef(null);

	const activePanelKey = shallowRef("overlays");
	const activeFeatureType = shallowRef("marker");

	const mapReady = shallowRef(false);

	const layerFilters = ref({
		text: "",
		inBounds: true,
	});

	// Getters

	// Actions
	const init = (initConfig = {}) => {
		// Parse config & set defaults
		config.value = new Config(initConfig);
	};

	// Computed
	const overlaysByType = computed(() => {
		const byType = {
			marker: {},
			line: {},
			shape: {},
		};

		overlays.value.forEach((overlay) => {
			const typeKey = overlay.typeKey || "undefined";

			if (!byType[overlay.featureType][typeKey]) {
				byType[overlay.featureType][typeKey] = [];
			}

			byType[overlay.featureType][typeKey].push(overlay);
		});

		return byType;
	});

	const filteredOverlays = computed(() => {
		const filtered = [];

		// Iterate over all overlays
		overlays.value.forEach((overlay) => {
			// Is it in the current map bounds
			if (layerFilters.value.inBounds && !overlay.inBounds(mapBounds.value)) {
				return;
			}

			// Text filter
			if (
				layerFilters.value.text !== "" &&
				!overlay.containsText(layerFilters.value.text)
			) {
				return;
			}

			filtered.push(overlay);
		});

		return filtered;
	});

	// const overlaysBounds = computed(() => {
	// 	const bounds = new LngLatBounds();

	// 	overlays.value.forEach((overlay) => {
	// 		bounds.extend(overlay.getBounds());
	// 	});

	// 	return bounds;
	// });

	const overlaysBounds = computed(() => {
		if (overlays.value.length === 0) {
			return null;
		}

		const bounds = new LngLatBounds();

		overlays.value.forEach((overlay) => {
			bounds.extend(overlay.getBounds());
		});

		return bounds;
	});

	return {
		// State
		config,
		mapReady,
		container,
		panelOpen,
		overlays,
		overlaysByType,
		map,
		mapBounds,
		layerFilters,
		activeTileLayer,
		activeOverlay,
		activePanelKey,
		activeFeatureType,

		// Actions
		init,

		// Computed
		overlaysByType,
		filteredOverlays,
		overlaysBounds,
	};
});
