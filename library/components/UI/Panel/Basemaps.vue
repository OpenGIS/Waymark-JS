<script setup>
import { useInstanceStore } from "@/stores/instanceStore.js";
import Button from "@/components/UI/Common/Button.vue";

const { mapConfig, switchBasemap } = useInstanceStore();

const basemaps = mapConfig.tile_layers;

const selectBasemap = (name) => {
	switchBasemap(name);
	console.log("Map Style Updated");
	console.log(name);
};

/*
	"tile_layers": [
		{
			"layer_name": "Satellite",
			"layer_url": "https://api.mapbox.com/styles/v1/sunlight76/ckbt6wyru0m2q1iql8agrv8an/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3VubGlnaHQ3NiIsImEiOiJja2J0M29lOHgwNmJkMnlvdm54cWg3MWRhIn0.FnqYWqvlJvxYO8MzUL-BVQ",
			"layer_attribution": "",
			"layer_max_zoom": "18"
		},
		{
			"layer_name": "Open Street Map",
			"layer_url": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			"layer_attribution": "\u00a9 <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
			"layer_max_zoom": "18"
		},
		{
			"layer_name": "OpenCycleMap",
			"layer_url": "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=97fe929c59934b1a822efdbb252cff39",
			"layer_attribution": "\u00a9 <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
			"layer_max_zoom": "18"
		},
		{
			"layer_name": "OutDoor",
			"layer_url": "https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=97fe929c59934b1a822efdbb252cff39",
			"layer_attribution": "\u00a9 <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
			"layer_max_zoom": "18"
		}
	],
*/
</script>

<template>
	<div class="panel basemaps">
		<h3>Basemaps</h3>

		<div class="list">
			<div v-for="(basemap, index) in basemaps" :key="index" class="item">
				<div class="name">{{ basemap.layer_name }}</div>

				<Button
					icon="ion-checkmark"
					@click="selectBasemap(basemap.layer_name)"
					:active="basemap.layer_name === mapConfig.active_basemap"
				/>
			</div>
		</div>
	</div>
</template>

<style></style>
