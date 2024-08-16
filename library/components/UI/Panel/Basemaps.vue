<script setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";

import { useInstanceStore } from "@/stores/instanceStore.js";
import Button from "@/components/UI/Common/Button.vue";

const instanceStore = useInstanceStore();
const { mapConfig, updateTileLayer } = instanceStore;
const { activeTileLayer } = storeToRefs(instanceStore);
</script>

<template>
	<div class="panel tileDatas">
		<h3>Basemaps</h3>

		<div class="list">
			<div
				v-for="(tileData, index) in mapConfig.tile_layers"
				:key="index"
				class="item"
			>
				<div class="name">{{ tileData.layer_name }}</div>

				<Button
					icon="ion-checkmark"
					@click="updateTileLayer(tileData.layer_name)"
					:active="tileData.layer_name == activeTileLayer"
				/>
			</div>
		</div>
	</div>
</template>

<style></style>
