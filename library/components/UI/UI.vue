<script setup>
// import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { activePanel, panelOpen, classAppend, activeOverlay } =
	storeToRefs(instanceStore);

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
	<div :class="`ui ${classAppend}`">
		<!-- START Panels -->
		<div :class="`panels ${classAppend}`">
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
		</div>
		<!-- END Panels -->
	</div>
</template>

<style lang="less">
.ui {
	.panels {
		height: 100%;
		min-width: 44px;
		min-height: 44px;
		transition: height 0.1s jump-start;

		/* Open */
		&.panel-open {
			padding-right: 50px;
		}

		/* Nav */
		.panels-nav {
			position: fixed;
			right: 0;
			width: 44px;
			height: 100%;
			display: flex;
			flex-direction: column;
			background: pink;

			.nav-item {
				&.nav-info {
				}
			}
		}

		/* Content */
		.panels-content {
			width: 100%;
			height: 100%;
			width: 320px;
			// min-width: 44px;
			overflow-x: hidden;
		}

		&.portrait {
			/* Closed */
			&.panel-closed {
				.panels-nav {
					height: 44px;
					width: 100%;
					flex-direction: row;
					justify-content: right;
					direction: rtl;
				}
			}

			/* Content */
			.panel-content {
				overflow: auto;
			}
		}

		&.landscape {
			/* Open */
			.panels-nav {
				height: 100%;
				display: flex;
				flex-direction: column;
			}
		}
	}
}
</style>
