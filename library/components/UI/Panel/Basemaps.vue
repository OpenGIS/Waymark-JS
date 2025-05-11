<script setup>
import { storeToRefs } from "pinia";

import { useInstanceStore } from "@/stores/instanceStore.js";
import Button from "@/components/UI/Common/Button.vue";

const instanceStore = useInstanceStore();
const { updateTileLayer } = instanceStore;

const { activeTileLayer, state, tileLayers } = storeToRefs(instanceStore);

const tilePreviewUrl = (tile_url) => {
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

	const zoom = parseInt(state.value.map.getZoom());
	const lat = state.value.map.getCenter().lat;
	const lng = state.value.map.getCenter().lng;
	const x = lon2tile(lng, zoom);
	const y = lat2tile(lat, zoom);

	// Replace {z}, {x}, {y} with actual values
	return tile_url.replace("{z}", zoom).replace("{x}", x).replace("{y}", y);
};
</script>

<template>
	<div class="panel basemaps">
		<h3>Basemaps</h3>

		<div class="list">
			<div v-for="(tileLayer, index) in tileLayers" :key="index" class="item">
				<div class="name">{{ tileLayer.name }}</div>

				<div class="preview">
					{{ tilePreviewUrl(tileLayer.url) }}

					<img :src="tilePreviewUrl(tileLayer.url)" />
				</div>

				<Button
					icon="ion-checkmark"
					@click="updateTileLayer(tileLayer)"
					:active="activeTileLayer == tileLayer"
				/>
			</div>
		</div>
	</div>
</template>

<style></style>
