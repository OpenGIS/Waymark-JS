<script setup>
import { onMounted } from "vue";

import { useMapStore } from "@/stores/mapStore.js";
const { id, initMap } = useMapStore();

onMounted(() => {
	const map = initMap();
});
</script>

<template>
	<div class="map" :id="`${id}-map`"></div>
</template>

<style lang="less">
.map {
	width: 100%;
	height: 100%;
}
</style>
