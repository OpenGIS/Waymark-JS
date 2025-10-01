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
  .waymark-marker {
    &.waymark-active {
      z-index: 1000 !important;
      .waymark-marker-background {
        border-width: 4px;
        border-style: dotted;
      }
      .waymark-marker-icon::before {
        padding-top: 8px;
        margin-left: 8px;
      }
    }
  }
}
</style>
