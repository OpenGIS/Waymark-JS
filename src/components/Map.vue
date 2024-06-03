<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useMapStore } from "@/stores/mapStore.js";

const mapStore = useMapStore();
const { id } = storeToRefs(mapStore);

const { initMap } = mapStore;

onMounted(() => {
	const map = initMap();
});
</script>

<template>
	<!-- Map -->
	<div class="map" :id="`${id}-map`"></div>
</template>

<style lang="less">
.map {
	width: inherit;
	height: inherit;
}
</style>
