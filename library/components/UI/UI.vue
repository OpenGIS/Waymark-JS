<script setup>
// import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { activePanel, panelOpen } = storeToRefs(instanceStore);

import Overlays from "@/components/UI/Panel/Overlays.vue";
import Info from "@/components/UI/Panel/Info.vue";
import Basemaps from "@/components/UI/Panel/Basemaps.vue";

import Button from "@/components/UI/Common/Button.vue";

const showPanel = (panel) => {
	return activePanel.value === panel && panelOpen.value;
};

const handleNavClick = (panel = "overlays") => {
	// Toggle existing panel
	if (panel === activePanel.value) {
		instanceStore.togglePanel();
		// Switch to a different panel
	} else {
		instanceStore.setActivePanel(panel);
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
				:active="activePanel === 'overlays'"
			/>
		</div>

		<!-- Info -->
		<div class="nav-item nav-info">
			<Button
				icon="fa-info"
				@click="handleNavClick('info')"
				:active="activePanel === 'info'"
			/>
		</div>

		<!-- Basemaps -->
		<div class="nav-item nav-basemaps">
			<Button
				icon="fa-map"
				@click="handleNavClick('basemaps')"
				:active="activePanel === 'basemaps'"
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
</template>

<style lang="less">
.instance {
	.panels-nav {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1000;
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

	&.small {
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
