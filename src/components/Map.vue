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
	default: 18,
});

const data = defineModel("data", {
	type: Object,
	default: null,
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

	// Data provided?
	if (data.value) {
		map.on("load", () => {
			console.log(data.value);

			map.addSource("data", {
				type: "geojson",
				data: data.value,
			});

			// Draw Points
			map.addLayer({
				id: "data-points",
				type: "circle",
				source: "data",
				paint: {
					"circle-radius": 6,
					"circle-color": "#B42222",
				},
			});

			// Draw Lines
			map.addLayer({
				id: "data-lines",
				type: "line",
				source: "data",
				layout: {
					"line-join": "round",
					"line-cap": "round",
				},
				paint: {
					"line-color": "#B42222",
					"line-width": 2,
				},
			});
		});

		// Get Bounds
		const bounds = data.value.features.reduce(
			(bounds, feature) => {
				return bounds.extend(feature.geometry.coordinates);
			},
			new lib.LngLatBounds(
				data.value.features[0].geometry.coordinates,
				data.value.features[0].geometry.coordinates,
			),
		);

		// Fit to bounds
		map.on("load", () => {
			map.fitBounds(bounds, {
				padding: 20,
				linear: true,
			});
		});
	}

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
		<div class="debug">
			<pre>{{ { lng, lat, zoom } }}</pre>

			<pre>{{ data }}</pre>
		</div>
	</div>
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
