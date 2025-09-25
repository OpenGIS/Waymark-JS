import { computed } from "vue";
import { storeToRefs } from "pinia";

// Import Leaflet (old implementation - to be removed)
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import MapLibre (new implementation, migrating from Leaflet to MapLibre)
import { Map, LngLatBounds } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Import Helpers
import {
	// createMap,
	createTileLayerGroup,
	// createDataLayer,
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

import { Overlay } from "@/classes/Overlay.js";
import { getTypeData } from "@/helpers/Type.js";
import { makeKey } from "@/helpers/Common.js";

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
				// // Set Active Tile Layer
				// updateTileLayer(mapStyle.layers[0].id);

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

		/*

		// Create data layer
		dataLayer.value = createDataLayer(
			config.value.geoJSON,
			// On each feature
			(feature, layer) => {
				// Create Overlay instance
				layer.overlay = new Overlay(layer);

				// Add to appropriate Type group
				const featuresType = layer.overlay.featureType + "s";
				if (!layersByType.value[featuresType][layer.overlay.typeKey]) {
					// Needs creating
					layersByType.value[featuresType][layer.overlay.typeKey] =
						L.featureGroup();

					// Add Type instance
					layersByType.value[featuresType][layer.overlay.typeKey].type =
						layer.overlay.type;
				}
				layersByType.value[featuresType][layer.overlay.typeKey].addLayer(layer);

				// Add events
				layer.on("click", () => {
					setActiveLayer(layer);
				});

				// Create Style
				switch (featuresType) {
					case "lines":
						// Set line style
						layer.setStyle(layer.overlay.type.getLineStyle());

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
*/
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
