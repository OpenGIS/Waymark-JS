<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";

import { useMap } from "@/composables/useMap.js";
const { filteredLayers } = useMap();

import { useInstanceStore } from "@/stores/instanceStore.js";
const { dataLayer, layerFilters, layersByType, activeFeatureType } =
	storeToRefs(useInstanceStore());

import Active from "@/components/UI/Panel/Overlays/Active.vue";
import Type from "@/components/UI/Panel/Overlays/Type.vue";
import Button from "@/components/UI/Common/Button.vue";

const markerCount = computed(() => {
	return filteredLayers.value
		.getLayers()
		.filter((layer) => layer.featureType === "marker").length;
});

const lineCount = computed(() => {
	return filteredLayers.value
		.getLayers()
		.filter((layer) => layer.featureType === "line").length;
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
					v-if="
						dataLayer
							.getLayers()
							.filter((layer) => layer.featureType === 'marker').length
					"
					class="marker"
					icon="ion-ios-location"
					@click="activeFeatureType = 'marker'"
					:active="activeFeatureType === 'marker'"
				>
					<span class="count" v-html="markerCount"></span>
				</Button>

				<Button
					v-if="
						dataLayer
							.getLayers()
							.filter((layer) => layer.featureType === 'line').length
					"
					class="line"
					icon="ion-arrow-graph-up-right"
					@click="activeFeatureType = 'line'"
					:active="activeFeatureType === 'line'"
				>
					<span class="count" v-html="lineCount"></span>
				</Button>

				<Button
					v-if="
						dataLayer
							.getLayers()
							.filter((layer) => layer.featureType === 'shape').length
					"
					class="shape"
					icon="ion-android-checkbox-outline-blank"
					@click="activeFeatureType = 'shape'"
					:active="activeFeatureType === 'shape'"
				/>

				<Button
					icon="ion-android-expand"
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
					v-for="typeKey in Object.keys(layersByType.markers)"
					:key="typeKey"
					featureType="marker"
					:layerGroup="layersByType.markers[typeKey]"
					:overlayType="typeKey"
				/>
			</table>

			<!-- Lines -->
			<table v-show="activeFeatureType === 'line'" class="line-types type-list">
				<!-- Iterate over Line Types -->
				<Type
					v-for="typeKey in Object.keys(layersByType.lines)"
					:key="typeKey"
					featureType="line"
					:layerGroup="layersByType.lines[typeKey]"
					:overlayType="typeKey"
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
			input {
				margin-left: 5px;
				height: 30px;
				width: 115px;
			}

			.button {
				margin: 0;
				display: inline-block;
				font-size: 16px;

				&.marker,
				&.line,
				&.shape {
					position: relative;
					background: #fff;
					margin: 0;
					margin-left: 0;
					box-shadow: unset;
					border-radius: unset;
					border: 1px solid #ddd;
					border-bottom: none;

					&.active {
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

		table {
			tr {
				&.overlay {
					border-bottom: 1px solid #eee;
				}
				td {
					padding: 0 3px;
					vertical-align: middle;
					text-align: center;

					&.icon,
					&.image {
						width: 42px;
						img {
							width: 100%;
							height: auto;
						}
					}

					&.title {
						text-align: left;
						.content {
							width: inherit;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
				}
			}
		}
	}
}

.instance.has-active-layer.panel-open {
	.ui {
		.panel.overlay {
			.panel-top {
				max-height: 214px;
			}
			.panel-content {
				.heading,
				.overlay:not(.active) {
					border-color: transparent !important;
					/*filter: grayscale(100%);*/
					opacity: 0.4;
				}
			}
		}
	}
}
</style>
