<script setup>
import Detail from "@/components/UI/Panel/Overlay/Detail.vue";
import List from "@/components/UI/Panel/Overlay/List.vue";
</script>

<template>
	<div class="panel overlay">
		<!-- START Overlays Panel Content -->
		<Content class="panel-content">
			<Detail />

			<List />
		</Content>
		<!-- END Overlays Panel Content -->
	</div>
</template>

<style>
.panel.overlay {
	background: red;
}
</style>
