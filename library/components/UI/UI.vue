<script setup>
// import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { activePanel, panelOpen } = storeToRefs(instanceStore);

import Overlay from "@/components/UI/Panel/Overlay.vue";
import Debug from "@/components/UI/Panel/Debug.vue";

import Button from "@/components/UI/Common/Button.vue";

const showPanel = (panel) => {
	return activePanel.value === panel && panelOpen.value;
};

const handleNavClick = (panel = "overlay") => {
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
	<div class="ui">
		<!-- START Panels -->
		<div class="panels">
			<!-- START Panel Nav -->
			<nav class="panel-nav">
				<!-- Layers -->
				<div class="nav-item">
					<Button
						icon="fa-navicon"
						@click="handleNavClick('overlay')"
						:active="activePanel === 'overlay'"
					/>
				</div>

				<!-- Layers -->
				<div class="nav-item">
					<Button
						icon="fa-gear"
						@click="handleNavClick('debug')"
						:active="activePanel === 'debug'"
					/>
				</div>
			</nav>
			<!-- END Panel Nav -->

			<!-- START Overlays Panel -->
			<div class="panel-hug overlay" v-show="showPanel('overlay')">
				<Overlay />
			</div>
			<!-- END Overlays Panel -->

			<!-- START Debug Panel -->
			<div class="panel-hug debug" v-show="showPanel('debug')">
				<Debug />
			</div>
			<!-- END Debug Panel -->
		</div>
		<!-- END Panels -->
	</div>
</template>

<style lang="less">
.ui {
	// height: 100%;
	// max-height: 100%;
	min-width: 60px;
	min-height: 60px;

	overflow: auto;
	background: rgba(249, 249, 249, 0.9);
	transition: height 0.1s jump-start;

	.panels {
		position: relative;
		padding: 0;
		padding-right: 60px;

		.panel-nav {
			position: absolute;
			right: 0;
			width: 60px;
			height: 100%;
			background: rgba(249, 249, 249, 0.9);
			border-left: 2px solid #eee;
		}

		.panel-hug {
			border: 2px solid #eee;
		}
	}
}
</style>
