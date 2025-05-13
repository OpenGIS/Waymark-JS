<script setup>
import { ref, computed, watch } from "vue";
import { getFeatureType } from "@/helpers/Overlay.js";
import { makeKey } from "@/helpers/Common.js";

import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

import Type from "@/components/UI/Panel/Overlays/List/Type.vue";
import Button from "@/components/UI/Common/Button.vue";

const instanceStore = useInstanceStore();
const { config, state } = instanceStore;
// const { visibleOverlays, activeOverlay } = storeToRefs(instanceStore);

const overlaysByType = (featureType, typeKey) => {
	switch (featureType) {
		case "marker":
			return state.overlays.markers.getLayers().filter((o) => {
				return o.feature.properties.type === typeKey;
			});
		case "line":
			return state.overlays.lines.getLayers().filter((o) => {
				return o.feature.properties.type === typeKey;
			});
		case "shape":
			return state.overlays.shapes.getLayers().filter((o) => {
				return o.feature.properties.type === typeKey;
			});
		default:
			return [];
	}
};

const activeFeatureType = ref("line");
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
			<div class="marker-types type-list">
				<!-- Iterate over Marker Types in config( config.map_options.marker_types) -->
				<div v-for="(markerType, index) in config.map_options.marker_types">
					<strong class="heading">{{ markerType.marker_title }}</strong>

					<!-- Iterate over Markers -->
					<div
						v-for="(marker, index) in overlaysByType(
							'marker',
							makeKey(markerType.marker_title),
						)"
					>
						<div class="overlay marker">
							<!-- Properties Table -->
							<table>
								<!-- Iterate over feature.properties -->
								<tr v-for="(value, key) in marker.feature.properties">
									<td class="key">{{ key }}</td>
									<td class="value">{{ value }}</td>
								</tr>
							</table>
						</div>
					</div>
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
