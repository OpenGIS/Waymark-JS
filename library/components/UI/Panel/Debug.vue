<script setup>
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { geoJSON } = storeToRefs(instanceStore);
</script>

<template>
	<div class="panel debug">
		<!-- START Debug Panel Content -->
		<Content class="panel-content">
			<pre>{{ geoJSON }}</pre>
		</Content>
		<!-- END Debug Panel Content -->
	</div>
</template>

<style></style>
