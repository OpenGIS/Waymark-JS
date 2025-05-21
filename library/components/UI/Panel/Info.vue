<script setup>
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const { activeTileLayer } = storeToRefs(useInstanceStore());
</script>

<template>
	<div class="panel info">
		<h3>Key</h3>

		<h3>Basemap</h3>

		<div class="name">{{ activeTileLayer.options.name }}</div>

		<div class="attribution" v-html="activeTileLayer.options.attribution"></div>
	</div>
</template>

<style></style>
