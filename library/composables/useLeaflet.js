// Import Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { storeToRefs } from "pinia";

// Import Helpers
import { getTypeData, getFeatureType, getIconData } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

// Import instanceStore
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useLeaflet() {
	const { config, map, overlays } = storeToRefs(useInstanceStore());

	const createMap = () => {
		// Create & Store Map
		return L.map(
			`${config.value.map_options.div_id}-map`,
			config.value.map_options.leaflet_options,
		);
	};

	const createTileLayerGroup = () => {
		const layerGroup = L.layerGroup();

		// Create Tile Layers
		if (Array.isArray(config.value.map_options.tile_layers)) {
			// Each Tile Layer
			config.value.map_options.tile_layers.forEach((tile_data) => {
				// Create Tile Layer
				layerGroup.addLayer(
					L.tileLayer(tile_data.layer_url, {
						maxZoom: parseInt(tile_data.layer_max_zoom),
						attribution: tile_data.layer_attribution,
						name: tile_data.layer_name,
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
					name: "OpenStreetMap",
				}),
			);
		}

		return layerGroup;
	};

	const createDataLayer = () => {
		return L.geoJSON(config.value.geoJSON, {
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

		return marker;
	};

	const onEachFeature = (feature, layer) => {
		const typeKey = makeKey(feature.properties.type);
		const typeData = getTypeData(getFeatureType(feature), typeKey);
		const featureType = getFeatureType(feature) + "s";

		// Add to appropriate Type group
		if (!overlays.value[featureType][typeKey]) {
			// Needs creating
			overlays.value[featureType][typeKey] = L.featureGroup();
		}
		overlays.value[featureType][typeKey].addLayer(layer);

		switch (featureType) {
			case "lines":
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

	const isLayerInView = (layer) => {
		const mapBounds = map.value.getBounds();

		return isLayerInBounds(layer, mapBounds);
	};

	const isLayerInBounds = (layer, bounds) => {
		const featureType = getFeatureType(layer.feature);
		let contains = false;

		switch (featureType) {
			case "marker":
				//In view
				contains = bounds.contains(layer.getLatLng());

				break;
			case "line":
				// Check if coords are in view
				layer.feature.geometry.coordinates.forEach((coords) => {
					if (!contains && bounds.contains(L.latLng(coords[1], coords[0]))) {
						contains = true;

						return;
					}
				});

				break;
			//In view
			// return mapBounds.contains()

			// case 'shape':
			//In view
			// return mapBounds.contains(overlay.layer.getLatLng())
		}

		return contains;
	};

	const focusMapOnLayer = (layer) => {
		switch (getFeatureType(layer.feature)) {
			case "marker":
				map.value.flyTo(layer.getLatLng());

				break;

			case "line":
				// Set to bounds of Line
				const lineBounds = L.latLngBounds(layer.getLatLngs());
				map.value.flyToBounds(lineBounds);

				break;
		}
	};

	const highlightLayer = (layer) => {
		// Get feature type
		const featureType = getFeatureType(layer.feature);

		switch (featureType) {
			case "marker":
				// Get marker
				const element = layer.getElement();

				// Add active class
				element.classList.add("waymark-active");

				break;

			case "line":
				const typeKey = makeKey(layer.feature.properties.type);
				const typeData = getTypeData(featureType, typeKey);

				// Highlight Layer
				layer.setStyle({
					color: "#ff0000",
					weight: parseInt(typeData.line_weight) + 2,
					opacity: 1,
				});

				break;
		}
	};

	const unHighlightLayer = (layer) => {
		// Get feature type
		const featureType = getFeatureType(layer.feature);

		switch (featureType) {
			case "marker":
				// Get marker
				const element = layer.getElement();

				// Remove active class
				element.classList.remove("waymark-active");

				break;

			case "line":
				const typeKey = makeKey(layer.feature.properties.type);
				const typeData = getTypeData(featureType, typeKey);

				// Highlight Layer
				layer.setStyle({
					color: typeData.line_colour,
					weight: parseInt(typeData.line_weight),
					opacity: typeData.line_opacity,
				});

				break;
		}
	};

	return {
		createMap,
		createDataLayer,
		createTileLayerGroup,
		pointToLayer,
		onEachFeature,
		isLayerInView,
		isLayerInBounds,
		focusMapOnLayer,
		highlightLayer,
		unHighlightLayer,
	};
}
