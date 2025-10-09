<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { layerFilters, overlaysByType, activeFeatureType, filteredOverlays } =
	storeToRefs(useInstanceStore());

import Active from "@/components/UI/Panel/Overlays/Active.vue";
import Type from "@/components/UI/Panel/Overlays/Type.vue";
import Button from "@/components/UI/Common/Button.vue";

const markerCount = computed(() => {
	return filteredOverlays.value.filter(
		(overlay) => overlay.featureType === "marker",
	).length;
});

const lineCount = computed(() => {
	return filteredOverlays.value.filter(
		(overlay) => overlay.featureType === "line",
	).length;
});

const shapeCount = computed(() => {
	return filteredOverlays.value.filter(
		(overlay) => overlay.featureType === "shape",
	).length;
});
</script>

<template>
	<div class="panel overlay">
		<!-- START Panel Top -->
		<header class="panel-top">
			<Active />

			<!-- START Nav -->
			<nav class="feature-nav">
				<Button
					v-if="markerCount"
					class="marker"
					icon="ion-ios-location"
					@click="activeFeatureType = 'marker'"
					:active="activeFeatureType === 'marker'"
				>
					<span class="count" v-html="markerCount"></span>
				</Button>

				<Button
					v-if="lineCount"
					class="line"
					icon="ion-android-share-alt"
					@click="activeFeatureType = 'line'"
					:active="activeFeatureType === 'line'"
				>
					<span class="count" v-html="lineCount"></span>
				</Button>

				<Button
					v-if="shapeCount"
					class="shape"
					icon="ion-android-checkbox-outline-blank"
					@click="activeFeatureType = 'shape'"
					:active="activeFeatureType === 'shape'"
				>
					<span class="count" v-html="shapeCount"></span>
				</Button>

				<Button
					icon="fa-object-group"
					@click="layerFilters.inBounds = !layerFilters.inBounds"
					:active="layerFilters.inBounds"
				/>

				<input type="search" placeholder="Search" v-model="layerFilters.text" />
			</nav>
			<!-- END Nav -->
		</header>
		<!-- END Panel Top -->

		<!-- Panel Content -->
		<div class="panel-content">
			<!-- Markers -->
			<table
				v-show="activeFeatureType === 'marker'"
				class="marker-types type-list"
			>
				<!-- Iterate over Marker Types -->
				<Type
					v-for="typeKey in Object.keys(overlaysByType.marker)"
					:key="typeKey"
					featureType="marker"
					:overlays="overlaysByType.marker[typeKey]"
					:typeKey="typeKey"
				/>
			</table>

			<!-- Lines -->
			<table v-show="activeFeatureType === 'line'" class="line-types type-list">
				<!-- Iterate over Line Types -->
				<Type
					v-for="typeKey in Object.keys(overlaysByType.line)"
					:key="typeKey"
					featureType="line"
					:overlays="overlaysByType.line[typeKey]"
					:typeKey="typeKey"
				/>
			</table>

			<!-- Shapes -->
			<table
				v-show="activeFeatureType === 'shape'"
				class="shape-types type-list"
			>
				<!-- Iterate over Shape Types -->
				<Type
					v-for="typeKey in Object.keys(overlaysByType.shape)"
					:key="typeKey"
					featureType="shape"
					:overlays="overlaysByType.shape[typeKey]"
					:typeKey="typeKey"
				/>
			</table>
		</div>
	</div>
</template>

<style>
.panel.overlay {
	.panel-top {
		position: sticky;
		top: 0;
		right: 0;
		background-color: #fff;
		border-bottom: 1px solid #999;
		z-index: 100;

		.feature-nav {
			padding: 3px;
			background: #333;
			input {
				margin-left: 5px;
				height: 30px;
				width: 65px;
			}

			.button {
				margin: 0;
				display: inline-block;
				font-size: 16px;

				&.marker,
				&.line,
				&.shape {
					position: relative;
					background: none;
					color: #fff;
					margin: 0;
					margin-left: 0;
					box-shadow: unset;
					border-radius: unset;
					border-bottom: none;

					&.button-active {
						bottom: -1px;
					}
				}

				i,
				.count {
					display: inline-block;
				}
			}
		}
	}

	.panel-content {
		padding-bottom: 44px;
		overflow-y: auto;
	}
}

.instance.has-active-overlay.panel-open {
	.ui {
		.panel.overlay {
			.panel-top {
				max-height: 260px;
			}
			.panel-content {
				.heading,
				.overlay:not(.active) {
					opacity: 0.4;
				}
			}
		}
	}
}
</style>
