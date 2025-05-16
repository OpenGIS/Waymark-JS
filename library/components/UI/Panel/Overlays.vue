<script setup>
import { ref, computed } from "vue";
import {
	getFeatureType,
	getOverlayTypeKey,
	getTypeData,
} from "@/helpers/Overlay.js";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { state } = useInstanceStore();

import { useLeaflet } from "@/composables/useLeaflet.js";
const { isLayerInBounds } = useLeaflet();

import Type from "@/components/UI/Panel/Overlays/Type.vue";
import Button from "@/components/UI/Common/Button.vue";

const filterText = ref("");
const filterInView = ref(true);
const currentBounds = ref(state.map.getBounds());

// Update map bounds on map move & zoom
state.map.on("moveend", () => {
	currentBounds.value = state.map.getBounds();
});

// Sort the Overlays by their types (as layer groups)
const filteredOverlaysByType = computed(() => {
	const overlays = {
		marker: {},
		line: {},
		shape: {},
	};

	// Iterate over all Overlays
	state.dataLayer.eachLayer((layer) => {
		const featureType = getFeatureType(layer.feature);
		const overlayTypeKey = getOverlayTypeKey(layer.feature);
		const typeData = getTypeData(featureType, overlayTypeKey);

		// Is it in the current map bounds
		if (filterInView.value && !isLayerInBounds(layer, currentBounds.value)) {
			return;
		}

		// Text filter
		if (filterText.value !== "") {
			let matches = 0;

			// Text included in type title
			matches += typeData[featureType + "_title"]
				.toString()
				.toLowerCase()
				.includes(filterText.value.toLowerCase());

			// Check all GeoJSON properties VALUES (not keys) for existence of filterText
			const properties = Object.values(layer.feature.properties);

			matches += properties.some((p) => {
				return p
					.toString()
					.toLowerCase()
					.includes(filterText.value.toLowerCase());
			});

			// If no matches, skip this layer
			if (matches === 0) {
				return;
			}
		}

		// Add to appropriate type
		if (!overlays[featureType][overlayTypeKey]) {
			// Needs creating
			overlays[featureType][overlayTypeKey] = L.featureGroup();
		}
		overlays[featureType][overlayTypeKey].addLayer(layer);
	});

	return overlays;
});
</script>

<template>
	<div class="panel overlay">
		<!-- START Panel Nav -->
		<header class="panel-nav">
			<!-- Nav -->
			<nav class="type-nav" :value="state.activeFeatureType">
				<Button
					v-if="state.overlays.markers.getLayers().length"
					icon="ion-ios-location-outline"
					@click="state.activeFeatureType = 'marker'"
					:active="state.activeFeatureType === 'marker'"
				/>

				<Button
					v-if="state.overlays.lines.getLayers().length"
					icon="ion-arrow-graph-up-right"
					@click="state.activeFeatureType = 'line'"
					:active="state.activeFeatureType === 'line'"
				/>

				<Button
					v-if="state.overlays.shapes.getLayers().length"
					icon="ion-android-checkbox-outline-blank"
					@click="state.activeFeatureType = 'shape'"
					:active="state.activeFeatureType === 'shape'"
				/>
			</nav>

			<nav class="feature-nav">
				<Button
					icon="ion-android-expand"
					@click="filterInView = !filterInView"
					:active="filterInView"
				/>

				<input type="search" placeholder="Search" v-model="filterText" />
			</nav>
		</header>
		<!-- END Panel Nav -->

		<!-- Panel Content -->
		<div class="panel-content">
			<!-- Markers -->
			<div
				v-show="state.activeFeatureType === 'marker'"
				class="marker-types type-list"
			>
				<!-- Iterate over Marker Types -->
				<Type
					v-for="typeKey in Object.keys(filteredOverlaysByType.marker)"
					:key="typeKey"
					featureType="marker"
					:layerGroup="filteredOverlaysByType.marker[typeKey]"
					:overlayType="typeKey"
				/>
			</div>

			<!-- Lines -->
			<div
				v-show="state.activeFeatureType === 'line'"
				class="line-types type-list"
			>
				<!-- Iterate over Line Types -->
				<Type
					v-for="typeKey in Object.keys(filteredOverlaysByType.line)"
					:key="typeKey"
					featureType="line"
					:layerGroup="filteredOverlaysByType.line[typeKey]"
					:overlayType="typeKey"
				/>
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
