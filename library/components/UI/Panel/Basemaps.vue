<script setup>
import { useInstanceStore } from "@/stores/instanceStore.js";
import Button from "@/components/UI/Common/Button.vue";

const { state } = useInstanceStore();

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

	const zoom = parseInt(state.map.getZoom());
	const lat = state.map.getCenter().lat;
	const lng = state.map.getCenter().lng;
	const x = lon2tile(lng, zoom);
	const y = lat2tile(lat, zoom);

	// Replace {z}, {x}, {y} with actual values
	return tile_url.replace("{z}", zoom).replace("{x}", x).replace("{y}", y);
};

const updateTileLayer = (tileLayer) => {
	// Remove all tile layers
	state.tileLayers.eachLayer((layer) => {
		state.map.removeLayer(layer);
	});

	// Add selected tile layer
	state.map.addLayer(tileLayer);

	// Set active tile layer
	state.activeTileLayer = tileLayer;
};
</script>

<template>
	<div class="panel basemaps">
		<h3>Basemaps</h3>

		<div class="list">
			<!-- Iterate over Leaflet Tile Layers -->
			<div
				v-for="(tileLayer, index) in state.tileLayers.getLayers()"
				:key="index"
				:class="`tile-layer ${tileLayer.options.name}`"
			>
				<div class="name">{{ tileLayer.options.name }}</div>

				<div class="preview">
					{{ tilePreviewUrl(tileLayer._url) }}

					<img :src="tilePreviewUrl(tileLayer._url)" />
				</div>

				<div class="attribution" v-html="tileLayer.options.attribution"></div>

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
