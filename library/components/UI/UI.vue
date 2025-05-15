<script setup>
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
</script>

<template>
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
</template>

<style lang="less">
.instance {
	.panels-nav {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1001;
		width: 44px;
		height: 100%;
		background: rgba(249, 249, 249, 0.7);
	}

	.panels-content {
		z-index: 1000;
	}

	&.panel-open {
		.panels-content {
			position: absolute;
			top: 0;
			right: 44px;
			width: calc(320px - 44px);
			padding-bottom: 44px;
			height: calc(100% - 44px);
			overflow-y: auto;
			background: rgba(249, 249, 249, 0.7);
		}
	}

	&.panel-closed {
		.panels-content {
			display: none;
		}
	}

	&.display-small {
		&.panel-open {
			.panels-content {
				max-height: 230px;
			}
		}

		.panels-nav {
			display: flex;
			width: 100%;
			height: 44px;
			top: unset;
			bottom: 0;
			right: unset;
			left: 0;
		}
		.panels-content {
			top: unset;
			bottom: 0;
			right: unset;
			height: 300px;
			width: 100%;
		}
	}
}
</style>
