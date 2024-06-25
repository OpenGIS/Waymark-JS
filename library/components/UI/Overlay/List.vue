<script setup>
import { ref, computed } from "vue";
import { overlaysByType } from "@/helpers/Overlay.js";

import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

import List from "@/components/UI/Type/List.vue";
import Button from "@/components/UI/Button.vue";

const mapStore = useInstanceStore();
const { overlays, visibleOverlays } = storeToRefs(mapStore);

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
    <List :overlaysByType="overlaysByType(overlays)" />
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
