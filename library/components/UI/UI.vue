<script setup>
import { watch, computed } from "vue";
import { storeToRefs } from "pinia";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { view, map } = storeToRefs(useInstanceStore());

import { useUI } from "@/composables/useUI.js";
const {
	showNav,
	openPanel,
	isActiveNav,
	showPanel,
	isActivePanel,
	mapHasOverlays,
} = useUI();

import { useMap } from "@/composables/useMap.js";
const { resetView, rotateMap, toggle3D, pointNorth, pitchMap } = useMap();

import Overlays from "@/components/UI/Panel/Overlays.vue";
import Info from "@/components/UI/Panel/Info.vue";
import Basemaps from "@/components/UI/Panel/Basemaps.vue";
import Button from "@/components/UI/Common/Button.vue";

const northIconAngle = computed(() => {
	const offsetToNorth = 315;
	const mapBearing = view.value.bearing || 0;

	return offsetToNorth - mapBearing;
});
</script>

<template>
	<!-- START UI -->
	<div class="ui" ref="container">
		<!-- START Panel Nav -->
		<nav class="panels-nav">
			<!-- Overlay -->
			<div class="nav-item nav-overlays">
				<Button
					v-if="mapHasOverlays"
					size="large"
					icon="fa-navicon"
					@click="openPanel('overlays')"
					:active="isActivePanel('overlays')"
				/>
			</div>

			<!-- Basemaps -->
			<div class="nav-item nav-basemaps">
				<Button
					size="large"
					icon="fa-map"
					@click="openPanel('basemaps')"
					:active="isActivePanel('basemaps')"
				/>
			</div>

			<!-- View -->
			<div class="nav-item nav-view">
				<Button
					size="large"
					icon="fa-eye"
					@click="showNav('view')"
					:active="isActiveNav('view')"
				/>

				<!-- Reset -->
				<div class="nav-panel panel-view" v-if="isActiveNav('view')">
					<!-- Reset View -->
					<Button
						class="view-reset"
						size="medium"
						icon="fa-home"
						@click="resetView"
					/>

					<!-- North Indicator -->
					<Button
						class="view-north"
						size="medium"
						icon="fa-location-arrow"
						:rotate="northIconAngle"
						@click="pointNorth()"
						>N</Button
					>

					<!-- Rotate Counter-Clockwise -->
					<Button
						class="view-rotate-ccw"
						size="medium"
						icon="fa-undo"
						@click="rotateMap('ccw', 45)"
					/>

					<!-- Rotate Clockwise -->
					<Button
						class="view-rotate-cw"
						size="medium"
						icon="fa-undo"
						mirror="true"
						@click="rotateMap('cw', 45)"
					/>

					<!-- 3D View -->
					<Button
						class="view-3d"
						size="medium"
						@click="toggle3D('3d')"
						:active="view.pitch"
						>3D</Button
					>

					<!-- Pitch Up -->
					<Button
						class="view-pitch-up"
						size="medium"
						icon="fa-angle-up"
						@click="pitchMap('up')"
						:disabled="view.pitch === 0"
					/>

					<!-- Pitch Down -->
					<Button
						class="view-pitch-down"
						size="medium"
						icon="fa-angle-down"
						@click="pitchMap('down')"
						:disabled="view.pitch === 60"
					/>
				</div>
			</div>

			<!-- Info -->
			<!-- 			<div class="nav-item nav-info">
				<Button
					size="large"
					icon="fa-info"
					@click="openPanel('info')"
					:active="isActivePanel('info')"
				/>
			</div> -->
		</nav>
		<!-- END Panel Nav -->

		<!-- START Panel Content -->
		<div class="panels-content">
			<Overlays v-if="mapHasOverlays && showPanel('overlays')" />

			<Info v-if="showPanel('info')" />

			<Basemaps v-if="showPanel('basemaps')" />
		</div>
		<!-- END Panel Content -->
	</div>
	<!-- END UI -->
</template>

<style lang="less">
.instance {
	.ui {
		position: relative;
		z-index: 1000;
		cursor: default;
		background: #f9f9f9;

		font-family: "Helvetica Neue", Arial, sans-serif;

		input {
			accent-color: @waymark-primary-colour;
		}

		.panels-nav {
			position: absolute;
			top: 0;
			right: 0;
			width: 51px;
			height: 100%;
			z-index: 1010;
			background: #f9f9f9;
			border-left: 1px solid #ddd;

			.nav-item {
				&.nav-info {
					position: absolute;
					bottom: 0;
				}

				&.nav-view {
					.view-reset {
						position: absolute;
						bottom: 3px;
						left: 0;
					}
					.view-north {
						// position: absolute;
						// bottom: 3px;
						// left: 0;
						position: relative;

						.content {
							position: absolute;
							top: 3px;
							left: 3px;
							color: @waymark-primary-colour;
							font-size: 10px;
						}
					}
				}

				.button {
					margin: 5px;
				}

				.nav-panel {
					width: 38px;
					height: 100%;
					position: absolute;
					top: 0;
					right: 52px;
					// background: #f9f9f9;
					background: rgba(249, 249, 249, 0.66);
					border-left: 1px solid #ddd;

					.button {
						margin: 3px 0 3px 3px;

						&.view-north {
							margin-top: 5px;
						}
					}
				}
			}
		}

		.panels-content {
			height: 100%;
			overflow-y: auto;
		}
	}

	&.panel-open {
		.ui {
			width: 320px;
			box-shadow: inset 0 0 0 1px #ddd;

			.panels-content {
				padding-right: 52px;
			}
		}
	}

	/* Narrow */
	&.display-narrow {
		/* Short & Narrow */
		&.display-short {
			.ui {
				max-height: 200px !important;
			}

			&.has-active-overlay {
				.panel.overlay {
					.overlay-content {
						padding-bottom: 52px;
						overflow-y: auto;
					}

					.feature-nav,
					.panel-content {
						display: none;
					}
				}
			}
		}

		.map {
			width: 100%;
			height: calc(100% - 52px);
		}

		.ui {
			height: 52px;
			width: 100%;

			.active-overlay {
				border-left: none;
			}

			.panels-nav {
				display: flex;
				top: unset;
				bottom: 0;
				height: 52px;
				width: 100%;
				border-left: none;

				.nav-item {
					&.nav-info {
						position: absolute;
						right: 0;
					}

					&.nav-view {
						.view-reset {
							position: relative;
							top: unset;
							bottom: unset;
							float: right;
							margin-right: 5px;
						}
					}

					.nav-panel {
						width: 100%;
						height: 38px;
						bottom: 52px;
						top: unset;
						left: 0;
						right: unset;
						border-left: none;

						.button {
							margin-top: 3px;

							&.view-north {
								margin-left: 5px;
							}
						}
					}
				}
			}
		}

		&.panel-open {
			.map {
				height: calc(100% - 320px);
			}

			.ui {
				height: 260px;
				width: 100%;

				.panels-content {
					min-height: 260px;
					padding-right: 0;
				}
			}
		}
	}
}
</style>
