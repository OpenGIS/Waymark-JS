<script setup>
import { watch } from "vue";
import { getFeatureType } from "@/helpers/Overlay.js";
import { storeToRefs } from "pinia";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { map, dataLayer, filters, filteredLayers, overlays, activeFeatureType } =
	storeToRefs(useInstanceStore());

import Type from "@/components/UI/Panel/Overlays/Type.vue";
import Button from "@/components/UI/Common/Button.vue";

// Watch filteredLayers
// watch(filteredLayers, (layers) => {
// 	console.log("Filtered Layers:", layers.getLayers().length);
// });
</script>

<template>
	<div class="panel overlay">
		<!-- START Panel Nav -->
		<header class="panel-nav">
			<!-- Nav -->
			<nav class="type-nav" :value="activeFeatureType">
				<Button
					v-if="
						dataLayer
							.getLayers()
							.filter((layer) => getFeatureType(layer.feature) === 'marker')
							.length
					"
					icon="ion-ios-location-outline"
					@click="activeFeatureType = 'marker'"
					:active="activeFeatureType === 'marker'"
				/>

				<Button
					v-if="
						dataLayer
							.getLayers()
							.filter((layer) => getFeatureType(layer.feature) === 'line')
							.length
					"
					icon="ion-arrow-graph-up-right"
					@click="activeFeatureType = 'line'"
					:active="activeFeatureType === 'line'"
				/>

				<Button
					v-if="
						dataLayer
							.getLayers()
							.filter((layer) => getFeatureType(layer.feature) === 'shape')
							.length
					"
					icon="ion-android-checkbox-outline-blank"
					@click="activeFeatureType = 'shape'"
					:active="activeFeatureType === 'shape'"
				/>
			</nav>

			<nav class="feature-nav">
				<Button
					icon="ion-android-expand"
					@click="filters.inBounds = !filters.inBounds"
					:active="filters.inBounds"
				/>

				<input type="search" placeholder="Search" v-model="filters.text" />
			</nav>
		</header>
		<!-- END Panel Nav -->

		<!-- Panel Content -->
		<div class="panel-content">
			<!-- Markers -->
			<div
				v-show="activeFeatureType === 'marker'"
				class="marker-types type-list"
			>
				<!-- Iterate over Marker Types -->
				<Type
					v-for="typeKey in Object.keys(overlays.markers)"
					:key="typeKey"
					featureType="marker"
					:layerGroup="overlays.markers[typeKey]"
					:overlayType="typeKey"
				/>
			</div>

			<!-- Lines -->
			<div v-show="activeFeatureType === 'line'" class="line-types type-list">
				<!-- Iterate over Line Types -->
				<Type
					v-for="typeKey in Object.keys(overlays.lines)"
					:key="typeKey"
					featureType="line"
					:layerGroup="overlays.lines[typeKey]"
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
		padding-bottom: 44px;
		overflow-y: auto;
	}
}
</style>
