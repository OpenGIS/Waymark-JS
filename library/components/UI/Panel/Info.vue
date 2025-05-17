<script setup>
import { useInstanceStore } from "@/stores/instanceStore.js";

const { state } = useInstanceStore();
</script>

<template>
	<div class="panel info">
		<h3>Key</h3>

		<h3>Basemap</h3>

		<div class="name">{{ state.activeTileLayer.options.name }}</div>

		<div
			class="attribution"
			v-html="state.activeTileLayer.options.attribution"
		></div>
	</div>
</template>

<style></style>
