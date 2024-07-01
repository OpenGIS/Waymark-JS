<script setup>
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { geoJSON } = storeToRefs(instanceStore);
</script>

<template>
	<div class="panel debug">
		<div class="panel-content">
			<pre>{{ geoJSON }}</pre>
		</div>
	</div>
</template>

<style>
.panel.debug {
	background: blue;
}
</style>
