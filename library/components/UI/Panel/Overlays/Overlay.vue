<script setup>
import { ref, computed, useTemplateRef, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";

import { useLeaflet } from "@/composables/useLeaflet.js";
const { unHighlightLayer, setActiveLayer } = useLeaflet();

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const { map, activeLayer, filteredLayers } = storeToRefs(instanceStore);

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
    <td class="title">{{ props.layer.feature.properties.title }}</td>

    <!-- ? -->
    <td class="action">&nbsp;</td>

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
  /* Overview */
  .overview {
    display: flex;
    align-items: center;

    height: 45px;

    .image,
    .title,
    .action {
      flex: 1;
      // max-width: 60px;
      padding-right: 5px;

      &.image {
        max-height: 45px;
        min-width: 60px;

        img {
          max-width: 100%;
          max-height: 100%;
        }
      }

      &.title {
        padding: 10px;
        // width: 180px;
        white-space: nowrap;
        overflow: hidden;
        flex: auto;
        font-size: 13px;
        font-weight: 300;
        text-overflow: ellipsis;
      }
    }
  }

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
