<script setup>
import { ref, computed, watch, useTemplateRef } from "vue";
import { storeToRefs } from "pinia";

// Import Helpers
import { removeLayerHighlight } from "@/helpers/Leaflet.js";

import { useMap } from "@/composables/useMap.js";
const { setActiveLayer, filteredLayers } = useMap();

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
    removeLayerHighlight(activeLayer.value);

    // Make inactive
    activeLayer.value = null;
  }

  map.value.removeLayer(props.layer);

  if (isOnMap.value) {
    map.value.addLayer(props.layer);
  }
};

const overlayStyle = computed(() => {
  if (isActiveLayer.value) {
    switch (props.layer.overlay.featureType) {
      case "marker":
        return `color: ${props.layer.overlay.typeData.icon_colour};background-color: ${props.layer.overlay.typeData.marker_colour};`;
      case "line":
        return `background-color: ${props.layer.overlay.typeData.line_colour};`;
      case "shape":
        return `background-color: ${props.layer.overlay.typeData.shape_colour};`;
    }
  }
});

const overlayClass = computed(() => {
  let out = props.layer.overlay.featureType;

  if (isActiveLayer.value) {
    out += " active ";
  }

  if (!inFilteredLayers.value) {
    out += " hidden ";
  }

  return out;
});

const row = useTemplateRef("row");

// When a layer is set as active, scroll to it
watch(activeLayer, (newLayer) => {
  if (newLayer == props.layer) {
    //Scroll to active layer
    row.value.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
</script>

<template>
  <!-- START Overlay -->
  <tr
    ref="row"
    class="overlay"
    @click="setActiveLayer(layer)"
    :class="overlayClass"
    :style="overlayStyle"
  >
    <!-- Image -->
    <td class="image">
      <img
        v-if="layer.overlay.hasImage()"
        :alt="layer.feature.properties.title"
        :src="layer.overlay.images.thumbnail"
      />
    </td>

    <!-- Title -->
    <td class="title" colspan="2">
      <div class="content">{{ layer.feature.properties.title }}</div>
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
    height: auto;

    &.line {
      .content {
        color: #fff;
        text-shadow:
          0 0 1px #000,
          0 0 1px #000;
      }
    }

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
