<script setup>
import "@/assets/css/index.css";

import Map from "@/components/Map/Map.vue";
import UI from "@/components/UI/UI.vue";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { id } = useInstanceStore();
</script>

<template>
	<!-- Instance -->
	<div class="instance" :id="`${id}-instance`">
		<Map />

		<UI />
	</div>
</template>

<style lang="less">
.instance {
	position: relative;
	height: 100%;
	width: 100%;

	display: flex;
}
</style>
