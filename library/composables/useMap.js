import { computed } from "vue";

// Import Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { storeToRefs } from "pinia";

// Import Helpers
import {
	createMap,
	createTileLayerGroup,
	createDataLayer,
} from "@/helpers/Leaflet.js";
import {
	getTypeData,
	getFeatureType,
	getOverlayTypeKey,
} from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useMap() {
	const {
		config,
		map,
		mapReady,
		filters,
		mapBounds,
		dataLayer,
		overlays,
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
				const typeKey = makeKey(feature.properties.type);
				const typeData = getTypeData(getFeatureType(feature), typeKey);
				const featureType = getFeatureType(feature) + "s";

				// Add to appropriate Type group
				if (!overlays.value[featureType][typeKey]) {
					// Needs creating
					overlays.value[featureType][typeKey] = L.featureGroup();
				}
				overlays.value[featureType][typeKey].addLayer(layer);

				// Add events
				layer.on("click", () => {
					setActiveLayer(layer);
				});

				switch (featureType) {
					case "lines":
						layer.setStyle({
							color: typeData.line_colour,
							weight: parseFloat(typeData.line_weight),
							opacity: typeData.line_opacity,
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
		viewDataBounds();

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

	const isLayerInBounds = (layer, bounds) => {
		const featureType = getFeatureType(layer.feature);
		let contains = false;

		switch (featureType) {
			case "marker":
				//In view
				contains = bounds.contains(layer.getLatLng());

				break;
			case "line":
				// Check if coords are in view
				layer.feature.geometry.coordinates.forEach((coords) => {
					if (!contains && bounds.contains(L.latLng(coords[1], coords[0]))) {
						contains = true;

						return;
					}
				});

				break;
			//In view
			// return mapBounds.contains()

			// case 'shape':
			//In view
			// return mapBounds.contains(overlay.layer.getLatLng())
		}

		return contains;
	};

	const focusMapOnLayer = (layer) => {
		switch (getFeatureType(layer.feature)) {
			case "marker":
				map.value.flyTo(layer.getLatLng(), map.value.getZoom(), {
					duration: 0.5,
				});

				break;

			case "line":
				// Set to bounds of Line
				const lineBounds = L.latLngBounds(layer.getLatLngs());
				map.value.flyToBounds(lineBounds, {
					duration: 0.5,
				});

				break;
		}
	};

	const highlightLayer = (layer) => {
		// Get feature type
		const featureType = getFeatureType(layer.feature);

		switch (featureType) {
			case "marker":
				// Get marker
				const element = layer.getElement();

				// Add active class
				element.classList.add("waymark-active");

				break;

			case "line":
				const typeKey = makeKey(layer.feature.properties.type);
				const typeData = getTypeData(featureType, typeKey);

				// Highlight Layer
				layer.setStyle({
					color: "#ff0000",
					weight: parseInt(typeData.line_weight) + 2,
					opacity: 1,
				});

				break;
		}
	};

	const unHighlightLayer = (layer) => {
		// Get feature type
		const featureType = getFeatureType(layer.feature);

		switch (featureType) {
			case "marker":
				// Get marker
				const element = layer.getElement();

				// Remove active class
				element.classList.remove("waymark-active");

				break;

			case "line":
				const typeKey = makeKey(layer.feature.properties.type);
				const typeData = getTypeData(featureType, typeKey);

				// Highlight Layer
				layer.setStyle({
					color: typeData.line_colour,
					weight: parseInt(typeData.line_weight),
					opacity: typeData.line_opacity,
				});

				break;
		}
	};

	const setActiveLayer = (layer) => {
		// If active layer is set
		if (activeLayer.value) {
			// If already active layer - focus on it
			if (activeLayer.value === layer) {
				switch (getFeatureType(layer.feature)) {
					case "marker":
						// Increase zoom to max layer zoom
						map.value.setView(layer.getLatLng(), map.value.getMaxZoom());

						break;
					case "line":
						focusMapOnLayer(layer);

						break;
					case "shape":
						break;
				}

				return;
			}

			// Remove highlight
			unHighlightLayer(activeLayer.value);

			// Make inactive
			activeLayer.value = null;
		}

		// Go to Overlay in Overlays panel
		activeFeatureType.value = getFeatureType(layer.feature);
		activePanelKey.value = "overlays";
		panelOpen.value = true;

		// Make active
		activeLayer.value = layer;
		focusMapOnLayer(layer);
		highlightLayer(layer);
	};

	const mapResized = () => {
		map.value.invalidateSize();
	};

	const viewDataBounds = () => {
		map.value.fitBounds(dataLayer.value.getBounds(), {
			padding: [30, 30],
			animate: false,
		});
	};

	const filteredLayers = computed(() => {
		const filtered = L.featureGroup();

		// Iterate over all overlays
		dataLayer.value.eachLayer((layer) => {
			const featureType = getFeatureType(layer.feature);
			const typeKey = getOverlayTypeKey(layer.feature);
			const typeData = getTypeData(featureType, typeKey);

			// Is it in the current map bounds
			if (
				filters.value.inBounds &&
				mapBounds.value &&
				!isLayerInBounds(layer, mapBounds.value)
			) {
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

		return filtered;
	});

	return {
		init,
		getMapContainerID,
		isLayerInBounds,
		focusMapOnLayer,
		highlightLayer,
		unHighlightLayer,
		setActiveLayer,
		mapResized,
		filteredLayers,
	};
}
