<script setup>
import { onMounted, watch } from "vue";

import { storeToRefs } from "pinia";

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const { createStore, state, config } = instanceStore;
const { classAppend } = storeToRefs(instanceStore);

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

onMounted(() => {
	// Create Store with provided config
	createStore(props);
	// Create Store with provided config
});
</script>

<template>
	<!-- Instance -->
	<div
		v-if="state.hasInit"
		:class="`instance ${classAppend}`"
		:id="`${config.div_id}-instance`"
	>
		<Map />

		<!-- <UI v-if="state.map._loaded" /> -->
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
