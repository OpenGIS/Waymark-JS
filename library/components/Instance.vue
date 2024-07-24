<script setup>
import { storeToRefs } from "pinia";
import { onMounted, computed } from "vue";

import { useMaplibre } from "@/composables/useMaplibre.js";
const { createMap } = useMaplibre();

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const { createStore } = instanceStore;
const { activePanel, panelOpen } = storeToRefs(instanceStore);

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

const instanceClass = computed(() => {
	let classes = ["instance"];

	if (panelOpen.value && activePanel.value) {
		classes.push("panel-open");
	}

	return classes.join(" ");
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
	<div :class="instanceClass" :id="`${id}-instance`">
		<div class="map" :id="`${id}-map`" style="height: 100%"></div>

		<UI />
	</div>
</template>

<style lang="less">
.instance {
	height: 100%;
	width: 100%;

	display: flex;

	.map {
		width: 100%;
	}

	.ui {
		width: 60px;
	}

	&.panel-open {
		.map {
			width: 50%;
		}
		.ui {
			width: 50%;
		}
	}
}
</style>
