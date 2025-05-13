<script setup>
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";

import { useLeaflet } from "@/composables/useLeaflet.js";
const { createMap, createTileLayerGroup, createDataLayer } = useLeaflet();

import { useInstanceStore } from "@/stores/instanceStore.js";
const { config, state } = useInstanceStore();

onMounted(() => {
  // Create Map
  state.map = createMap();

  // Create Tile Layers
  state.tileLayers = createTileLayerGroup();
  state.map.addLayer(state.tileLayers.getLayers()[0]);

  // Create data layer
  state.dataLayer = createDataLayer();
  state.map.addLayer(state.dataLayer);

  // Set initial bounds
  state.map.fitBounds(state.dataLayer.getBounds());
});
</script>

<template>
  <!-- Map -->
  <div
    class="map"
    :id="`${config.map_options.div_id}-map`"
    style="height: 100%"
  ></div>
</template>

<style lang="less">
.instance {
  position: relative;
  height: 100%;
  width: 100%;

  /* Transitions */
  .map,
  .ui {
    transition: width 0.25s circular;
  }
}
</style>
