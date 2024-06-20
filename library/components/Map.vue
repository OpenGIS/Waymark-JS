<script setup>
import { onMounted } from "vue";

import "@/assets/css/index.css";

import Detail from "@/components/UI/Detail.vue";
import Bar from "@/components/UI/Bar.vue";

import { useMapStore } from "@/stores/mapStore.js";
const { createStore, initMap } = useMapStore();

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

createStore({
	id,
	lng,
	lat,
	zoom,
	geoJSON,
});

onMounted(() => {
	const map = initMap();
});
</script>

<template>
	<!-- Instance -->
	<div class="instance" :id="`${id}-instance`">
		<!-- Map -->
		<div class="map" :id="`${id}-map`"></div>

		<!-- UI -->
		<Detail />

		<Bar />
	</div>
</template>

<style lang="less">
.instance {
	position: relative;
	border: 1px solid orange;
	height: 100%;
	width: 100%;

	min-height: 480px !important;
	min-width: 320px !important;

	.map {
		width: 100%;
		height: 100%;
	}
}
</style>
