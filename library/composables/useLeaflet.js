import { computed } from "vue";
import { storeToRefs } from "pinia";
import { createMarker, createLineStyle } from "@/helpers/Map.js";

// Import MapLibre
// import { Map, LngLatBounds } from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";

// Import Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useLeaflet() {
	let id = "map";

	// View
	let lng = null;
	let lat = null;
	let zoom = null;

	// Dimensions
	// let width = null;
	// let height = null;

	// Data
	let geoJSON = {};

	let map = null;

	// const dataBounds = new LngLatBounds();

	const createMap = (config) => {
		const instanceStore = useInstanceStore();
		const { storeMarker, storeMap, storeLine, storeTileLayer } = instanceStore;
		const { mapConfig, tileLayers, activeTileLayer } =
			storeToRefs(instanceStore);

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

		// Create & Store Map
		map = L.map(id);
		storeMap(map);

		// Create Tile Layers
		if (Array.isArray(mapConfig.tile_layers)) {
			// Each Tile Layer
			mapConfig.tile_layers.forEach((tile_data) => {
				// Create Tile Layer
				const layer = L.tileLayer(tile_data.layer_url, {
					maxZoom: parseInt(tile_data.layer_max_zoom),
					attribution: tile_data.layer_attribution,
				});

				storeTileLayer(layer, tile_data);
			});
		} else {
			const layer = L.tileLayer(
				"https://tile.openstreetmap.org/{z}/{x}/{y}.png?r=1",
				{
					maxZoom: 19,
					attribution:
						'\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				},
			);
			storeTileLayer(layer, {
				layer_name: "OpenStreetMap",
				layer_url: layer._url,
				layer_max_zoom: layer.options.maxZoom,
				layer_attribution: layer.options.attribution,
			});
		}

		// Add First as active Tile Layer
		activeTileLayer.value = tileLayers.value[0].layer;
		activeTileLayer.value.addTo(map);

		// Set Event Handlers
		map.on("load", () => {
			// Add GeoJSON
			if (config.geoJSON && Array.isArray(config.geoJSON.features)) {
				geoJSON = config.geoJSON;

				// Create Bounds
				const dataBounds = new L.latLngBounds();

				// Markers
				pointsFeatures.value.forEach((feature) => {
					//Extend bounds
					dataBounds.extend(
						L.latLng(
							feature.geometry.coordinates[1],
							feature.geometry.coordinates[0],
						),
					);

					// Create the Marker
					const marker = createMarker(feature);

					// Add Marker to Map
					marker.addTo(map);

					// Add Marker to Store
					storeMarker(marker, feature);
				});

				// Lines
				linesFeatures.value.forEach((feature) => {
					//Extend bounds
					feature.geometry.coordinates.forEach((coords) => {
						dataBounds.extend(coords[1], coords[0]);
					});

					// Create Polyline
					const line = L.polyline(
						feature.geometry.coordinates.map((coords) => {
							return L.latLng(coords[1], coords[0]);
						}),
						createLineStyle(feature),
					);

					// Add Line to Map
					map.addLayer(line);

					// Add Line to Store
					storeLine(line, feature);
				});

				// Set Map bounds
				map.fitBounds(dataBounds, {
					padding: [30, 30],
					animate: false,
				});
			}
		});

		// Initialise the Map
		map.setView([lat, lng], zoom);

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
