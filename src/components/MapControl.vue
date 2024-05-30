<script setup>
import { useMapStore } from "@/stores/useMapStore";
import { storeToRefs } from "pinia";

const { lng, lat, zoom, data } = storeToRefs(useMapStore());
</script>

<template>
	<!-- Options Form -->
	<form>
		<label for="lng">Longitude:</label>

		<!-- 5 Decimals is the default precision -->
		<input type="number" id="lng" v-model="lng" step="0.0001" />

		<label for="lat">Latitude:</label>
		<input type="number" id="lat" v-model="lat" step="0.0001" />

		<label for="zoom">Zoom:</label>

		<!-- Whole numbers only, min 0, max 22 -->
		<input type="number" id="zoom" v-model="zoom" min="0" max="22" />
	</form>

	<!-- Debug Output -->
	<pre>{{ { lng, lat, zoom } }}</pre>

	<!-- Data Output -->
	<pre>{{ data }}</pre>
</template>

<style>
form {
	position: absolute;
	top: 0;
	left: 0;
	background-color: white;
	padding: 1em;
}

pre {
	position: absolute;
	bottom: 0;
	left: 0;
	background-color: white;
	padding: 1em;
}
pre:last-child {
	right: 0;
	left: auto;
}
</style>
