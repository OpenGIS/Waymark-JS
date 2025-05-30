<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";

import { useMap } from "@/composables/useMap.js";
const { filteredLayers } = useMap();

import { useInstanceStore } from "@/stores/instanceStore.js";
const {
	dataLayer,
	layerFilters,
	layersByType,
	activeFeatureType,
	activeLayer,
} = storeToRefs(useInstanceStore());

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
			<!-- START Active Layer -->
			<div v-if="activeLayer" class="active-layer">
				<!-- Title -->
				<div class="title">{{ activeLayer.feature.properties.title }}</div>

				<!-- Image -->
				<div class="image">
					<img
						v-if="activeLayer.feature.properties.image_medium_url"
						:src="activeLayer.feature.properties.image_medium_url"
					/>
				</div>

				<!-- Description -->
				<div
					class="description"
					v-if="activeLayer.feature.properties.description"
					v-html="activeLayer.feature.properties.description"
				/>

				<!-- Close -->
				<Button icon="ion-close" @click="activeLayer = null" />
			</div>
			<!-- End Active Layer -->

			<!-- START Nav -->
			<nav class="feature-nav">
				<Button
					v-if="
						dataLayer
							.getLayers()
							.filter((layer) => layer.featureType === 'marker').length
					"
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

		.active-layer {
			max-height: 160px;
			padding: 8px;
			overflow: scroll;
			border-bottom: 1px solid #999;

			.title {
				padding-right: 30px;
				font-size: 20px;
				font-weight: bold;
				margin-bottom: 10px;
			}

			.image {
				float: left;
				margin-right: 10px;
				img {
					max-width: 120px;
				}
			}

			.description {
				margin-bottom: 10px;
				font-size: 15px;
				color: #555;
			}

			.button {
				position: absolute;
				top: 5px;
				right: 5px;
			}
		}

		.feature-nav {
			input {
				height: 30px;
				width: 110px;
			}

			.button {
				display: inline-block;
				margin: 3px;
				font-size: 16px;
				/*width: auto;*/
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
					/*border: 1px solid #999;*/

					&.icon,
					&.image {
						height: 50px;
						width: 50px;
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
		}
	}
}
</style>
