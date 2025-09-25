import { computed, ref, shallowRef } from "vue";
import { defineStore } from "pinia";
import { deepMerge } from "@/helpers/Common.js";

export const useInstanceStore = defineStore("instance", () => {
	// State
	const config = shallowRef({});
	const container = shallowRef(null);
	const map = shallowRef(null);
	const mapBounds = shallowRef(null);

	const overlays = shallowRef([]);

	const panelOpen = shallowRef(true);

	const tileLayerGroup = shallowRef({});
	const activeTileLayer = shallowRef({});

	const activeOverlay = shallowRef(null);

	const activePanelKey = shallowRef("overlays");
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
			if (layerFilters.value.inBounds && !overlay.inMapBounds()) {
				return;
			}

			// Text filter
			if (
				layerFilters.value.text !== "" &&
				!layer.overlay.containsText(layerFilters.value.text)
			) {
				return;
			}

			// Add to filtered Overlays
			if (!filtered.includes(overlay)) {
				filtered.push(overlay);
			}
		});

		return filtered;
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
		tileLayerGroup,
		activeTileLayer,
		activeOverlay,
		activePanelKey,
		activeFeatureType,

		// Actions
		init,

		// Computed
		overlaysByType,
		filteredOverlays,
	};
});
