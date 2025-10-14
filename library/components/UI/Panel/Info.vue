<script setup>
import { storeToRefs } from "pinia";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { view } = storeToRefs(useInstanceStore());
</script>

<template>
	<div class="panel info">
		<h3>Info</h3>

		{{ JSON.stringify(view) }}
	</div>
</template>

<style lang="less">
.panel.info {
	padding: 16px;
}
</style>
