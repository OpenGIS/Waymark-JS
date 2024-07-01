<script setup>
import Detail from "@/components/UI/Panel/Overlay/Detail.vue";
import List from "@/components/UI/Panel/Overlay/List.vue";
</script>

<template>
	<div class="panel overlay">
		<div class="panel-content">
			<Detail />

			<List />
		</div>
	</div>
</template>

<style>
.panel.overlay {
	background: red;
}
</style>
