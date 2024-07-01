<script setup>
// import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { barOpen, debugOpen, overlayCount } = storeToRefs(instanceStore);

import Overlay from "@/components/UI/Panel/Overlay.vue";
import Debug from "@/components/UI/Panel/Debug.vue";

import Button from "@/components/UI/Button.vue";

// const barHeight = computed(() => {
// 	if (!barOpen.value || !overlayCount.value) {
// 		return "0";
// 	}

// 	return "33.33%";
// });
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
					<Button icon="fa-navicon" @click="instanceStore.toggleBar()" />
				</div>

				<!-- Layers -->
				<div class="nav-item">
					<Button icon="fa-gear" @click="instanceStore.toggleDebug()" />
				</div>
			</nav>
			<!-- END Panel Nav -->

			<!-- START Overlays Panel -->
			<div class="panel-hug overlay" v-show="barOpen">
				<Overlay />
			</div>
			<!-- END Overlays Panel -->

			<!-- START Debug Panel -->
			<div class="panel-hug debug" v-show="debugOpen">
				<Debug />
			</div>
			<!-- END Debug Panel -->
		</div>
		<!-- END Panels -->
	</div>
</template>

<style lang="less">
.ui {
	width: 50%;
	height: 100%;
	padding: 0 1%;
	max-height: 100%;
	overflow: auto;
	background: rgba(249, 249, 249, 0.9);
	transition: height 0.1s jump-start;

	.panel-nav {
		left: 0;
		width: 100%;
		height: 65px;
		display: flex;
		background: rgba(249, 249, 249, 0.9);
		border-bottom: 2px solid #eee;
		.nav-item {
			width: 25%;
			&:first-child {
				.button {
					margin-left: 14px;
				}
			}
			&:last-child {
				.button {
					margin-right: 14px;
				}
			}
			&.active {
				background: #333;
			}
		}
	}

	.panel-hug {
		border: 2px solid #eee;
	}
}
</style>
