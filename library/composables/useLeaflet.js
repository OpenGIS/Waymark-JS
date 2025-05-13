// import { computed } from "vue";
import { storeToRefs } from "pinia";

// Import Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import Helpers
import { getTypeData, getFeatureType, getIconData } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useLeaflet() {
	const instanceStore = useInstanceStore();
	const { state, config } = instanceStore;

	const createMap = () => {
		// Create & Store Map
		return L.map(
			`${config.map_options.div_id}-map`,
			config.map_options.leaflet_options,
		);
	};

	const createTileLayerGroup = () => {
		const layerGroup = L.layerGroup();

		// Create Tile Layers
		if (Array.isArray(config.map_options.tile_layers)) {
			// Each Tile Layer
			config.map_options.tile_layers.forEach((tile_data) => {
				// Create Tile Layer
				layerGroup.addLayer(
					L.tileLayer(tile_data.layer_url, {
						maxZoom: parseInt(tile_data.layer_max_zoom),
						attribution: tile_data.layer_attribution,
					}),
				);
			});
			// Default to OpenStreetMap
		} else {
			layerGroup.addLayer(
				L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?r=1", {
					maxZoom: 19,
					attribution:
						'\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				}),
			);
		}

		return layerGroup;
	};

	const createDataLayer = () => {
		return L.geoJSON(config.geoJSON, {
			// Create Markers
			pointToLayer,
			onEachFeature,
		});
	};

	// Create Markers
	const pointToLayer = (feature, latlng) => {
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
		const marker = L.marker([latlng.lat, latlng.lng], {
			icon: L.divIcon({
				className: iconData.className,
				html: el,
				iconSize: iconData.iconSize,
				iconAnchor: iconData.iconAnchor,
			}),
		});

		marker.feature = feature;

		return marker;
	};

	const onEachFeature = (feature, layer) => {
		layer.feature = feature;

		const typeKey = makeKey(feature.properties.type);
		const typeData = getTypeData(getFeatureType(feature), typeKey);

		switch (getFeatureType(feature)) {
			case "line":
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
	};

	return {
		createMap,
		createDataLayer,
		createTileLayerGroup,
		pointToLayer,
		onEachFeature,
	};
}
