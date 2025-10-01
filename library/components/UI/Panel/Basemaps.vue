<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

import Button from "@/components/UI/Common/Button.vue";

const { config, map, activeTileLayer } = storeToRefs(useInstanceStore());

const tilePreviewUrl = (tileLayer) => {
	const tile_url = tileLayer.data.layer_url;

	const lon2tile = (lon, zoom) =>
		Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));

	const lat2tile = (lat, zoom) =>
		Math.floor(
			((1 -
				Math.log(
					Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180),
				) /
					Math.PI) /
				2) *
				Math.pow(2, zoom),
		);

	const zoom = parseInt(map.value.getZoom());
	const lat = map.value.getCenter().lat;
	const lng = map.value.getCenter().lng;
	const x = lon2tile(lng, zoom);
	const y = lat2tile(lat, zoom);

	// Replace {z}, {x}, {y} with actual values
	return tile_url.replace("{z}", zoom).replace("{x}", x).replace("{y}", y);
};

const updateTileLayer = (tileLayer) => {
	// Update active tile layer in store
	activeTileLayer.value = tileLayer;

	// Iterate over all MapLibre style raster layers (map.value.getStyle().layers)
	map.value.getStyle().layers.forEach((layer) => {
		if (layer.type === "raster") {
			// Set as invisible
			map.value.setLayoutProperty(layer.id, "visibility", "none");

			// If layer name matches, set as visible
			if (tileLayer.id == layer.id) {
				map.value.setLayoutProperty(layer.id, "visibility", "visible");
			}
		}
	});
};

const tileLayers = config.value.getTileLayers();
</script>

<template>
	<div class="panel basemaps">
		<h3>Basemaps</h3>

		<div class="list">
			<div
				class="list-item"
				v-for="(tileLayer, index) in tileLayers"
				:key="index"
				:class="{
					active: activeTileLayer === tileLayer,
				}"
				@click="updateTileLayer(tileLayer)"
			>
				<img
					:src="tilePreviewUrl(tileLayer)"
					:alt="tileLayer.data.layer_name"
					width="160"
					height="160"
				/>
				<div class="info">
					<h4>{{ tileLayer.data.layer_name }}</h4>
					<p v-html="tileLayer.data.layer_attribution"></p>
				</div>
			</div>
		</div>
	</div>
</template>

<style></style>
