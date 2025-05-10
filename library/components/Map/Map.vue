<script setup>
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";

import { useLeaflet } from "@/composables/useLeaflet.js";
const { createMap } = useLeaflet();

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const { config, state } = storeToRefs(instanceStore);

const map = ref(null);

onMounted(() => {
  console.log(config.value.map_options);

  map.value = createMap(`${config.value.map_options.div_id}-map`);
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
