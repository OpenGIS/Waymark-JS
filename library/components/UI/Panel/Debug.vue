<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { visibleOverlays } = storeToRefs(instanceStore);

const activeType = ref("line");

const debugContent = computed(() => {
	// Visible Overlays filtered by activeType
	return visibleOverlays.value
		.filter((o) => {
			return o.featureType === activeType.value;
		})
		.map((o) => {
			return {
				id: o.id,
				typeKey: o.typeKey,
				typeData: o.typeData,
				feature: o.feature,
				// marker: o.marker,
				featureType: o.featureType,
				// element: o.element,
				imageURLs: o.imageURLs,
			};
		});
});
</script>

<template>
	<div class="panel debug">
		<!-- Filter by featureType -->
		<nav>
			<select v-model="activeType">
				<option value="marker">Marker</option>
				<option value="line">Line</option>
				<option value="shape">Shape</option>
			</select>
		</nav>

		<div class="panel-content">
			<pre>{{ debugContent }}</pre>
		</div>
	</div>
</template>

<style>
.panel.debug {
}
</style>
