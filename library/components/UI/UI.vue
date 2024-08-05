<script setup>
// import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { activePanel, panelOpen, classAppend } = storeToRefs(instanceStore);

import Overlay from "@/components/UI/Panel/Overlay.vue";
import Debug from "@/components/UI/Panel/Debug.vue";
import Info from "@/components/UI/Panel/Info.vue";

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
	<div :class="`ui ${classAppend}`">
		<!-- START Panels -->
		<div :class="`panels ${classAppend}`">
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

				<!-- Debug -->
				<div class="nav-item">
					<Button
						icon="fa-gear"
						@click="handleNavClick('debug')"
						:active="activePanel === 'debug'"
					/>
				</div>

				<!-- Info -->
				<div class="nav-item">
					<Button
						icon="fa-info"
						@click="handleNavClick('info')"
						:active="activePanel === 'info'"
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

			<!-- START Info Panel -->
			<div class="panel-hug info" v-show="showPanel('info')">
				<Info />
			</div>
			<!-- END Info Panel -->
		</div>
		<!-- END Panels -->
	</div>
</template>

<style lang="less">
.ui {
	.panels {
		// height: 100%;
		// max-height: 100%;
		min-width: 60px;
		min-height: 60px;

		// overflow: auto;
		background: rgba(249, 249, 249, 0.9);
		transition: height 0.1s jump-start;

		&.portrait {
			.panel-nav {
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: right;
				direction: rtl;
			}
		}

		&.landscape {
			.panel-nav {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
		}
	}
}
</style>
