<script setup>
import Map from "@/components/Map.vue";
import Bar from "@/components/UI/Bar.vue";
import Detail from "@/components/UI/Detail.vue";

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

createStore({
	id,
	lng,
	lat,
	zoom,
	geoJSON,
});
</script>

<template>
	<!-- App -->
	<div class="app" :id="id">
		<Map />

		<Bar />

		<Detail />
	</div>
</template>

<style lang="less">
.app {
	width: inherit;
	height: inherit;
}
</style>
