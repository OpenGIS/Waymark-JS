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
		<Map ref="map" />

		<UI v-if="mapReady" />
	</div>
</template>

<style lang="less">
.instance {
	height: 100%;
	width: 100%;
	display: flex;

	/* Transitions */
	.map,
	.ui {
		transition: width 0.25s ease-in-out;
		transition: height 0.25s ease-in-out;
	}

	.map {
		width: calc(100% - 44px);
		height: 100%;
	}

	.ui {
		width: 44px;
		height: 100%;
	}

	&.panel-open {
		.map {
			width: calc(100% - 320px);
		}

		.ui {
			width: 320px;
		}
	}

	&.display-small {
		flex-direction: column;

		&.panel-open {
			.map {
				width: 100%;
				height: calc(100% - 480px);
			}

			.ui {
				width: 100%;
				// height: 480px;
			}
		}
	}
}
</style>
