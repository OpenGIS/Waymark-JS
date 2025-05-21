<script setup>
import { onMounted, useTemplateRef } from "vue";
import { useInstanceStore } from "@/stores/instanceStore.js";
const { state } = useInstanceStore();

import Overlays from "@/components/UI/Panel/Overlays.vue";
import Info from "@/components/UI/Panel/Info.vue";
import Basemaps from "@/components/UI/Panel/Basemaps.vue";

import Button from "@/components/UI/Common/Button.vue";

const showPanel = (panelKey) => {
	return state.activePanelKey === panelKey && state.panelOpen.value;
};

function togglePanel() {
	state.panelOpen.value = !state.panelOpen.value;
}

function setActivePanel(panelKey = "overlays") {
	state.activePanelKey = panelKey;
	state.panelOpen.value = true;
}

const handleNavClick = (panelKey = "overlays") => {
	// Toggle existing panel
	if (panelKey === state.activePanelKey) {
		togglePanel();
		// Switch to a different panel
	} else {
		setActivePanel(panelKey);
	}
};

// On container resize, update the map size
const container = useTemplateRef("container");

onMounted(() => {
	const resizeObserver = new ResizeObserver(() => {
		state.map.invalidateSize();
		state.map.fitBounds(state.dataLayer.getBounds(), {
			padding: [30, 30],
			animate: false,
		});
	});

	resizeObserver.observe(container.value);
});

// Check if the panel is active
const isActivePanel = (panelKey) => {
	return state.panelOpen.value && state.activePanelKey === panelKey;
};
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

			<Info v-show="showPanel('info')" />

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
		}

		.panels-content {
			height: 100%;
			overflow-y: auto;
		}
	}

	&.panel-open {
		.ui {
			width: 320px;

			.panels-content {
				padding-right: 44px;
			}
		}
	}

	&.display-small {
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
				height: 320px;
				width: 100%;

				.panels-content {
					padding-right: 0;
				}
			}
		}
	}
}
</style>
