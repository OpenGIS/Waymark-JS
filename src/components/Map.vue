<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useMapStore } from "@/stores/mapStore.js";
import { getTypeData, getFeatureType, getIconData } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";
import { useMaplibre } from "@/composables/useMaplibre.js";
import * as MapLibreGL from "maplibre-gl";

import Marker from "@/components/Marker.vue";
import Bar from "@/components/Bar.vue";
import Detail from "@/components/Detail.vue";

const mapStore = useMapStore();
const { geoJSON, visibleOverlays, overlays, lng, lat, zoom, id } =
	storeToRefs(mapStore);

const { map, init } = useMaplibre();

const dataBounds = new MapLibreGL.LngLatBounds();

// ==== Computed ====

const pointsFeatures = computed(() => {
	// Ensure is valid Array
	if (
		typeof geoJSON.value.features === "undefined" ||
		!Array.isArray(geoJSON.value.features)
	) {
		return [];
	}

	return geoJSON.value.features.filter((feature) => {
		return feature.geometry.type === "Point";
	});
});

const linesFeatures = computed(() => {
	// Ensure is valid Array
	if (
		typeof geoJSON.value.features === "undefined" ||
		!Array.isArray(geoJSON.value.features)
	) {
		return [];
	}

	return geoJSON.value.features.filter((feature) => {
		return (
			["LineString", "MultiLineString"].indexOf(feature.geometry.type) !== -1
		);
	});
});

const updateVisibleOverlays = () => {
	const mapBounds = map.getBounds();

	//Check if overlay is visible
	visibleOverlays.value = overlays.value.filter((overlay) => {
		let contains = false;

		switch (overlay.featureType) {
			case "marker":
				//In view
				contains = mapBounds.contains(overlay.marker.getLngLat());

				break;
			// case 'line':
			//   if (contains) break

			//   overlay.layer.getLatLngs().forEach((element) => {
			//     if (mapBounds.contains(element)) {
			//       contains = true
			//     }
			//   })

			//   break
			//In view
			// return mapBounds.contains()

			// case 'shape':
			//In view
			// return mapBounds.contains(overlay.layer.getLatLng())
		}

		return contains;
	});
};

onMounted(() => {
	init({
		id: id.value + "-map",
		lng,
		lat,
		zoom,
	});

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
			data: geoJSON.value,
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

		//Update Visible whenever view changes
		//map.on('zoomend', updateVisibleOverlays).on('moveend', updateVisibleOverlays)

		//Set initial centre and zoom to it
		map.setCenter(dataBounds.getCenter());
		map.fitBounds(dataBounds, { padding: 80 });

		map.once("moveend", () => {
			//Set Max bounds
			map.setMaxBounds(map.getBounds());

			lng.value = map.getCenter().lng.toFixed(4);
			lat.value = map.getCenter().lat.toFixed(4);
			zoom.value = parseInt(map.getZoom());
		});
	});
});
</script>

<template>
	<!-- Map -->
	<div class="map" :id="`${id}-map`"></div>
</template>

<style lang="less">
.map {
	width: 100%;
	height: 100%;
	min-height: 400px;

	.debug {
		pre {
			position: absolute;
			bottom: 0;
			background-color: rgba(255, 255, 255, 0.6);
			padding: 1em;
			z-index: 1000;

			&:first-child {
				left: 0;
			}

			&:last-child {
				right: 0;
				left: auto;
			}
		}
	}
}
</style>
