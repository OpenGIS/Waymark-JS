<script setup>
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";

import { useLeaflet } from "@/composables/useLeaflet.js";
const { createMap } = useLeaflet();

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const { map_options, state } = storeToRefs(instanceStore);

const map = ref(null);

onMounted(() => {
  map.value = createMap({
    div_id: `${map_options.div_id}-map`,
    init_latlng: map_options.init_latlng,
    init_zoom: map_options.init_zoom,
    geoJSON: state.geoJSON,
  });
});
</script>

<template>
  <!-- Map -->
  <div class="map" :id="`${map_options.div_id}-map`" style="height: 100%"></div>
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
