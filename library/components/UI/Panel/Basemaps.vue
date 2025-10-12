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

//Reverse order to have the first one on top
tileLayers.value = config.value.getTileLayers().slice().reverse();

//config.value.getTileLayers();

console.log("tileLayers", tileLayers.value);
</script>

<template>
	<div class="panel basemaps">
		<!-- 
			Rasters are displayed as a scrollable compact list and can be quickly
			toggled on/off, opacity adjusted, and previewed. They are ordered to
			the reverse order of how they are defined in the config, so
			the last one defined appears on top. Giving an intuative way to
			control visibility of multiple layers.
		-->
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

					<!-- Opacity Slider -->
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						@input="tileLayer.setOpacity($event.target.value)"
						title="Opacity"
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

	.list {
		.list-item {
			display: flex;
			align-items: center;
			margin-bottom: 10px;
			padding: 5px;
			border: 1px solid #ddd;
			border-radius: 4px;
			background: #fff;
			cursor: pointer;

			&.isVisible {
				border-color: #007bff;
				background: #e7f1ff;
			}

			img {
				width: 80px;
				height: 80px;
				object-fit: cover;
				border: 1px solid #ccc;
				border-radius: 4px;
				margin-right: 10px;
			}

			.controls {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-right: 10px;

				input[type="checkbox"] {
					margin-bottom: 10px;
					width: 16px;
					height: 16px;
					cursor: not-allowed;
				}

				input[type="range"] {
					width: 80px;
				}
			}

			.info {
				flex: 1;

				h4 {
					margin: 0 0 5px 0;
					font-size: 16px;
				}

				p {
					margin: 0;
					font-size: 12px;
					color: #666;

					a {
						color: #007bff;
						text-decoration: none;

						&:hover {
							text-decoration: underline;
						}
					}
				}
			}
		}
	}
}
</style>
