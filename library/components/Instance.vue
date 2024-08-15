<script setup>
import { storeToRefs } from "pinia";
import { ref, onMounted, computed } from "vue";

import { useMaplibre } from "@/composables/useMaplibre.js";
const { createMap } = useMaplibre();

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const { createStore } = instanceStore;
const { classAppend } = storeToRefs(instanceStore);

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

const map = ref(null);

onMounted(() => {
	createStore(props);

	map.value = createMap({
		id: `${props.id}-map`,
		lng: props.lng,
		lat: props.lat,
		zoom: props.zoom,
		geoJSON: props.geoJSON,
	});

	// Add UI
});
</script>

<template>
	<!-- Instance -->
	<div :class="`instance ${classAppend}`" :id="`${id}-instance`">
		<div class="map" :id="`${id}-map`" style="height: 100%"></div>

		<UI v-if="map" />
	</div>
</template>

<style lang="less">
.instance {
	height: 100%;
	width: 100%;

	display: flex;

	/* Portrait */
	&.portrait {
		flex-direction: row;

		.map {
			width: 100%;
		}
	}

	/* Landscape */
	&.landscape {
		flex-direction: row;

		.map {
			width: 100%;
		}

		&.panel-open {
			.ui {
				max-width: 320px;
				// width: 40%;
			}
		}
	}

	/* Transitions */
	.map,
	.ui {
		transition: width 0.25s circular;
	}
}

/* Small Screens */
@media (max-width: 768px) {
	.instance {
		&.portrait {
			flex-direction: column;

			.map {
				height: 60%;
			}

			.ui {
				height: 40%;
			}
		}
	}
}
</style>
