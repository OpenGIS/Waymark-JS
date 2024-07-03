<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { overlays, markers, lines, shapes } = storeToRefs(instanceStore);

const activeType = ref("marker");

const debugContent = computed(() => {
	const type = activeType.value;
	const activeOverlays = overlays.value.filter(
		(overlay) => overlay.featureType === type,
	);

	// Iterate over each feature
	const content = activeOverlays.map((overlay) => {
		return JSON.stringify(overlay.feature);
	});

	return content.join("<hr />");
});
</script>

<template>
	<div class="debug-overlay">
		<header><strong>Overlays:</strong> {{ overlays.length }}</header>

		<!-- Filter by featureType -->
		<nav>
			<select v-model="activeType">
				<option value="marker">Markers ({{ markers.length }})</option>

				<option value="line">Line ({{ lines.length }})</option>

				<option value="shape">Shape ({{ shapes.length }}</option>
			</select>
		</nav>

		<div class="content">
			<pre>{{ debugContent }}</pre>
		</div>
	</div>
</template>

<style lang="less">
.debug-overlay {
	.content {
		pre {
			// overflow: scroll;
			white-space: pre-wrap;
		}
	}
}
</style>
