import { computed } from "vue";
import { storeToRefs } from "pinia";

// Import Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import Helpers
import {
	createMap,
	createTileLayerGroup,
	createDataLayer,
	isLayerInBounds,
	addLayerHighlight,
	removeLayerHighlight,
	flyToLayer,
} from "@/helpers/Leaflet.js";

import { Overlay } from "@/classes/Overlay.js";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

const fitBoundsOptions = {
	padding: [30, 30],
	animate: false,
};

export function useMap() {
	// Get the state from the instance store
	const {
		config,
		map,
		mapReady,
		layerFilters,
		mapBounds,
		dataLayer,
		layersByType,
		activeLayer,
		activeFeatureType,
		panelOpen,
		activePanelKey,
		tileLayerGroup,
		activeTileLayer,
	} = storeToRefs(useInstanceStore());

	// Create & Store Map
	const init = () => {
		// Create Leaflet instance
		map.value = createMap(
			getMapContainerID(),
			config.value.map_options.leaflet_options,
		);

		// Create Tile Layers
		tileLayerGroup.value = createTileLayerGroup(
			config.value.map_options.tile_layers,
		);

		// Set active Tile Layer
		activeTileLayer.value = tileLayerGroup.value.getLayers()[0];
		map.value.addLayer(activeTileLayer.value);

		// Create data layer
		dataLayer.value = createDataLayer(
			config.value.geoJSON,
			// On each feature
			(feature, layer) => {
				// Create Overlay instance
				layer.overlay = new Overlay(feature);

				// Add to appropriate Type group
				const featuresType = layer.overlay.featureType + "s";
				if (!layersByType.value[featuresType][layer.overlay.typeKey]) {
					// Needs creating
					layersByType.value[featuresType][layer.overlay.typeKey] =
						L.featureGroup();

					// **** Modify the Leaflet LayerGroup ****

					layersByType.value[featuresType][layer.overlay.typeKey].typeData =
						layer.overlay.type.data;
				}
				layersByType.value[featuresType][layer.overlay.typeKey].addLayer(layer);

				// Add events
				layer.on("click", () => {
					setActiveLayer(layer);
				});

				// Create Style
				switch (featuresType) {
					case "lines":
						layer.setStyle({
							color: layer.overlay.type.data.line_colour,
							weight: parseFloat(layer.overlay.type.data.line_weight),
							opacity: layer.overlay.type.data.line_opacity,
						});

						break;

					default:
						console.warn("Unknown Feature Type", feature);
						break;
				}
			},
		);

		// Add Data Layer to Map
		map.value.addLayer(dataLayer.value);

		// Set initial bounds
		map.value.fitBounds(dataLayer.value.getBounds(), fitBoundsOptions);

		// Update bounds on map move & zoom
		map.value.on("moveend", () => {
			mapBounds.value = map.value.getBounds();
		});

		// Triggers the UI to populate
		mapReady.value = true;
	};

	// Get the Div ID for the Map container
	const getMapContainerID = () => {
		return `${config.value.map_options.div_id}-map`;
	};

	const setActiveLayer = (layer) => {
		// If active layer is set
		if (activeLayer.value) {
			//If already active layer - focus on it
			if (activeLayer.value === layer) {
				switch (layer.overlay.featureType) {
					case "marker":
						// Increase zoom to max layer zoom
						map.value.setView(layer.getLatLng(), map.value.getMaxZoom());

						break;
					case "line":
						flyToLayer(layer);

						break;
					case "shape":
						break;
				}

				return;
			}

			// Remove highlight
			removeLayerHighlight(activeLayer.value);

			// Make inactive
			activeLayer.value = null;
		}

		// Go to Overlays Panel
		activeFeatureType.value = layer.overlay.featureType;
		activePanelKey.value = "overlays";
		panelOpen.value = true;

		// Make active
		activeLayer.value = layer;
		flyToLayer(layer);
		addLayerHighlight(layer);
	};

	const filteredLayers = computed(() => {
		const filtered = L.featureGroup();

		// Iterate over all overlays
		dataLayer.value.eachLayer((layer) => {
			// Is it in the current map bounds
			if (
				layerFilters.value.inBounds &&
				mapBounds.value &&
				!isLayerInBounds(layer, mapBounds.value)
			) {
				return;
			}

			// Text filter
			if (
				layerFilters.value.text !== "" &&
				!layer.overlay.containsText(layerFilters.value.text)
			) {
				return;
			}

			// Add to filtered layers
			if (!filtered.hasLayer(layer)) {
				filtered.addLayer(layer);
			}
		});

		return filtered;
	});

	return {
		init,
		getMapContainerID,
		setActiveLayer,
		filteredLayers,
	};
}
