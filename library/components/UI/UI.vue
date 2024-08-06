<script setup>
// import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { activePanel, panelOpen, classAppend, activeOverlay } =
	storeToRefs(instanceStore);

import Overlay from "@/components/UI/Panel/Overlay.vue";
import Detail from "@/components/UI/Panel/Detail.vue";
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
				<!-- Overlay -->
				<div class="nav-item nav-overlay">
					<Button
						icon="fa-navicon"
						@click="handleNavClick('overlay')"
						:active="activePanel === 'overlay'"
					/>
				</div>

				<!-- Detail -->
				<div class="nav-item nav-detail">
					<Button
						icon="fa-gear"
						@click="handleNavClick('detail')"
						:active="activePanel === 'detail'"
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
			</nav>
			<!-- END Panel Nav -->

			<!-- START Panel Content -->
			<div class="panel-content">
				<Detail v-show="showPanel('detail') && activeOverlay" />

				<Overlay v-show="showPanel('overlay')" />

				<Info v-show="showPanel('info')" />
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
		min-width: 60px;
		min-height: 60px;
		transition: height 0.1s jump-start;

		/* Open */
		&.panel-open {
			padding-right: 60px;
		}

		/* Nav */
		.panel-nav {
			position: fixed;
			right: 0;
			width: 60px;
			height: 100%;
			display: flex;
			flex-direction: column;
			background: pink;

			.nav-item {
				padding: 0 10px;

				&.nav-info {
					// position: absolute;
					// bottom: 0;
					// right: 0;
				}
			}
		}

		/* Content */
		.panel-content {
			width: 100%;
			height: 100%;
			min-width: 60px;
			overflow-x: hidden;
		}

		&.portrait {
			/* Closed */
			&.panel-closed {
				.panel-nav {
					height: 60px;
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
			.panel-nav {
				height: 100%;
				display: flex;
				flex-direction: column;
			}
		}
	}
}
</style>
