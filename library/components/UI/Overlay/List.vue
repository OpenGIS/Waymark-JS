<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { overlaysByType } from "@/helpers/Overlay.js";

import { storeToRefs } from "pinia";
import { useMapStore } from "@/stores/mapStore.js";

import ListTypes from "@/components/UI/Overlay/ListTypes.vue";

const mapStore = useMapStore();
const { overlays, visibleOverlays } = storeToRefs(mapStore);

import Button from "@/components/UI/Button.vue";

const activeType = ref("marker");

const activeOverlays = computed(() => {
  return overlaysByType(
    visibleOverlays.value.filter((o) => {
      return o.featureType === activeType.value;
    }),
  );
});
</script>

<template>
  <div id="list">
    <!-- Type Nav -->
    <!-- <nav id="type-nav" :value="activeType">
      <Button icon="fa-location-arrow" @click="activeType = 'marker'" />
      <Button icon="fa-location-arrow" @click="activeType = 'line'" />
      <Button icon="fa-location-arrow" @click="activeType = 'shape'" />
    </nav> -->

    <!-- Overlays (by Type) -->
    <ListTypes :overlaysByType="overlaysByType(overlays)" />
  </div>
</template>

<style lang="less">
#list {
  clear: both;
  overflow: hidden;
  overflow-y: scroll;

  #type-nav {
    display: flex;
  }
}
</style>
