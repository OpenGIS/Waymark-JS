<script setup>
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const { activeTileLayer } = storeToRefs(useInstanceStore());
</script>

<template>
	<div class="panel info">
		<h3>Basemap</h3>

		{{ JSON.stringify(activeTileLayer) }}
	</div>

	<!-- Include the children passed to the component -->
	<slot></slot>
</template>

<style></style>
