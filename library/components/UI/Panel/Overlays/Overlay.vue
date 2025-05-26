<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";

import { useMap } from "@/composables/useMap.js";
const { unHighlightLayer, setActiveLayer, filteredLayers } = useMap();

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const { map, activeLayer } = storeToRefs(instanceStore);

import { visibleIcon } from "@/helpers/Common.js";
import Button from "@/components/UI/Common/Button.vue";

const props = defineProps({
  layer: Object,
});

let isOnMap = ref(true);

const isActiveLayer = computed(() => {
  return activeLayer.value === props.layer;
});

const inFilteredLayers = computed(() => {
  return filteredLayers.value.hasLayer(props.layer);
});

const toggleOnMap = () => {
  isOnMap.value = !isOnMap.value;

  // Close if hiding
  if (isActiveLayer.value) {
    // Remove highlight
    unHighlightLayer(activeLayer.value);

    // Make inactive
    activeLayer.value = null;
  }

  map.value.removeLayer(props.layer);

  if (isOnMap.value) {
    map.value.addLayer(props.layer);
  }
};
</script>

<template>
  <!-- START Overlay -->
  <tr
    class="overlay"
    @click="setActiveLayer(layer)"
    :class="{ active: isActiveLayer, hidden: !inFilteredLayers }"
  >
    <!-- Image -->
    <td class="image">
      <img
        v-if="props.layer.feature.properties.image_thumbnail_url"
        :alt="props.layer.feature.properties.title"
        :src="props.layer.feature.properties.image_thumbnail_url"
      />
    </td>

    <!-- Title -->
    <td class="title" colspan="2">
      <div class="content">{{ props.layer.feature.properties.title }}</div>
    </td>

    <!-- ? -->
    <!-- <td class="action">&nbsp;</td> -->

    <!-- Visible -->
    <td class="action visible">
      <Button :icon="visibleIcon(isOnMap)" @click.stop="toggleOnMap()" />
    </td>
  </tr>
  <!-- END Overlay -->
</template>

<style lang="less">
.map {
  .waymark-marker {
    &.waymark-active {
      z-index: 1000 !important;
      .waymark-marker-background {
        border: 4px solid red;
      }
      .waymark-marker-icon::before {
        padding-top: 8px;
        margin-left: 8px;
      }
    }
  }
}

.overlay {
  &.active {
    // color: blue !important;
    border-color: red !important;

    height: auto;
    .title {
      overflow: visible;
      white-space: normal;
      font-weight: bold;
    }
  }

  &.hidden {
    display: none;
  }
}
</style>
