<script setup>
import { useInstanceStore } from "@/stores/instanceStore.js";

const { state } = useInstanceStore();
</script>

<template>
	<h3>Key</h3>

	<h3>Basemap</h3>

	<div class="name">{{ state.activeTileLayer.options.name }}</div>

	<div
		class="attribution"
		v-html="state.activeTileLayer.options.attribution"
	></div>
</template>

<style></style>
