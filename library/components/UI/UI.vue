<script setup>
import { onMounted, useTemplateRef } from "vue";

import { useUI } from "@/composables/useUI.js";
const {
	showPanel,
	togglePanel,
	setActivePanel,
	isActivePanel,
	getActivePanelKey,
	setUIContainer,
} = useUI();

import Overlays from "@/components/UI/Panel/Overlays.vue";
import Info from "@/components/UI/Panel/Info.vue";
import Basemaps from "@/components/UI/Panel/Basemaps.vue";
import Button from "@/components/UI/Common/Button.vue";

const handleNavClick = (panelKey = "overlays") => {
	// Toggle existing panel
	if (panelKey === getActivePanelKey()) {
		togglePanel();
		// Switch to a different panel
	} else {
		setActivePanel(panelKey);
	}
};

const container = useTemplateRef("container");

onMounted(() => {
	setUIContainer(container.value);
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
					icon="fa-navicon"
					@click="handleNavClick('overlays')"
					:active="isActivePanel('overlays')"
				/>
			</div>

			<!-- Info -->
			<div class="nav-item nav-info">
				<Button
					icon="fa-info"
					@click="handleNavClick('info')"
					:active="isActivePanel('info')"
				/>
			</div>

			<!-- Basemaps -->
			<div class="nav-item nav-basemaps">
				<Button
					icon="fa-map"
					@click="handleNavClick('basemaps')"
					:active="isActivePanel('basemaps')"
				/>
			</div>
		</nav>
		<!-- END Panel Nav -->

		<!-- START Panel Content -->
		<div class="panels-content">
			<Overlays v-show="showPanel('overlays')" />

			<!-- <Info v-show="showPanel('info')" /> -->

			<Basemaps v-show="showPanel('basemaps')" />
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

		.panels-nav {
			position: absolute;
			top: 0;
			right: 0;
			width: 44px;
			height: 100%;
			z-index: 1010;
			background: #f9f9f9;
			box-shadow: inset 0 0 0 1px #ddd;

			.button {
				margin: 5px;
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
				padding-right: 44px;
			}
		}
	}

	&.display-narrow {
		.map {
			width: 100%;
			height: calc(100% - 44px);
		}

		.ui {
			height: 44px;
			width: 100%;

			.panels-nav {
				display: flex;
				top: unset;
				bottom: 0;
				height: 44px;
				width: 100%;
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
