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
import {
	createMap,
	createMapStyle,
	createMarker,
	createLine,
} from "@/helpers/MapLibre.js";

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
		activeLayer,
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

		// Add GeoJSON
		if (config.value.geoJSON && Array.isArray(config.value.geoJSON.features)) {
			console.log("Adding GeoJSON to Map", config.value.geoJSON);

			const dataBounds = new LngLatBounds();

			map.value.on("load", () => {
				// Add GeoJSON Source
				map.value.addSource("data", {
					type: "geojson",
					data: config.value.geoJSON,
				});

				// Lines
				let lineCount = 0;
				config.value.geoJSON.features
					.filter((feature) => {
						return getFeatureType(feature) === "line";
					})
					.forEach((feature) => {
						//Extend bounds
						feature.geometry.coordinates.forEach((coords) => {
							dataBounds.extend(coords);
						});

						const line = createLine(feature, `line-${lineCount++}`);
						map.value.addLayer(line);
					});

				// Markers
				config.value.geoJSON.features
					.filter((feature) => {
						return getFeatureType(feature) === "marker";
					})
					.forEach((feature) => {
						//Extend bounds
						dataBounds.extend(feature.geometry.coordinates);

						// Create the Marker
						const marker = createMarker(feature);

						// Add Marker to Map
						marker.addTo(map.value);
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
