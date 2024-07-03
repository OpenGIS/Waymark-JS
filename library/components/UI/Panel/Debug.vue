<script setup>
import Overlay from "@/components/UI/Panel/Debug/Overlay.vue";
import Config from "@/components/UI/Panel/Debug/Config.vue";
</script>

<template>
	<div class="panel debug">
		<!-- START Accordian -->
		<details>
			<summary>Overlays</summary>
			<Overlay />
		</details>
		<details>
			<summary>Config</summary>
			<Config />
		</details>
		<!-- END Accordian -->
	</div>
</template>

<style lang="less">
.panel.debug {
	details {
		margin-bottom: 1rem;

		summary {
			padding: 0.5rem;
			background-color: #f0f0f0;
			cursor: pointer;
		}
	}
}
</style>
