<script setup>
import { storeToRefs } from "pinia";

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const { createStore } = instanceStore;
const { classAppend, map } = storeToRefs(instanceStore);

import "@/assets/css/index.css";

import Map from "@/components/Map/Map.vue";
import UI from "@/components/UI/UI.vue";

/*
map_div_id  string  The ID of the HTML element to contain the Map. Defaults to waymark-map. map
map_height  number  Specify the desired height of the Map (in pixels).  420
map_width number  Specify the desired width of the Map (in pixels). 800
map_init_zoom ==> zoom
map_init_latlng ==> center
map_init_basemap  string  The initial basemap of the Map. Use the exact title, including spaces.  Satellite Imagery
map_max_zoom  0-18  The maximum zoom level of the Map.  12
show_scale  1/0 Whether to show the scale on the Map. 1
tile_layers array An array of Basemaps to be used on the Map. See Below
marker_types  array An array of Marker Types to be used on the Map. See Below
line_types  array An array of Line Types to be used on the Map. See Below
shape_types array An array of Shape Types to be used on the Map.  See Below
debug_mode  1/0 Whether to enable debug mode. This will output debug information to the console.  1
*/

const config = defineProps({
	geoJSON: {
		type: Object,
		default: () => ({}),
	},
	map_options: {
		type: Object,
		default: () => ({}),
	},
	viewer_options: {
		type: Object,
		default: () => ({}),
	},
});

// Create Store with provided config
createStore(config);
</script>

<template>
	<!-- Instance -->
	<div :class="`instance ${classAppend}`" :id="`${config.div_id}-instance`">
		<Map />

		<UI v-if="map" />
	</div>
</template>

<style lang="less">
.instance {
	position: relative;
	height: 100%;
	width: 100%;

	/* Transitions */
	.map,
	.ui {
		transition: width 0.25s circular;
	}
}
</style>
