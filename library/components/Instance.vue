<script setup>
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

import { useMaplibre } from "@/composables/useMaplibre.js";
const { createMap } = useMaplibre();

import { useInstanceStore } from "@/stores/instanceStore.js";
const { createStore } = useInstanceStore();
const { debugOpen } = storeToRefs(mapStore);

import "@/assets/css/index.css";

import UI from "@/components/UI/UI.vue";

// Config Definition!
const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	lng: {
		type: Number,
		default: -128.0094,
	},
	lat: {
		type: Number,
		default: 50.6539,
	},
	zoom: {
		type: Number,
		default: 16,
	},
	geoJSON: {
		type: Object,
		default: {},
	},
	mapConfig: {
		type: Object,
		default: {},
	},
});

onMounted(() => {
	createStore(props);

	createMap({
		id: `${props.id}-map`,
		lng: props.lng,
		lat: props.lat,
		zoom: props.zoom,
		geoJSON: props.geoJSON,
	});
});
</script>

<template>
	<!-- Instance -->
	<div class="instance" :id="`${id}-instance`">
		<div class="map" :id="`${id}-map`" style="height: 100%"></div>

		<UI />

		<div class="debug" :id="`${id}-debug`" v-show="debugOpen">
			<pre>{{ geoJSON }}</pre>
		</div>
	</div>
</template>

<style lang="less">
.instance {
	height: 100%;
	width: 100%;

	display: flex;

	.map {
		width: 33%;
		height: 600px !important;
		border: 1px solid red;
	}

	.debug {
		width: 33%;
		height: 100%;
		overflow: auto;
		font-size: 8px;
		background: rgba(249, 249, 249, 0.5);
	}
}
</style>
