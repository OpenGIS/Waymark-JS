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
</template>

<style></style>
