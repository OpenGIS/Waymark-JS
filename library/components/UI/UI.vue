<script setup>
import { onMounted, useTemplateRef } from "vue";
import { useInstanceStore } from "@/stores/instanceStore.js";
const { state } = useInstanceStore();

import Overlays from "@/components/UI/Panel/Overlays.vue";
import Info from "@/components/UI/Panel/Info.vue";
import Basemaps from "@/components/UI/Panel/Basemaps.vue";

import Button from "@/components/UI/Common/Button.vue";

const showPanel = (panelKey) => {
	return state.activePanelKey === panelKey && state.panelOpen;
};

function togglePanel() {
	state.panelOpen = !state.panelOpen;
}

function setActivePanel(panelKey = "overlays") {
	state.activePanelKey = panelKey;
	state.panelOpen = true;
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

const container = useTemplateRef("container");

// On container resize, update the map size
onMounted(() => {
	const resizeObserver = new ResizeObserver(() => {
		state.map.invalidateSize();
	});

	resizeObserver.observe(container.value);
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
					:active="state.activePanelKey === 'overlays'"
				/>
			</div>

			<!-- Info -->
			<div class="nav-item nav-info">
				<Button
					icon="fa-info"
					@click="handleNavClick('info')"
					:active="state.activePanelKey === 'info'"
				/>
			</div>

			<!-- Basemaps -->
			<div class="nav-item nav-basemaps">
				<Button
					icon="fa-map"
					@click="handleNavClick('basemaps')"
					:active="state.activePanelKey === 'basemaps'"
				/>
			</div>
		</nav>
		<!-- END Panel Nav -->

		<!-- START Panel Content -->
		<div class="panels-content">
			<Overlays v-if="showPanel('overlays')" />

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
}
</style>
