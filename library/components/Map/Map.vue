<script setup>
import { onMounted } from "vue";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { id, initMap } = useInstanceStore();

onMounted(() => {
	initMap();
});
</script>

<template>
	<div class="map" :id="`${id}-map`"></div>
</template>

<style lang="less">
.map {
	width: 50%;
	height: 100%;
}
</style>
