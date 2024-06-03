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
	width: 100%;
	height: 100%;
	min-height: 400px;

	.debug {
		pre {
			position: absolute;
			bottom: 0;
			background-color: rgba(255, 255, 255, 0.6);
			padding: 1em;
			z-index: 1000;

			&:first-child {
				left: 0;
			}

			&:last-child {
				right: 0;
				left: auto;
			}
		}
	}
}
</style>
