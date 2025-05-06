import { computed } from "vue";
import {
	createTileLayers,
	createMarker,
	createLineStyle,
} from "@/helpers/Map.js";

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
		const { storeMarker, storeMap, storeLine, updateTileLayer } = instanceStore;

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

		// Create Map
		map = L.map(id, {
			center: L.latLng(lat, lng),
			zoom: zoom,
		});

		// Create Tile Layers
		const tileLayers = createTileLayers();

		// Add Tile Layers to Map
		tileLayers.forEach((layer) => {
			layer.addTo(map);
		});

		storeMap(map);

		// Add GeoJSON
		if (config.geoJSON && Array.isArray(config.geoJSON.features)) {
			geoJSON = config.geoJSON;

			// Create Bounds
			const dataBounds = new L.latLngBounds();

			// map.on("load", () => {

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
				// });

				/*
				// Lines
				let count = 0;
				linesFeatures.value.forEach((feature) => {
					//Extend bounds
					feature.geometry.coordinates.forEach((coords) => {
						dataBounds.extend(coords);
					});

					const id = `line-${count++}`;

					// Create Source
					map.addSource(id, {
						type: "geojson",
						data: feature,
					});

					// Create Line Style
					const line = createLineStyle(feature, id);

					// Add Line to Map
					map.addLayer(line);

					// Add Line to Store
					storeLine(line, feature);
				});

				//Set initial centre and zoom to it
				map.setCenter(dataBounds.getCenter());
				map.fitBounds(dataBounds, {
					padding: 30,
					animate: false,
				});

				map.once("moveend", () => {
					//Set Max bounds
					// map.setMaxBounds(map.getBounds());

					lng = map.getCenter().lng.toFixed(4);
					lat = map.getCenter().lat.toFixed(4);
					zoom = parseInt(map.getZoom());
				});
*/
			});

			console.log(dataBounds.toBBoxString());

			// Set Map bounds
			map.fitBounds(dataBounds, {
				padding: 30,
				animate: false,
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
