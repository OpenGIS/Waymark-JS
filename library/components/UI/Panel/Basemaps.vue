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
			toggled on/off, opacity adjusted, and previewed. 
		-->
		<div class="list" v-if="tileLayers && tileLayers.length">
			<div
				class="list-item"
				v-for="(tileLayer, index) in tileLayers"
				:key="index"
				:class="{
					isVisible: tileLayer.isVisible(),
				}"
			>
				<div class="controls">
					<!-- Preview Image -->
					<div class="preview" @click="tileLayer.toggleVisibility()">
						<img
							:src="
								tileLayer.previewCoords(
									mapBounds.getCenter().lat,
									mapBounds.getCenter().lng,
								)
							"
							:alt="tileLayer.data.layer_name"
						/>

						<!-- Visibility Checkbox - should appear over the image, bottom left -->
						<input
							type="checkbox"
							:checked="tileLayer.isVisible()"
							@click.stop="tileLayer.toggleVisibility()"
							title="Active"
						/>
					</div>
				</div>

				<div class="info">
					<!-- Opacity Slider - should appear below the image, match width -->
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						@input="tileLayer.setOpacity($event.target.value)"
						title="Opacity"
					/>
					<!-- Title Aligned to top -->
					<h4>{{ tileLayer.data.layer_name }}</h4>
					<p v-html="tileLayer.data.layer_attribution"></p>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="less">
.panel.basemaps {
	// padding: 10px;

	.list {
		.list-item {
			display: flex;
			// align-items: center;
			// margin-bottom: 10px;
			padding: 5px;
			border: 1px solid #ddd;
			border-bottom: none;

			border-radius: 4px;
			background: #fff;
			cursor: pointer;

			// &.isVisible {
			// 	border-color: #007bff;
			// 	box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
			// }

			.controls {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-right: 5px;

				.preview {
					position: relative;

					img {
						width: 80px;
						height: 80px;
						object-fit: cover;
						border: 1px solid #ccc;
						border-radius: 4px;
					}

					input[type="checkbox"] {
						position: absolute;
						bottom: 5px;
						left: 5px;
						transform: scale(1.5);
						background: rgba(255, 255, 255, 0.7);
						border-radius: 4px;
					}
				}

				input[type="range"] {
					width: 80px;
					// margin-top: 5px;
				}
			}

			.info {
				flex: 1;
				margin-top: 3px;

				h4 {
					margin: 0 0 5px 0;
					font-size: 16px;
				}

				p {
					margin: 0;
					font-size: 11px;
					color: #666;

					a {
						color: @waymark-primary-colour;
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
