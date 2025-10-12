<script setup>
/* 

Tile Layer Example...

{
  layer_name: "Open Street Map",
  layer_url: "http://tile.openstreetmap.org/{z}/{x}/{y}.png",
  layer_attribution:
    '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  layer_max_zoom: "18",
  layer_visible: true,
  layer_opacity: 1.0,
}
*/

import { ref } from "vue";

import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";
// import { TileLayer } from "@/classes/TileLayer.js";

// import Button from "@/components/UI/Common/Button.vue";

const { config, mapBounds, map } = storeToRefs(useInstanceStore());

const tileLayers = ref([]);
tileLayers.value = config.value.getTileLayers();

console.log("tileLayers", tileLayers.value);
</script>

<template>
	<div class="panel basemaps">
		<div class="list" v-if="tileLayers && tileLayers.length">
			<div
				class="list-item"
				v-for="(tileLayer, index) in tileLayers"
				:key="index"
				:class="{
					isVisible: tileLayer.isVisible(),
				}"
				@click="tileLayer.toggleVisibility()"
			>
				<img
					:src="
						tileLayer.previewCoords(
							mapBounds.getCenter().lat,
							mapBounds.getCenter().lng,
						)
					"
					:alt="tileLayer.data.layer_name"
					width="160"
					height="160"
				/>

				<!-- Controls -->
				<div class="controls">
					<!-- Checkbox -->
					<input
						type="checkbox"
						disabled
						:checked="tileLayer.isVisible()"
						title="Active"
					/>
				</div>

				<div class="info">
					<h4>{{ tileLayer.data.layer_name }}</h4>
					<p v-html="tileLayer.data.layer_attribution"></p>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="less">
.panel.basemaps {
	padding: 10px;

	h3 {
		margin-top: 0;
		margin-bottom: 10px;
		font-size: 18px;
		font-weight: bold;
		border-bottom: 1px solid #ddd;
		padding-bottom: 5px;
	}

	.list {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;

		.list-item {
			flex: 1 1 calc(50% - 10px);
			box-sizing: border-box;
			border: 2px solid transparent;
			border-radius: 4px;
			cursor: pointer;
			transition: border-color 0.3s;

			&.active {
				border-color: #0078a8;
			}

			img {
				width: 100%;
				height: auto;
				border-bottom: 1px solid #ddd;
				border-top-left-radius: 4px;
				border-top-right-radius: 4px;
			}

			.info {
				padding: 5px;

				h4 {
					margin: 5px 0;
					font-size: 16px;
				}

				p {
					margin: 0;
					font-size: 12px;
					color: #666;
				}
			}
		}
	}
}
</style>
