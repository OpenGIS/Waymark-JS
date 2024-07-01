<script setup>
// import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { activePanel, panelOpen, overlayCount } = storeToRefs(instanceStore);

import Overlay from "@/components/UI/Panel/Overlay.vue";
import Debug from "@/components/UI/Panel/Debug.vue";

import Button from "@/components/UI/Button.vue";

const handleNavClick = (panel = "overlay") => {
	// If the panel is already open, close it
	if (panel === activePanel.value) {
		instanceStore.setActivePanel(null);

		return;
	}

	// Open the panel
	instanceStore.setActivePanel(panel);
};
</script>

<template>
	<!-- <div class="ui" :style="`height:${barHeight}`"> -->
	<div class="ui">
		<!-- START Panels -->
		<div class="panels">
			<!-- START Panel Nav -->
			<nav class="panel-nav">
				<!-- Layers -->
				<div class="nav-item">
					<Button icon="fa-navicon" @click="handleNavClick('overlay')" />
				</div>

				<!-- Layers -->
				<div class="nav-item">
					<Button icon="fa-gear" @click="handleNavClick('debug')" />
				</div>
			</nav>
			<!-- END Panel Nav -->

			<!-- START Overlays Panel -->
			<div class="panel-hug overlay" v-show="activePanel === 'overlay'">
				<Overlay />
			</div>
			<!-- END Overlays Panel -->

			<!-- START Debug Panel -->
			<div class="panel-hug debug" v-show="activePanel === 'debug'">
				<Debug />
			</div>
			<!-- END Debug Panel -->
		</div>
		<!-- END Panels -->
	</div>
</template>

<style lang="less">
.ui {
	height: 100%;
	max-height: 100%;
	overflow: auto;
	background: rgba(249, 249, 249, 0.9);
	transition: height 0.1s jump-start;

	.panels {
		position: relative;
		padding-right: 75px;

		.panel-nav {
			position: absolute;
			right: 0;
			width: 65px;
			height: 100%;
			// display: flex;
			background: rgba(249, 249, 249, 0.9);
			border-left: 2px solid #eee;

			.nav-item {
			}
		}

		.panel-hug {
			border: 2px solid #eee;
		}
	}
}
</style>
