<script setup>
import UI from "@/components/UI.vue";

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
	<!-- Map -->
	<div class="map" :id="id">
		<!-- Map -->
		<div class="map" :id="`${id}-map`"></div>

		<!-- UI -->
		<UI />
	</div>
</template>

<style lang="less">
.map {
	width: inherit;
	height: inherit;
}
</style>
