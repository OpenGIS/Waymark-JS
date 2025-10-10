import { storeToRefs } from "pinia";
import { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { featureTypes, getFeatureType } from "@/helpers/Overlay.js";

import { fitBoundsOptions, flyToOptions } from "@/helpers/MapLibre.js";

// Classes
import {
	MarkerOverlay,
	LineOverlay,
	ShapeOverlay,
} from "@/classes/Overlays.js";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useMap() {
	// Get the state from the instance store
	const {
		config,
		map,
		mapReady,
		mapBounds,
		overlays,
		overlaysBounds,
		activeOverlay,
		activeFeatureType,
		panelOpen,
		activePanelKey,
		activeTileLayer,
	} = storeToRefs(useInstanceStore());

	// Create & Store Map
	const init = () => {
		const mapOptions = {
			...config.value.mapLibreOptions,
			container: `${config.value.getMapOption("div_id")}-map`,
		};

		// Create MapLibre instance
		map.value = new Map(mapOptions);

		// Triggers the UI to populate
		map.value.on("load", () => {
			// Add Tile Layers
			config.value.getTileLayers().forEach((tileLayer) => {
				// If no active Tile Layer
				if (!activeTileLayer.value.id) {
					// Set the first one as active
					activeTileLayer.value = tileLayer;
				}
				tileLayer.addTo(map.value, tileLayer === activeTileLayer.value);
			});

			mapReady.value = true;
			mapBounds.value = map.value.getBounds();
		});

		// Lines & Shape click handling
		map.value.on("click", (e) => {
			// Create a bounding box to find features within a certain distance of the click
			const bbox = [
				[e.point.x - 10, e.point.y - 10],
				[e.point.x + 10, e.point.y + 10],
			];
			const features = map.value.queryRenderedFeatures(bbox, {
				layers: overlays.value
					.filter((o) => o.featureType !== "marker")
					.map((o) => o.id),
			});

			if (features.length) {
				const overlay = overlays.value.find(
					(o) => o.id === features[0].layer.id,
				);
				if (overlay) {
					setActiveOverlay(overlay);
				}
				// No features found
			} else {
				// If Active overlay
				if (activeOverlay.value) {
					// Remove active overlay
					setActiveOverlay();
				} else {
					// Close Panel
					panelOpen.value = false;
					activePanelKey.value = null;
				}
			}
		});

		//Track map bounds
		map.value.on("moveend", () => {
			//Set Max bounds
			mapBounds.value = map.value.getBounds();
		});
	};

	const loadGeoJSON = (geoJSON) => {
		// Data Layer - GeoJSON Present?
		if (geoJSON && Array.isArray(geoJSON.features)) {
			// If ! mapReady then wait till it is
			if (!mapReady.value) {
				map.value.on("load", () => {
					loadGeoJSON(geoJSON);
				});
				return;
			}

			console.log("Adding GeoJSON to Map", geoJSON);

			// Overlays
			geoJSON.features.forEach((feature) => {
				// Determine Feature Type
				const featureType = getFeatureType(feature);

				if (!featureType || !featureTypes.includes(featureType)) {
					console.warn(
						"Feature Type not recognised or supported - skipping",
						feature,
					);
					return;
				}

				// Create Overlay instance
				const overlayId = `overlay-${overlays.value.length}`;

				const overlay = (() => {
					switch (featureType) {
						case "marker":
							return new MarkerOverlay(feature, config.value, overlayId);
						case "line":
							return new LineOverlay(feature, config.value, overlayId);
						case "shape":
							return new ShapeOverlay(feature, config.value, overlayId);
					}
				})();

				// Add to store (reassign to trigger shallowRef updates)
				overlays.value = [...overlays.value, overlay];

				// Add to Map
				overlay.addTo(map.value);

				// Handle Markers
				if (overlay instanceof MarkerOverlay) {
					overlay.marker.getElement().addEventListener("click", (e) => {
						e.stopPropagation();
						setActiveOverlay(overlay);
					});
				}
			});

			console.log("Overlays added to map", overlaysBounds.value);

			// If there is not an initial view
			if (!config.value.getInitialView()) {
				// Update bounds to encompass new Overlays
				map.value.fitBounds(overlaysBounds.value, fitBoundsOptions);
			}
		}
	};

	const clearGeoJSON = () => {
		// Remove all overlays from map & store
		overlays.value.forEach((overlay) => {
			overlay.remove();
		});
		overlays.value = [];

		// Clear active overlay
		activeOverlay.value = null;
	};

	const toGeoJSON = () => {
		const featureCollection = {
			type: "FeatureCollection",
			features: [],
		};

		overlays.value.forEach((overlay) => {
			featureCollection.features.push(overlay.toGeoJSON());
		});

		return featureCollection;
	};

	const setActiveOverlay = (overlay = null) => {
		if (!overlay) {
			// Remove highlight
			if (activeOverlay.value) {
				activeOverlay.value.removeHighlight();
			}
			activeOverlay.value = null;
			return;
		}

		// If active layer is set
		if (activeOverlay.value) {
			//If already active layer - focus on it
			if (activeOverlay.value === overlay) {
				overlay.zoomIn();

				// Stop here
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
		overlay.flyTo();
		overlay.addHighlight();
	};

	const resetView = () => {
		map.value.fitBounds(overlaysBounds.value, flyToOptions);
	};

	return {
		init,
		loadGeoJSON,
		clearGeoJSON,
		toGeoJSON,
		setActiveOverlay,
		resetView,
	};
}
