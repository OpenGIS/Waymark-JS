<script setup>
import { ref, computed } from "vue";
import { overlaysByType } from "@/helpers/Overlay.js";

import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

import Detail from "@/components/UI/Panel/Overlay/Detail.vue";
import Feature from "@/components/UI/Panel/Overlay/Feature.vue";

const instanceStore = useInstanceStore();
const { overlays, visibleOverlays } = storeToRefs(instanceStore);

const activeType = ref("marker");

const activeOverlays = computed(() => {
	return overlaysByType(
		visibleOverlays.value.filter((o) => {
			return o.featureType === activeType.value;
		}),
	);
});
</script>

<template>
	<div class="panel overlay">
		<div class="panel-content">
			<Detail />

			<!-- Type Nav -->
			<!-- <nav id="type-nav" :value="activeType">
      <Button icon="fa-location-arrow" @click="activeType = 'marker'" />
      <Button icon="fa-location-arrow" @click="activeType = 'line'" />
      <Button icon="fa-location-arrow" @click="activeType = 'shape'" />
    </nav> -->

			<!-- Overlays (by Type) -->
			<Feature :overlaysByType="overlaysByType(overlays)" />
		</div>
	</div>
</template>

<style>
.panel.overlay {
	background: red;
}
</style>
