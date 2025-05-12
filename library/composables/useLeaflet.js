import { computed } from "vue";
import { storeToRefs } from "pinia";

// Import Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import Helpers
import { getTypeData, getFeatureType, getIconData } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

function createLine(feature = {}) {
	// Ensure is LineString with coordinates
	if (getFeatureType(feature) !== "line" || !feature.geometry.coordinates) {
		return null;
	}

	const typeKey = makeKey(feature.properties.type);
	const typeData = getTypeData("line", typeKey);

	return L.polyline(
		feature.geometry.coordinates.map((coords) => {
			return L.latLng(coords[1], coords[0]);
		}),
		{
			color: typeData.line_colour,
			weight: parseFloat(typeData.line_weight),
			opacity: typeData.line_opacity,
		},
	);
}

function createMarker(feature = {}) {
	// Ensure is Marker with coordinates
	if (getFeatureType(feature) !== "marker" || !feature.geometry.coordinates) {
		return null;
	}

	const typeKey = makeKey(feature.properties.type);
	const typeData = getTypeData("marker", typeKey);
	const iconData = getIconData(typeData);

	// Create a DOM element for the marker
	const el = document.createElement("div");
	el.className = iconData.className;
	el.innerHTML = iconData.html;
	el.style.width = `${iconData.iconSize[0]}px`;
	el.style.height = `${iconData.iconSize[1]}px`;

	// Create Marker
	const marker = L.marker(
		[feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
		{
			icon: L.divIcon({
				className: iconData.className,
				html: el,
				iconSize: iconData.iconSize,
				iconAnchor: iconData.iconAnchor,
			}),
		},
	);

	return marker;
}

export function useLeaflet() {
	const createMap = () => {
		const instanceStore = useInstanceStore();
		const { storeOverlay, storeTileLayer, state } = instanceStore;
		const { config, tileLayers, activeTileLayer } = storeToRefs(instanceStore);

		const pointsFeatures = computed(() => {
			// Ensure is valid Array
			if (
				typeof config.value.geoJSON.features === "undefined" ||
				!Array.isArray(config.value.geoJSON.features)
			) {
				return [];
			}

			return config.value.geoJSON.features.filter((feature) => {
				return feature.geometry.type === "Point";
			});
		});

		const linesFeatures = computed(() => {
			// Ensure is valid Array
			if (
				typeof config.value.geoJSON.features === "undefined" ||
				!Array.isArray(config.value.geoJSON.features)
			) {
				return [];
			}

			return config.value.geoJSON.features.filter((feature) => {
				return (
					["LineString", "MultiLineString"].indexOf(feature.geometry.type) !==
					-1
				);
			});
		});

		console.log("Map Options", config.value.map_options);

		// Create & Store Map
		state.map = L.map(
			`${config.value.map_options.div_id}-map`,
			config.value.map_options.leaflet_options,
		);
		// storeMap(map);

		// Create Tile Layers
		if (Array.isArray(config.value.map_options.tile_layers)) {
			// Each Tile Layer
			config.value.map_options.tile_layers.forEach((tile_data) => {
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
		activeTileLayer.value.addTo(state.map);

		// Add GeoJSON
		if (config.value.geoJSON && Array.isArray(config.value.geoJSON.features)) {
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
				marker.addTo(state.map);

				// Add Marker to Store
				storeOverlay(marker);
			});

			// Lines
			linesFeatures.value.forEach((feature) => {
				//Extend bounds
				feature.geometry.coordinates.forEach((coords) => {
					dataBounds.extend(coords[1], coords[0]);
				});

				// Create Polyline
				const line = createLine(feature);

				// Add Line to Map
				state.map.addLayer(line);

				// Add Line to Store
				storeOverlay(line);
			});

			// Update loaded state
			state.mapLoaded = true;

			// Set Map bounds
			state.map.fitBounds(dataBounds, {
				padding: [30, 30],
				animate: false,
			});
		}
	};

	return {
		createMap,
	};
}
