<script setup>
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";

import { useLeaflet } from "@/composables/useLeaflet.js";
const { createMap } = useLeaflet();

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const { createStore } = instanceStore;
const { classAppend, map } = storeToRefs(instanceStore);

import "@/assets/css/index.css";

import Map from "@/components/Map/Map.vue";
import UI from "@/components/UI/UI.vue";

// Config Definition!
const props = defineProps({
	geoJSON: {
		type: Object,
		default: {},
	},
	map_options: {
		type: Object,
		default: () => ({
			// map_div_id	string	The ID of the HTML element to contain the Map. Defaults to waymark-map.	map
			// map_height	number	Specify the desired height of the Map (in pixels).	420
			// map_width	number	Specify the desired width of the Map (in pixels).	800
			// map_init_zoom	0-18	The initial zoom level of the Map.	10
			// map_init_latlng	array	The initial centre coordinates of the Map (Latitude,Longitude).	[51.5074, 0.1278]
			// map_init_basemap	string	The initial basemap of the Map. Use the exact title, including spaces.	Satellite Imagery
			// map_max_zoom	0-18	The maximum zoom level of the Map.	12
			// show_scale	1/0	Whether to show the scale on the Map.	1
			// tile_layers	array	An array of Basemaps to be used on the Map.	See Below
			// marker_types	array	An array of Marker Types to be used on the Map.	See Below
			// line_types	array	An array of Line Types to be used on the Map.	See Below
			// shape_types	array	An array of Shape Types to be used on the Map.	See Below
			// debug_mode	1/0	Whether to enable debug mode. This will output debug information to the console.	1
			div_id: {
				type: String,
				required: true,
			},
			init_latlng: {
				type: Array,
				default: () => [-128.0094, 50.6539],
			},
			init_zoom: {
				type: Number,
				default: 16,
			},
			max_zoom: {
				type: Number,
				default: 18,
			},
		}),
	},
});

createStore(props);
</script>

<template>
	<!-- Instance -->
	<div
		:class="`instance ${classAppend}`"
		:id="`${map_options.div_id}-instance`"
	>
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
