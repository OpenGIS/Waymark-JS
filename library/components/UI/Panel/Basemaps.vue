<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useInstanceStore } from "@/stores/instanceStore.js";
import Button from "@/components/UI/Common/Button.vue";

const instanceStore = useInstanceStore();
const { mapConfig, updateTileLayer } = instanceStore;
const { activeTileLayer, map } = storeToRefs(instanceStore);

onMounted(() => {
	console.log(map.value);
});

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

	let zoom = parseInt(map.value.getZoom()),
		latitude = map.value.getCenter().lat,
		longitude = map.value.getCenter().lng,
		x = lon2tile(longitude, zoom),
		y = lat2tile(latitude, zoom);

	// Replace {z}, {x}, {y} with actual values
	return tile_url.replace("{z}", zoom).replace("{x}", x).replace("{y}", y);
};
</script>

<template>
	<div class="panel tileDatas">
		<h3>Basemaps</h3>

		<div class="list">
			<div
				v-for="(tileData, index) in mapConfig.tile_layers"
				:key="index"
				class="item"
			>
				<div class="name">{{ tileData.layer_name }}</div>

				<div class="preview">
					{{ tilePreviewUrl(tileData.layer_url) }}

					<img :src="tilePreviewUrl(tileData.layer_url)" />
					}
				</div>

				<Button
					icon="ion-checkmark"
					@click="updateTileLayer(tileData.layer_name)"
					:active="tileData.layer_name == activeTileLayer"
				/>
			</div>
		</div>
	</div>
</template>

<style></style>
