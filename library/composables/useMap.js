import { storeToRefs } from "pinia";
import { LngLatBounds } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { makeKey } from "@/helpers/Common.js";
import { getFeatureType } from "@/helpers/Overlay.js";

import {
	createMap,
	createMapStyle,
	fitBoundsOptions,
} from "@/helpers/MapLibre.js";

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
		mapBounds,
		overlays,
		activeOverlay,
		activeFeatureType,
		panelOpen,
		activePanelKey,
	} = storeToRefs(useInstanceStore());

	// Create & Store Map
	const init = () => {
		// Create MapLibre instance
		map.value = createMap(
			`${config.value.getMapOption("div_id")}-map`,
			createMapStyle(config.value.getMapOption("tile_layers")),
			config.value.mapLibreMapOptions,
		);

		console.log("Map instance created", config.value);

		// Triggers the UI to populate
		map.value.on("load", () => {
			mapReady.value = true;
			mapBounds.value = map.value.getBounds();
		});

		//Track map bounds
		map.value.on("moveend", () => {
			//Set Max bounds
			mapBounds.value = map.value.getBounds();
		});

		// Make Lines easier to click by listening to Map click event and then finding the nearest Lines
		map.value.on("click", (e) => {
			// Create a bounding box to find features within a certain distance of the click
			const bbox = [
				[e.point.x - 10, e.point.y - 10],
				[e.point.x + 10, e.point.y + 10],
			];
			const features = map.value.queryRenderedFeatures(bbox, {
				layers: overlays.value
					.filter((o) => o.featureType === "line")
					.map((o) => o.id),
			});

			if (features.length) {
				const overlay = overlays.value.find(
					(o) => o.id === features[0].layer.id,
				);
				if (overlay) {
					setActiveOverlay(overlay);
				}
			}
		});

		if (config.value.geoJSON) {
			console.log("GeoJSON found in config - loading", config.value.geoJSON);
			loadGeoJSON(config.value.geoJSON);
		}
	};

	const loadGeoJSON = (geoJSON) => {
		// Data Layer - GeoJSON Present?
		if (geoJSON && Array.isArray(geoJSON.features)) {
			console.log("Adding GeoJSON to Map", geoJSON);

			const dataBounds = new LngLatBounds();

			map.value.on("load", () => {
				// Overlays
				let overlayCount = 0;
				geoJSON.features.forEach((feature) => {
					// Check for feature.properties.type
					const typeKey = makeKey(feature.properties.type);
					const featureType = getFeatureType(feature);

					// Get Type from config
					const type = config.value.getType(featureType, typeKey);

					if (!type) {
						console.warn(
							`Type not found for ${featureType} Type ${typeKey}`,
							feature,
						);
						return;
					}

					// Create Overlay instance
					const overlayId = `overlay-${overlayCount++}`;
					const overlay = new Overlay(feature, type, overlayId);

					// Add to store
					overlays.value.push(overlay);

					// Add to Map
					overlay.addTo(map.value);

					// Handle Events
					switch (overlay.featureType) {
						case "marker":
							overlay.layer.getElement().addEventListener("click", (e) => {
								e.stopPropagation();
								setActiveOverlay(overlay);
							});

							break;
						case "line":
							// Cursor pointer on hover
							map.value.on("mouseenter", overlay.id, () => {
								map.value.getCanvas().style.cursor = "pointer";
							});
							map.value.on("mouseleave", overlay.id, () => {
								map.value.getCanvas().style.cursor = "";
							});

							break;
						case "shape":
							break;
					}

					// Extend bounds
					dataBounds.extend(overlay.getBounds());
				});

				// Extend current map view to also include data bounds
				if (dataBounds.isEmpty() === false) {
					map.value.fitBounds(dataBounds, fitBoundsOptions);
				}
			});
		}
	};

	const setActiveOverlay = (overlay) => {
		// If active layer is set
		if (activeOverlay.value) {
			//If already active layer - focus on it
			if (activeOverlay.value === overlay) {
				switch (overlay.featureType) {
					case "marker":
						// Increase maplibre zoom to 18
						overlay.zoomIn();

						break;
					case "line":
					case "shape":
						// console.log("Focus on Line/Shape");
						break;
				}

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

	return {
		init,
		loadGeoJSON,
		setActiveOverlay,
	};
}
