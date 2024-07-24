<script setup>
import { ref, computed } from "vue";
import { overlaysByType } from "@/helpers/Overlay.js";

import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

import Detail from "@/components/UI/Panel/Overlay/Detail.vue";
import Feature from "@/components/UI/Panel/Overlay/Feature.vue";
import Button from "@/components/UI/Common/Button.vue";

const instanceStore = useInstanceStore();
const { visibleOverlays } = storeToRefs(instanceStore);

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

			<!-- Feature Nav -->
			<nav id="type-nav" :value="activeType">
				<Button
					icon="ion-ios-location-outline"
					@click="activeType = 'marker'"
					:active="activeType === 'marker'"
				/>

				<Button
					icon="ion-arrow-graph-up-right"
					@click="activeType = 'line'"
					:active="activeType === 'line'"
				/>

				<Button
					icon="ion-android-checkbox-outline-blank"
					@click="activeType = 'shape'"
					:active="activeType === 'shape'"
				/>
			</nav>

			<!-- Features (by Type) -->
			<Feature :overlaysByType="activeOverlays" />
		</div>
	</div>
</template>

<style>
.panel.overlay {
	nav {
		display: flex;
	}
}
</style>
