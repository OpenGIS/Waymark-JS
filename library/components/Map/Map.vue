<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useLeaflet } from "@/composables/useLeaflet.js";
const { createMap, createTileLayerGroup, createDataLayer } = useLeaflet();

import { useInstanceStore } from "@/stores/instanceStore.js";
const { config, mapReady, dataLayer, map, tileLayers, activeTileLayer } =
  storeToRefs(useInstanceStore());

onMounted(() => {
  // Create Map
  map.value = createMap();

  // Create Tile Layers
  tileLayers.value = createTileLayerGroup();
  activeTileLayer.value = tileLayers.value.getLayers()[0];
  map.value.addLayer(tileLayers.value);

  // Create data layer
  dataLayer.value = createDataLayer();
  map.value.addLayer(dataLayer.value);

  // Set initial bounds
  map.value.fitBounds(dataLayer.value.getBounds(), {
    padding: [30, 30],
    animate: false,
  });

  // Trigger the UI to populate
  mapReady.value = true;
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
