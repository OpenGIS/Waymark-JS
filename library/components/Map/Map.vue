<script setup>
import { onMounted } from "vue";

import { useMap } from "@/composables/useMap.js";
const { createMap, getMapContainerID } = useMap();

onMounted(() => {
  // Create Map
  createMap();
});
</script>

<template>
  <!-- Map -->
  <div class="map" :id="getMapContainerID()" style="height: 100%"></div>
</template>
