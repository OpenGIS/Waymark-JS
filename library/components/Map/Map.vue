<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getFeatureType } from "@/helpers/Overlay.js";

import { useLeaflet } from "@/composables/useLeaflet.js";
const { createMap, createTileLayerGroup, createDataLayer } = useLeaflet();

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const { config, state } = instanceStore;
const { mapReady, map } = storeToRefs(instanceStore);

onMounted(() => {
  // Create Map
  map.value = createMap();

  // Create Tile Layers
  state.tileLayers = createTileLayerGroup();
  state.activeTileLayer = state.tileLayers.getLayers()[0];
  map.value.addLayer(state.tileLayers);

  // Create data layer
  state.dataLayer = createDataLayer();
  map.value.addLayer(state.dataLayer);

  // Store Overlays
  state.overlays.markers = L.layerGroup(
    state.dataLayer
      .getLayers()
      .filter((layer) => getFeatureType(layer.feature) === "marker"),
  );

  state.overlays.lines = L.layerGroup(
    state.dataLayer
      .getLayers()
      .filter((layer) => getFeatureType(layer.feature) === "line"),
  );

  state.overlays.shapes = L.layerGroup(
    state.dataLayer
      .getLayers()
      .filter((layer) => getFeatureType(layer.feature) === "shape"),
  );

  // Set initial bounds
  map.value.fitBounds(state.dataLayer.getBounds(), {
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
