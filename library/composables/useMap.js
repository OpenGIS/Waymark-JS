import { computed } from "vue";
import { storeToRefs } from "pinia";

// Import Leaflet (old implementation - to be removed)
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import MapLibre (new implementation, migrating from Leaflet to MapLibre)
import { LngLatBounds } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Import Helpers
import {
	isLayerInBounds,
	addLayerHighlight,
	removeLayerHighlight,
	flyToLayer,
} from "@/helpers/Leaflet.js";
import { getFeatureType } from "@/helpers/Overlay.js";
import { createMap, createMapStyle } from "@/helpers/MapLibre.js";

// Classes
import { Overlay } from "@/classes/Overlay.js";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useMap() {
	// Get the state from the instance store
	const {
		config,
		map,
		mapReady,
		layerFilters,
		mapBounds,
		dataLayer,
		activeOverlay,
		activeFeatureType,
		panelOpen,
		activePanelKey,
	} = storeToRefs(useInstanceStore());

	// Create & Store Map
	const init = () => {
		// Create MapLibre instance
		map.value = createMap(
			getMapContainerID(),
			createMapStyle(config.value.map_options.tile_layers),
			config.value.map_options.mapLibreOptions,
		);

		// Data Layer - GeoJSON Present?
		if (config.value.geoJSON && Array.isArray(config.value.geoJSON.features)) {
			console.log("Adding GeoJSON to Map", config.value.geoJSON);

			const dataBounds = new LngLatBounds();

			map.value.on("load", () => {
				// Add GeoJSON Source
				map.value.addSource("data", {
					type: "geojson",
					data: config.value.geoJSON,
				});

				// Overlays
				let overlayCount = 0;
				config.value.geoJSON.features.forEach((feature) => {
					// Create Overlay instance
					const overlay = new Overlay(feature, `overlay-${overlayCount++}`);

					overlay.addTo(map.value);

					// Handle Events
					switch (overlay.featureType) {
						case "marker":
							overlay.layer.getElement().addEventListener("click", () => {
								setActiveOverlay(overlay);
							});

							break;
						case "line":
						case "shape":
						// overlay.on("click", (e) => {
						// 	setactiveOverlay(overlay);
						// });
						// break;
					}

					// Extend bounds
					dataBounds.extend(overlay.getBounds());
				});

				//Set initial centre and zoom to it
				map.value.setCenter(dataBounds.getCenter());
				map.value.fitBounds(dataBounds, {
					padding: 30,
					animate: false,
				});
			});
		}

		// Triggers the UI to populate
		map.value.on("load", () => {
			mapReady.value = true;
		});
	};

	// Get the Div ID for the Map container
	const getMapContainerID = () => {
		return `${config.value.map_options.div_id}-map`;
	};

	const setActiveOverlay = (overlay) => {
		// If active layer is set
		if (activeOverlay.value) {
			//If already active layer - focus on it
			if (activeOverlay.value === overlay) {
				switch (overlay.featureType) {
					case "marker":
						console.log("Focus on Marker");
						// Increase zoom to max layer zoom
						//map.value.setView(layer.getLatLng(), map.value.getMaxZoom());

						break;
					case "line":
					case "shape":
						console.log("Focus on Line/Shape");
						break;
				}

				return;
			}

			// Remove highlight
			activeOverlay.value.removeHighlight();

			// Make inactive
			activeOverlay.value = null;
		}

		// Go to Overlays Panel
		activeFeatureType.value = overlay.featureType;
		activePanelKey.value = "overlays";
		panelOpen.value = true;

		// Make active
		activeOverlay.value = overlay;
		// flyToLayer(layer);
		overlay.addHighlight();
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
		setActiveOverlay,
		filteredLayers,
	};
}
