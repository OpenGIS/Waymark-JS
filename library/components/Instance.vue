<script setup>
import { onMounted, useTemplateRef } from "vue";

import { storeToRefs } from "pinia";

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const { init, state, config } = instanceStore;
const { mapReady } = storeToRefs(instanceStore);

import "@/assets/css/index.css";

import Map from "@/components/Map/Map.vue";
import UI from "@/components/UI/UI.vue";

const props = defineProps({
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

// Initialise Instance Store
init(props);

const classAppend = () => {
	let classes = [""];

	// Panel Open
	if (state.panelOpen) {
		classes.push("panel-open");
	} else {
		classes.push("panel-closed");
	}

	// Orientation
	if (state.width > state.height) {
		classes.push("orientation-landscape");
	} else {
		classes.push("orientation-portrait");
	}

	// Small display
	if (state.width <= 320) {
		classes.push("display-small");
	}

	return classes.join(" ");
};

const container = useTemplateRef("container");

onMounted(() => {
	// Instance dimensions
	state.width = container.value.clientWidth;
	state.height = container.value.clientHeight;
});
</script>

<template>
	<!-- Instance -->
	<div
		ref="container"
		:class="`instance ${classAppend()}`"
		:id="`${config.map_options.div_id}-instance`"
	>
		<Map />

		<UI v-if="mapReady" />
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
