import { storeToRefs } from "pinia";
import { onMounted, computed } from "vue";
import { createMapStyle, createMarker } from "@/helpers/Map.js";

// Import MapLibre
import * as MapLibreGL from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useMaplibre() {
	let id = "map";

	// View
	let lng = -128.0094;
	let lat = 50.6539;
	let zoom = 16;

	// Data
	let geoJSON = {};

	let map = null;

	const dataBounds = new MapLibreGL.LngLatBounds();

	const createMap = (config) => {
		const instanceStore = useInstanceStore();
		const { mapConfig } = storeToRefs(instanceStore);
		const { addMarker } = instanceStore;

		if (config.id) {
			id = config.id;
		}

		if (config.lng) {
			lng = config.lng;
		}

		if (config.lat) {
			lat = config.lat;
		}

		if (config.zoom) {
			zoom = config.zoom;
		}

		// Use Config Tile Layer
		let mapStyle = createMapStyle();
		if (Array.isArray(mapConfig.value.tile_layers)) {
			mapStyle = createMapStyle(mapConfig.value.tile_layers[0]);
		}

		// Create Map
		map = new MapLibreGL.Map({
			container: id,
			style: mapStyle,
			center: [lng, lat],
			zoom: zoom,
		});

		// Add GeoJSON
		if (config.geoJSON) {
			geoJSON = config.geoJSON;

			// Ensure we have features
			if (
				typeof geoJSON.features === "undefined" ||
				!Array.isArray(geoJSON.features)
			) {
				return map;
			}

			map.on("load", () => {
				//Markers
				pointsFeatures.value.forEach((feature) => {
					//Extend bounds
					dataBounds.extend(feature.geometry.coordinates);

					// Create the Marker
					const marker = createMarker(feature);

					// Add Marker to Map
					marker.addTo(map);

					addMarker(marker, feature);
				});

				//Lines
				const dataSource = map.addSource("geoJSON", {
					type: "geojson",
					data: geoJSON,
				});

				const dataLayer = map.addLayer({
					id: "geoJSON",
					type: "line",
					source: "geoJSON",
					paint: {
						"line-color": "#088",
						"line-width": 2,
					},
				});

				//Extend bounds
				linesFeatures.value.forEach((feature) => {
					for (let i in feature.geometry.coordinates) {
						dataBounds.extend(feature.geometry.coordinates[i]);
					}
				});

				//Set initial centre and zoom to it
				map.setCenter(dataBounds.getCenter());
				map.fitBounds(dataBounds, { padding: 80 });

				map.once("moveend", () => {
					//Set Max bounds
					map.setMaxBounds(map.getBounds());

					lng = map.getCenter().lng.toFixed(4);
					lat = map.getCenter().lat.toFixed(4);
					zoom = parseInt(map.getZoom());
				});
			});
		}

		return map;
	};

	const pointsFeatures = computed(() => {
		// Ensure is valid Array
		if (
			typeof geoJSON.features === "undefined" ||
			!Array.isArray(geoJSON.features)
		) {
			return [];
		}

		return geoJSON.features.filter((feature) => {
			return feature.geometry.type === "Point";
		});
	});

	const linesFeatures = computed(() => {
		// Ensure is valid Array
		if (
			typeof geoJSON.features === "undefined" ||
			!Array.isArray(geoJSON.features)
		) {
			return [];
		}

		return geoJSON.features.filter((feature) => {
			return (
				["LineString", "MultiLineString"].indexOf(feature.geometry.type) !== -1
			);
		});
	});

	return {
		map,
		createMap,
	};
}
