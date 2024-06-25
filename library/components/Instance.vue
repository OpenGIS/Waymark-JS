<script setup>
import "@/assets/css/index.css";

import Map from "@/components/Map/Map.vue";
import UI from "@/components/UI/UI.vue";

import { useMapStore } from "@/stores/mapStore.js";
const { createStore } = useMapStore();

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

const geoJSON = defineModel("geoJSON", {
	type: Object,
	default: {},
});

const mapConfig = defineModel("mapConfig", {
	type: Object,
	default: {
		marker_types: [
			{
				marker_title: "Marker",
				marker_shape: "marker",
				marker_size: "small",
				icon_type: "icon",
				marker_icon: "ion-star",
				marker_colour: "#b42714",
				icon_colour: "#ffffff",
			},
		],
		line_types: [
			{
				line_title: "Line",
				line_colour: "#b42714",
				line_weight: "5",
				line_opacity: "0.75",
			},
		],
		shape_types: [
			{
				shape_title: "Shape",
				shape_colour: "#b42714",
				fill_opacity: "0.75",
			},
		],
	},
});

createStore({
	id,
	lng,
	lat,
	zoom,
	geoJSON,
	mapConfig,
});
</script>

<template>
	<!-- Instance -->
	<div class="instance" :id="`${id}-instance`">
		<Map />

		<UI />
	</div>
</template>

<style lang="less">
.instance {
	position: relative;
	height: 100%;
	width: 100%;

	display: flex;
}
</style>
