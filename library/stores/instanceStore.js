import { ref, shallowRef, computed } from "vue";
import { defineStore } from "pinia";
import {
	getFeatureType,
	getOverlayTypeKey,
	getTypeData,
} from "@/helpers/Overlay.js";
import { deepMerge } from "@/helpers/Common.js";
import { useMap } from "@/composables/useMap.js";

export const useInstanceStore = defineStore("instance", () => {
	// State
	const config = shallowRef({});
	const container = shallowRef(null);
	const dataLayer = shallowRef({});
	const map = shallowRef(null);
	const mapBounds = shallowRef(null);
	const overlays = shallowRef({
		markers: {},
		lines: {},
		shapes: {},
	});

	const panelOpen = shallowRef(true);

	const tileLayers = shallowRef({});
	const activeTileLayer = shallowRef({});

	const activeLayer = shallowRef(null);

	const activePanelKey = shallowRef("overlays");
	const activeFeatureType = shallowRef("marker");

	const mapReady = shallowRef(false);

	const filters = ref({
		text: "",
		inBounds: false,
	});

	// Getters

	const { isLayerInBounds } = useMap();

	const filteredLayers = computed(() => {
		const filtered = L.featureGroup();

		// Iterate over all overlays
		dataLayer.value.eachLayer((layer) => {
			const featureType = getFeatureType(layer.feature);
			const typeKey = getOverlayTypeKey(layer.feature);
			const typeData = getTypeData(featureType, typeKey);

			// Is it in the current map bounds
			if (filters.value.inBounds && !isLayerInBounds(layer, mapBounds.value)) {
				return;
			}

			// Text filter
			if (filters.value.text !== "") {
				let matches = 0;

				// Text included in type title
				matches += typeData[featureType + "_title"]
					.toString()
					.toLowerCase()
					.includes(filters.value.text.toLowerCase());

				// Check all GeoJSON properties VALUES (not keys) for existence of filter text
				const properties = Object.values(layer.feature.properties);

				matches += properties.some((p) => {
					return p
						.toString()
						.toLowerCase()
						.includes(filters.value.text.toLowerCase());
				});

				// If no matches, skip this layer
				if (matches === 0) {
					return;
				}
			}

			// Add to filtered layers
			if (!filtered.hasLayer(layer)) {
				filtered.addLayer(layer);
			}
		});

		// Text filter

		return filtered;
	});

	// Actions
	const init = (initConfig = {}) => {
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
	};

	return {
		// State
		config,
		mapReady,
		container,
		panelOpen,
		dataLayer,
		map,
		mapBounds,
		overlays,
		filters,
		tileLayers,
		activeTileLayer,
		activeLayer,
		activePanelKey,
		activeFeatureType,

		// Getters
		filteredLayers,

		// Actions
		init,
	};
});
