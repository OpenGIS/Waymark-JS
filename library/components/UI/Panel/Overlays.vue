<script setup>
import { ref, computed, watch } from "vue";
import { overlaysByType, getFeatureType } from "@/helpers/Overlay.js";

import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

import List from "@/components/UI/Panel/Overlays/List.vue";
import Button from "@/components/UI/Common/Button.vue";

const instanceStore = useInstanceStore();
const { state } = instanceStore;
const { visibleOverlays, activeOverlay } = storeToRefs(instanceStore);

const activeType = ref("line");
const filterVisible = ref(false);
const filterText = ref("");

const filteredOverlays = computed(() => {
	let filtered = [];

	// All Overlays
	if (!filterVisible.value) {
		filtered = state.overlays.eachLayer((o) => {
			return getFeatureType(o.toGeoJSON()) === activeType.value;
		});

		// Only show visible overlays
	} else {
		// filtered = visibleOverlays.value.filter((o) => {
		// 	return o.featureType === activeType.value;
		// });
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

const toggleFilterVisible = () => {
	filterVisible.value = !filterVisible.value;
};

watch(activeOverlay, (newOverlay) => {
	if (newOverlay) {
		// Set appropriate active type
		activeType.value = newOverlay.featureType;

		// Scroll to Active Overlay
		const element = state.container.querySelector(
			`.overlay-${newOverlay.id} .overview`,
		);

		if (element) {
			element.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
		}
	}
});
</script>

<template>
	<div class="panel overlay">
		<!-- START Panel Nav -->
		<header class="panel-nav">
			<!-- Nav -->
			<nav class="type-nav" :value="activeType">
				<Button
					v-if="state.markers.length"
					icon="ion-ios-location-outline"
					@click="activeType = 'marker'"
					:active="activeType === 'marker'"
				/>

				<Button
					v-if="state.lines.length"
					icon="ion-arrow-graph-up-right"
					@click="activeType = 'line'"
					:active="activeType === 'line'"
				/>

				<Button
					v-if="state.shapes.length"
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
		<!-- END Panel Nav -->

		<!-- Panel Content -->
		<div class="panel-content">
			<!-- List Overlays (by Type) -->
			<List :overlaysByType="filteredOverlays" class="list" />
		</div>
	</div>
</template>

<style>
.panel.overlay {
	.panel-nav {
		position: sticky;
		top: 0;
		right: 0;
		background-color: #fff;
		border-bottom: 1px solid #999;
		z-index: 100;

		nav {
			display: inline-block;

			.button {
				display: inline-block;
				margin: 3px;
			}
		}

		.feature-nav {
			input {
				height: 30px;
				width: 80px;
			}
		}
	}

	.panel-content {
		/*		padding-top: 60px;*/
		overflow-y: auto;
	}
}
</style>
