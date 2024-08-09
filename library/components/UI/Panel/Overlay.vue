<script setup>
import { ref, computed } from "vue";
import { overlaysByType } from "@/helpers/Overlay.js";

import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

import Features from "@/components/UI/Panel/Overlay/Features.vue";
import Button from "@/components/UI/Common/Button.vue";

const instanceStore = useInstanceStore();
const { visibleOverlays, overlays, markers, lines, shapes } =
	storeToRefs(instanceStore);

const activeType = ref("line");
const filterVisible = ref(false);
const filterText = ref("");

const filteredOverlays = computed(() => {
	let filtered = [];

	// All Overlays
	if (!filterVisible.value) {
		filtered = overlays.value.filter((o) => {
			return o.featureType === activeType.value;
		});

		// Only show visible overlays
	} else {
		filtered = visibleOverlays.value.filter((o) => {
			return o.featureType === activeType.value;
		});
	}

	// Filter by Search
	if (filterText.value !== "") {
		filtered = filtered.filter((o) => {
			// Check all GeoJSON properties for existence of filterText
			const properties = Object.values(o.feature.properties);

			return properties.some((p) => {
				return p
					.toString()
					.toLowerCase()
					.includes(filterText.value.toLowerCase());
			});
		});
	}

	return overlaysByType(filtered);
});

const doFeatureTypes = computed(() => {
	return markers.value.length + lines.value.length + shapes.value.length > 1;
});

const toggleFilterVisible = () => {
	filterVisible.value = !filterVisible.value;
};
</script>

<template>
	<div class="panel overlay">
		<div class="panel-content">
			<header>
				<!-- Feature Nav -->
				<nav v-if="doFeatureTypes" class="type-nav" :value="activeType">
					<Button
						v-if="markers.length"
						icon="ion-ios-location-outline"
						@click="activeType = 'marker'"
						:active="activeType === 'marker'"
					/>

					<Button
						v-if="lines.length"
						icon="ion-arrow-graph-up-right"
						@click="activeType = 'line'"
						:active="activeType === 'line'"
					/>

					<Button
						v-if="shapes.length"
						icon="ion-android-checkbox-outline-blank"
						@click="activeType = 'shape'"
						:active="activeType === 'shape'"
					/>
				</nav>

				<nav class="feature-nav">
					<Button
						icon="fa-eye"
						@click="toggleFilterVisible"
						:active="filterVisible"
					/>

					<input type="search" placeholder="Search" v-model="filterText" />
				</nav>
			</header>

			<!-- Features (by Type) -->
			<Features :overlaysByType="filteredOverlays" />
		</div>
	</div>
</template>

<style>
.panel.overlay {
	header,
	nav {
		display: flex;
	}
}
</style>
