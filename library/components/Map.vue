<script setup>
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { config } = storeToRefs(useInstanceStore());

import { useMap } from "@/composables/useMap.js";
const { init } = useMap();

onMounted(() => {
  // Create Map
  init();
});
</script>

<template>
  <!-- Map -->
  <div
    class="map"
    :id="`${config.getMapOption('div_id')}-map`"
    style="height: 100%"
  ></div>
</template>

<style lang="less">
.map {
}
</style>
