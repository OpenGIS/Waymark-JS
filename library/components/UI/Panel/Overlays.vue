<script setup>
import { ref, computed, watch } from "vue";
import { getFeatureType, getOverlayType } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

import Type from "@/components/UI/Panel/Overlays/Type.vue";
import Overlay from "@/components/UI/Panel/Overlays/Overlay.vue";
import Button from "@/components/UI/Common/Button.vue";

const instanceStore = useInstanceStore();
const { config, state } = instanceStore;
// const { visibleOverlays, activeOverlay } = storeToRefs(instanceStore);

const overlaysByType = () => {
	const overlays = {
		marker: {},
		line: {},
		shape: {},
	};

	// Iterate over all Overlays
	state.dataLayer.eachLayer((layer) => {
		const featureType = getFeatureType(layer.feature);
		const overlayType = getOverlayType(layer.feature);

		// If not yet present
		if (!overlays[featureType][overlayType]) {
			overlays[featureType][overlayType] = L.layerGroup();
		}

		// Add to appropriate type
		overlays[featureType][overlayType].addLayer(layer);
	});

	return overlays;
};

const activeFeatureType = ref("marker");
// const filterVisible = ref(false);
// const filterText = ref("");

// const filteredOverlays = computed(() => {
// 	let filtered = [];

// 	// All Overlays
// 	if (!filterVisible.value) {
// 		filtered = state.overlays.eachLayer((o) => {
// 			return getFeatureType(o.toGeoJSON()) === activeFeatureType.value;
// 		});

// 		// Only show visible overlays
// 	} else {
// 		// filtered = visibleOverlays.value.filter((o) => {
// 		// 	return o.featureType === activeFeatureType.value;
// 		// });
// 	}

// 	// Filter by Search
// 	if (filterText.value !== "") {
// 		filtered = filtered.filter((o) => {
// 			// Check all GeoJSON properties for existence of filterText
// 			const properties = Object.values(o.feature.properties);

// 			return properties.some((p) => {
// 				return p
// 					.toString()
// 					.toLowerCase()
// 					.includes(filterText.value.toLowerCase());
// 			});
// 		});
// 	}

// 	return overlaysByType(filtered);
// });

// const toggleFilterVisible = () => {
// 	filterVisible.value = !filterVisible.value;
// };

// watch(activeOverlay, (newOverlay) => {
// 	if (newOverlay) {
// 		// Set appropriate active type
// 		activeFeatureType.value = newOverlay.featureType;

// 		// Scroll to Active Overlay
// 		const element = state.container.querySelector(
// 			`.overlay-${newOverlay.id} .overview`,
// 		);

// 		if (element) {
// 			element.scrollIntoView({
// 				behavior: "smooth",
// 				block: "center",
// 				inline: "center",
// 			});
// 		}
// 	}
// });
</script>

<template>
	<div class="panel overlay">
		<!-- START Panel Nav -->
		<header class="panel-nav">
			<!-- Nav -->
			<nav class="type-nav" :value="activeFeatureType">
				<Button
					v-if="state.overlays.markers.getLayers().length"
					icon="ion-ios-location-outline"
					@click="activeFeatureType = 'marker'"
					:active="activeFeatureType === 'marker'"
				/>

				<Button
					v-if="state.overlays.lines.getLayers().length"
					icon="ion-arrow-graph-up-right"
					@click="activeFeatureType = 'line'"
					:active="activeFeatureType === 'line'"
				/>

				<Button
					v-if="state.overlays.shapes.getLayers().length"
					icon="ion-android-checkbox-outline-blank"
					@click="activeFeatureType = 'shape'"
					:active="activeFeatureType === 'shape'"
				/>
			</nav>

			<!-- 			<nav class="feature-nav">
				<Button
					icon="fa-eye"
					@click="toggleFilterVisible"
					:active="filterVisible"
				/>

				<input type="search" placeholder="Search" v-model="filterText" />
			</nav> -->
		</header>
		<!-- END Panel Nav -->

		<!-- Panel Content -->
		<div class="panel-content">
			<!-- Markers -->
			<div v-if="activeFeatureType === 'marker'" class="markers type-list">
				<!-- Iterate over Marker Types  -->
				<div
					v-for="(markers, typeKey) in overlaysByType().marker"
					:key="typeKey"
				>
					<Type
						featureType="marker"
						:overlayType="typeKey"
						:overlays="markers"
					/>
				</div>
			</div>
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
