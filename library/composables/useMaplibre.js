import { storeToRefs } from "pinia";
import { onMounted, computed } from "vue";
import { createMapStyle } from "@/helpers/Map.js";

// Import MapLibre
import * as MapLibreGL from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Import MapStore
import { useMapStore } from "@/stores/mapStore.js";

// Import Helpers
import { getTypeData, getFeatureType, getIconData } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

export function useMaplibre() {
	let id = "map";

	let lng = -128.0094;
	let lat = 50.6539;
	let zoom = 16;
	let geoJSON = {};

	let map = null;

	const dataBounds = new MapLibreGL.LngLatBounds();

	const createMap = (config) => {
		const mapStore = useMapStore();
		const { mapConfig } = storeToRefs(mapStore);

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
					const typeData = getTypeData(
						getFeatureType(feature),
						makeKey(feature.properties.type),
					);
					const iconData = getIconData(typeData);

					// create a DOM element for the marker
					const el = document.createElement("div");
					el.className = iconData.className;
					el.innerHTML = iconData.html;
					el.style.width = `${iconData.iconSize[0]}px`;
					el.style.height = `${iconData.iconSize[1]}px`;

					// add marker to map
					const marker = new MapLibreGL.Marker({
						element: el,
						offset: iconData.iconAnchor,
					});

					marker.setLngLat(feature.geometry.coordinates);
					marker.addTo(map);

					//Extend bounds
					dataBounds.extend(feature.geometry.coordinates);

					const overlay = mapStore.addMarker(marker, feature);

					el.addEventListener("click", () => {
						mapStore.setActiveOverlay(overlay);
					});

					el.addEventListener("mouseenter", () => {
						mapStore.toggleHoverOverlay(overlay);
					});

					el.addEventListener("mouseleave", () => {
						mapStore.toggleHoverOverlay(overlay);
					});
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
