<script setup>
import "@/assets/css/index.css";

import Map from "@/components/Map/Map.vue";
import UI from "@/components/UI/UI.vue";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { id, geoJSON } = useInstanceStore();
</script>

<template>
	<!-- Instance -->
	<div class="instance" :id="`${id}-instance`">
		<Map />

		<UI />

		<div class="debug" :id="`${id}-debug`">
			<pre>{{ geoJSON }}</pre>
		</div>
	</div>
</template>

<style lang="less">
.instance {
	position: relative;
	height: 100%;
	width: 100%;

	display: flex;

	.debug {
		width: 33%;
		height: 100%;
		overflow: auto;
		font-size: 8px;
		background: rgba(249, 249, 249, 0.5);
	}
}
</style>
