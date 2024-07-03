<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { mapConfig } = storeToRefs(instanceStore);
</script>

<template>
	<div class="debug-config">
		<div class="content">
			<pre>{{ JSON.stringify(mapConfig, null, 2) }}</pre>
		</div>
	</div>
</template>

<style lang="less">
.debug-config {
	.content {
		pre {
			// overflow: scroll;
			white-space: pre-wrap;
		}
	}
}
</style>
