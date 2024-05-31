<script setup>
import { ref, onMounted, watch } from "vue";
// import { useMapStore } from "../stores/useMapStore";
// import { storeToRefs } from "pinia";

// Import MapLibre
import * as lib from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const props = defineProps({
	lng: {
		type: Number,
		default: -128.0094,
	},
	lat: {
		type: Number,
		default: 50.6539,
	},
	zoom: {
		type: Number,
		default: 16,
	},
});

onMounted(() => {
	// Create Map
	const map = new lib.Map({
		container: "map",
		style: {
			version: 8,
			sources: {
				"osm-tiles": {
					type: "raster",
					tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
					tileSize: 256,
					attribution:
						'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				},
			},
			layers: [
				{
					id: "osm-tiles",
					type: "raster",
					source: "osm-tiles",
				},
			],
		},
		center: [props.lng, props.lat],
		zoom: props.zoom,
	});

	// Sync Map Store when Map view changes
	// map.on("move", () => {
	// 	lng.value = map.getCenter().lng.toFixed(4);

	// 	lat.value = map.getCenter().lat.toFixed(4);
	// 	zoom.value = parseInt(map.getZoom());
	// });

	// Watch all Props
	// watch(props, (newProps) => {
	// 	console.log(newProps);

	// 	// Update Map
	// 	map.setCenter([newProps.lng, newProps.lat]);

	// 	map.setZoom(newProps.zoom);
	// });
});
</script>

<template>
	<div class="map" id="map"></div>
</template>

<style>
#map {
	width: 100%;
	height: 100%;
	min-height: 100vh;
}
</style>
