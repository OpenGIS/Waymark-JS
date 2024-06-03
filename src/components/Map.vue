<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useMapStore } from "@/stores/mapStore.js";
import { getTypeData, getFeatureType, getIconData } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";
import * as MapLibreGL from "maplibre-gl";

import Marker from "@/components/UI/Marker.vue";
import Bar from "@/components/UI/Bar.vue";
import Detail from "@/components/UI/Detail.vue";

const mapStore = useMapStore();

const { initMap } = mapStore;

const { geoJSON, visibleOverlays, overlays, lng, lat, zoom, id } =
	storeToRefs(mapStore);

const dataBounds = new MapLibreGL.LngLatBounds();

onMounted(() => {
	const map = initMap();
});
</script>

<template>
	<!-- Map -->
	<div class="map" :id="`${id}-map`"></div>
</template>

<style lang="less">
.map {
	width: 100%;
	height: 100%;
	min-height: 400px;

	.debug {
		pre {
			position: absolute;
			bottom: 0;
			background-color: rgba(255, 255, 255, 0.6);
			padding: 1em;
			z-index: 1000;

			&:first-child {
				left: 0;
			}

			&:last-child {
				right: 0;
				left: auto;
			}
		}
	}
}
</style>
