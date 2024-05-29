<script setup>
const options = reactive({
	// id: "map",
	lng: -128.0094,
	lat: 50.6539,
	zoom: 16,
});

const { state } = useMaplibre(options);
</script>

<template>
	<div class="map" id="map"></div>

	<!-- Options Form -->
	<form>
		<label for="lng">Longitude:</label>

		<!-- 5 Decimals is the default precision -->
		<input type="number" id="lng" v-model="options.lng" step="0.00001" />

		<label for="lat">Latitude:</label>
		<input type="number" id="lat" v-model="options.lat" step="0.00001" />

		<label for="zoom">Zoom:</label>

		<!-- Whole numbers only, min 0, max 22 -->
		<input type="number" id="zoom" v-model="options.zoom" min="0" max="22" />
	</form>

	<!-- Debug Output -->
	<pre>{{ options }}</pre>
</template>

<style>
.map {
	height: 100vh;
	width: 100vw;
}

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
</style>
