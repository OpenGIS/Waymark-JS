import { storeToRefs } from "pinia";
import { LngLatBounds } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

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
			config.value.getMapOption("maplibre_options"),
		);

		console.log("Map instance created", config.value);

		// Data Layer - GeoJSON Present?
		if (config.value.geoJSON && Array.isArray(config.value.geoJSON.features)) {
			console.log("Adding GeoJSON to Map", config.value.geoJSON);

			const dataBounds = new LngLatBounds();

			map.value.on("load", () => {
				// Add GeoJSON Source
				// map.value.addSource("data", {
				// 	type: "geojson",
				// 	data: config.value.geoJSON,
				// });

				// Overlays
				let overlayCount = 0;
				config.value.geoJSON.features.forEach((feature) => {
					// Create Overlay instance
					const overlay = new Overlay(feature, `overlay-${overlayCount++}`);

					// Add to store
					overlays.value.push(overlay);

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

				//Set initial centre and zoom to it
				map.value.setCenter(dataBounds.getCenter());
				map.value.fitBounds(dataBounds, {
					padding: 30,
					animate: false,
				});

				//Track map bounds
				mapBounds.value = map.value.getBounds();
				map.value.on("moveend", () => {
					//Set Max bounds
					mapBounds.value = map.value.getBounds();
				});
			});
		}

		// Triggers the UI to populate
		map.value.on("load", () => {
			mapReady.value = true;
		});
	};

	const setActiveOverlay = (overlay) => {
		console.log("Set Active Overlay", overlay);

		// If active layer is set
		if (activeOverlay.value) {
			//If already active layer - focus on it
			if (activeOverlay.value === overlay) {
				switch (overlay.featureType) {
					case "marker":
						console.log("Focus on Marker");
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
		setActiveOverlay,
	};
}
