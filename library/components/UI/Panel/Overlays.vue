<script setup>
import { computed } from "vue";
import { getFeatureType } from "@/helpers/Overlay.js";
import { storeToRefs } from "pinia";

import { useInstanceStore } from "@/stores/instanceStore.js";
const {
	map,
	dataLayer,
	filters,
	filteredLayers,
	overlays,
	activeFeatureType,
	activeLayer,
} = storeToRefs(useInstanceStore());

import Type from "@/components/UI/Panel/Overlays/Type.vue";
import Button from "@/components/UI/Common/Button.vue";

const markerCount = computed(() => {
	return filteredLayers.value
		.getLayers()
		.filter((layer) => getFeatureType(layer.feature) === "marker").length;
});

const lineCount = computed(() => {
	return filteredLayers.value
		.getLayers()
		.filter((layer) => getFeatureType(layer.feature) === "line").length;
});
</script>

<template>
	<div class="panel overlay">
		<!-- START Panel Top -->
		<header class="panel-top">
			<!-- START Active Layer -->
			<div v-if="activeLayer" class="active-layer">
				<!-- START Detail -->
				<div class="detail">
					<!-- Image -->
					<div class="image">
						<img
							v-if="activeLayer.feature.properties.image_thumbnail_url"
							:alt="activeLayer.feature.properties.title"
							:src="activeLayer.feature.properties.image_thumbnail_url"
						/>
					</div>

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
				</div>
				<!-- END Detail -->
			</div>
			<!-- End Active Layer -->

			<!-- START Nav -->
			<nav class="feature-nav" :value="activeFeatureType">
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
				>
					<span class="count" v-html="markerCount"></span>
				</Button>

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
				>
					<span class="count" v-html="lineCount"></span>
				</Button>

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
				<!-- </nav> -->

				<!-- <nav class="feature-nav"> -->
				<Button
					icon="ion-android-expand"
					@click="filters.inBounds = !filters.inBounds"
					:active="filters.inBounds"
				/>

				<input type="search" placeholder="Search" v-model="filters.text" />
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
					v-for="typeKey in Object.keys(overlays.markers)"
					:key="typeKey"
					featureType="marker"
					:layerGroup="overlays.markers[typeKey]"
					:overlayType="typeKey"
				/>
			</table>

			<!-- Lines -->
			<table v-show="activeFeatureType === 'line'" class="line-types type-list">
				<!-- Iterate over Line Types -->
				<Type
					v-for="typeKey in Object.keys(overlays.lines)"
					:key="typeKey"
					featureType="line"
					:layerGroup="overlays.lines[typeKey]"
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

			.button {
				width: auto;
				i,
				.count {
					display: inline-block;
				}

				.count {
					font-size: 12px;
				}
			}
		}
	}

	.panel-content {
		padding-bottom: 44px;
		overflow-y: auto;

		table {
			td {
				padding: 0 3px;
				vertical-align: middle;
				text-align: center;
				/*border: 1px solid #999;*/

				&.icon,
				&.image {
					width: 44px;
					img {
						width: 100%;
						height: auto;
					}
				}

				&.title {
					text-align: left;

					white-space: nowrap;
					overflow: hidden;
					font-size: 13px;
					font-weight: 300;
					text-overflow: ellipsis;
					color: blue;
				}
			}
		}
	}
}

.instance.has-active-layer.panel-open {
	.ui {
		/*height: 400px !important;*/

		.panel.overlay {
			.panel-top {
				height: 220px;
				border: 1px solid red;

				.detail {
					height: 180px;
					overflow: hidden;
					border: 1px solid blue;
				}
			}
		}
	}
}
</style>
