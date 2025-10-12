<script setup>
import { ref, onMounted, useTemplateRef } from "vue";

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
const { resetView } = useMap();

import Overlays from "@/components/UI/Panel/Overlays.vue";
import Info from "@/components/UI/Panel/Info.vue";
import Basemaps from "@/components/UI/Panel/Basemaps.vue";
import Button from "@/components/UI/Common/Button.vue";
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
				<Button size="large" icon="fa-eye" @click="showNav('view')" />

				<!-- Reset -->
				<div class="nav-panel panel-view" v-if="isActiveNav('view')">
					<Button size="large" icon="fa-home" @click="resetView" />
				</div>
			</div>

			<!-- Info -->
			<div class="nav-item nav-info">
				<Button
					size="large"
					icon="fa-info"
					@click="openPanel('info')"
					:active="isActivePanel('info')"
				/>
			</div>
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

				.button {
					margin: 5px;
				}

				.nav-panel {
					width: 52px;
					height: 100%;
					position: absolute;
					top: 0;
					right: 52px;
					// background: #f9f9f9;
					background: rgba(249, 249, 249, 0.8);
					border-left: 1px solid #ddd;
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

	&.display-narrow {
		.map {
			width: 100%;
			height: calc(100% - 52px);
		}

		.ui {
			height: 52px;
			width: 100%;

			.panels-nav {
				display: flex;
				top: unset;
				bottom: 0;
				height: 52px;
				width: 100%;
				.nav-item {
					&.nav-info {
						position: absolute;
						right: 0;
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
