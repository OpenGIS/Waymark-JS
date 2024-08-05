import { computed } from "vue";
import { getMapStyle, createMarker, createLineStyle } from "@/helpers/Map.js";

// Import MapLibre
import { Map, LngLatBounds } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useMaplibre() {
	let id = "map";

	// View
	let lng = null;
	let lat = null;
	let zoom = null;

	// Dimensions
	let width = null;
	let height = null;

	// Data
	let geoJSON = {};

	let map = null;

	const dataBounds = new LngLatBounds();

	const createMap = (config) => {
		const { storeMarker, storeMap, storeLine } = useInstanceStore();

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
		map = new Map({
			container: id,
			style: getMapStyle(),
			center: [lng, lat],
			zoom: zoom,
			attributionControl: false,
		});

		storeMap(map);

		// Add GeoJSON
		if (config.geoJSON && Array.isArray(config.geoJSON.features)) {
			geoJSON = config.geoJSON;

			map.on("load", () => {
				// Markers
				pointsFeatures.value.forEach((feature) => {
					//Extend bounds
					dataBounds.extend(feature.geometry.coordinates);

					// Create the Marker
					const marker = createMarker(feature);

					// Add Marker to Map
					marker.addTo(map);

					// Add Marker to Store
					storeMarker(marker, feature);
				});

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
					// padding: 80,
					animate: false,
				});

				map.once("moveend", () => {
					//Set Max bounds
					// map.setMaxBounds(map.getBounds());

					lng = map.getCenter().lng.toFixed(4);
					lat = map.getCenter().lat.toFixed(4);
					zoom = parseInt(map.getZoom());
				});
			});
		}
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
