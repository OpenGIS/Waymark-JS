<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { visibleOverlays } = storeToRefs(instanceStore);

const debugContent = computed(() => {
	/*

			id: overlays.value.length + 1,
			typeKey: typeKey,
			typeData: getTypeData("marker", typeKey),
			feature: feature,
			marker: marker,
			featureType: featureType,
			element: markerElement,
			imageURLs: getImageURLs(feature.properties),

*/

	return visibleOverlays.value.map((o) => {
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
		<div class="panel-content">
			<pre>{{ debugContent }}</pre>
		</div>
	</div>
</template>

<style>
.panel.debug {
}
</style>
