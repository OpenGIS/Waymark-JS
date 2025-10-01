<script setup>
import { ref, computed, watch, useTemplateRef } from "vue";
import { storeToRefs } from "pinia";

import { Overlay } from "@/classes/Overlay.js";

import { useMap } from "@/composables/useMap.js";
const { setActiveOverlay } = useMap();

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const { map, activeOverlay, filteredOverlays } = storeToRefs(instanceStore);

import { visibleIcon } from "@/helpers/Common.js";
import Button from "@/components/UI/Common/Button.vue";

const props = defineProps({
  overlay: Overlay,
});

let isOnMap = ref(true);

const isactiveOverlay = computed(() => {
  return activeOverlay.value === props.overlay;
});

const inFilteredOverlays = computed(() => {
  return filteredOverlays.value.includes(props.overlay);
});

const toggleOnMap = () => {
  isOnMap.value = !isOnMap.value;

  // Close if hiding
  if (isactiveOverlay.value) {
    // Remove highlight
    removeLayerHighlight(activeOverlay.value);

    // Make inactive
    activeOverlay.value = null;
  }

  map.value.removeLayer(props.overlay);

  if (isOnMap.value) {
    map.value.addLayer(props.overlay);
  }
};

const overlayStyle = computed(() => {
  if (isactiveOverlay.value) {
    switch (props.overlay.featureType) {
      case "marker":
        return `color: ${props.overlay.type.getIconColour()};background-color: ${props.overlay.type.getPrimaryColour()};`;
      case "line":
        return `background-color: ${props.overlay.type.getPrimaryColour()};`;
      case "shape":
        return `background-color: ${props.overlay.type.getPrimaryColour()};`;
    }
  }
});

const overlayClass = computed(() => {
  let out = props.overlay.featureType;

  if (isactiveOverlay.value) {
    out += " active ";
  }

  if (!inFilteredOverlays.value) {
    out += " hidden ";
  }

  return out;
});

const row = useTemplateRef("row");

// When a overlay is set as active, scroll to it
watch(activeOverlay, (newLayer) => {
  if (newLayer == props.overlay) {
    //Scroll to active overlay
    row.value.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
</script>

<template>
  <!-- START Overlay -->
  <tr
    ref="row"
    class="overlay"
    @click="setActiveOverlay(overlay)"
    :class="overlayClass"
    :style="overlayStyle"
  >
    <!-- Image -->
    <td class="image">
      <img
        v-if="overlay.hasImage()"
        :alt="overlay.getTitle()"
        :src="overlay.getImage('thumbnail')"
      />
    </td>

    <!-- Title -->
    <td class="title" colspan="2">
      <div class="content">{{ overlay.getTitle() }}</div>
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
