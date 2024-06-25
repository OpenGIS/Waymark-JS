<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const mapStore = useInstanceStore();
const { barOpen, overlayCount } = storeToRefs(mapStore);

import Detail from "@/components/UI/Overlay/Detail.vue";
import List from "@/components/UI/Overlay/List.vue";
import Button from "@/components/UI/Button.vue";
import Content from "@/components/UI/Content.vue";

const barHeight = computed(() => {
	if (!barOpen.value || !overlayCount.value) {
		return "0";
	}

	return "33.33%";
});
</script>

<template>
	<!-- <div class="ui" :style="`height:${barHeight}`"> -->
	<div class="ui">
		<Detail />

		<!-- Nav -->
		<nav class="bar-nav">
			<!-- Layers -->
			<div class="nav-item">
				<Button icon="fa-location-arrow" @click="mapStore.toggleBar()" />
			</div>
		</nav>

		<!-- Content -->
		<Content v-show="barOpen">
			<!-- List -->
			<List />
		</Content>
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

	.bar-nav {
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
}
</style>
