<script setup>
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

const { state } = useMaplibre();
const { setData } = useMapStore();

onMounted(() => {
	const draw = new MapboxDraw({
		displayControlsDefault: true,
		// controls: {
		// 	polygon: true,
		// 	trash: true,
		// },
	});

	state.value.map.addControl(draw);

	const updateData = () => {
		const data = draw.getAll();

		if (data.features.length > 0) {
			setData(data);
		}
	};

	state.value.map.on("draw.create", updateData);
	state.value.map.on("draw.delete", updateData);
	state.value.map.on("draw.update", updateData);
});
</script>

<template>
	<div class="map" id="map"></div>
</template>

<style>
.map {
	height: 100vh;
	width: 100vw;
}
</style>
