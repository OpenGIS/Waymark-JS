<script setup>
import { onMounted, watch } from "vue";
// import { useMapStore } from "../stores/useMapStore";
// import { storeToRefs } from "pinia";

// Import MapLibre
import * as lib from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const id = defineModel("id", {
	type: String,
	default: "map",
});

const lng = defineModel("lng", {
	type: Number,
	default: -128.0094,
});

const lat = defineModel("lat", {
	type: Number,
	default: 50.6539,
});

const zoom = defineModel("zoom", {
	type: Number,
	default: 16,
});

onMounted(() => {
	// Create Map
	const map = new lib.Map({
		container: id.value,
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
		center: [lng.value, lat.value],
		zoom: zoom.value,
	});

	// Sync Map Store when Map view changes
	map.on("move", () => {
		lng.value = map.getCenter().lng.toFixed(4);
		lat.value = map.getCenter().lat.toFixed(4);
		zoom.value = parseInt(map.getZoom());
	});

	// Watch all Props
	// watch([lng, lat, zoom], ([lng, lat, zoom]) => {
	// 	map.setCenter([lng, lat]);
	// 	map.setZoom(zoom);
	// });
});
</script>

<template>
	<div class="map" :id="id">
		<!-- Debug -->
		<pre>{{ { lng, lat, zoom } }}</pre>
	</div>
</template>

<style>
.map {
	width: 100%;
	height: 100%;
	min-height: 400px;
}

pre {
	position: absolute;
	bottom: 0;
	left: 0;
	background-color: white;
	padding: 1em;
	z-index: 1000;
}
</style>
