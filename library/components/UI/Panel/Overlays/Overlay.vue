<script setup>
import { ref, computed, watch, useTemplateRef } from "vue";
import { storeToRefs } from "pinia";

import { Overlay } from "@/classes/Overlays.js";

import { useMap } from "@/composables/useMap.js";
const { setActiveOverlay } = useMap();

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const { map, activeOverlay, filteredOverlays } = storeToRefs(instanceStore);

import { visibleIcon } from "@/helpers/Common.js";
import Button from "@/components/UI/Common/Button.vue";
import { waymarkPrimaryColour } from "@/helpers/Common.js";

const props = defineProps({
  overlay: Overlay,
});

let isOnMap = ref(true);

const isActiveOverlay = computed(() => {
  return activeOverlay.value === props.overlay;
});

const inFilteredOverlays = computed(() => {
  return filteredOverlays.value.includes(props.overlay);
});

const toggleOnMap = () => {
  isOnMap.value = !isOnMap.value;

  // Close if hiding
  if (isActiveOverlay.value) {
    // Remove highlight
    activeOverlay.value.removeHighlight();

    // Make inactive
    activeOverlay.value = null;
  }

  if (isOnMap.value) {
    props.overlay.show();
  } else {
    props.overlay.hide();
  }
};

const overlayStyle = computed(() => {
  if (isActiveOverlay.value) {
    return `color: ${waymarkPrimaryColour};border-color: ${waymarkPrimaryColour};`;
  }
});

const overlayClass = computed(() => {
  let out = props.overlay.featureType;

  if (isActiveOverlay.value) {
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
tr.overlay {
  border-bottom: 1px solid #eee;

  &.active {
    // height: auto;

    // &.line {
    //   .content {
    //     color: #fff;
    //     text-shadow:
    //       0 0 1px #000,
    //       0 0 1px #000;
    //   }
    // }

    .title {
      overflow: visible;
      white-space: normal;
      font-weight: bold;
    }
  }

  &.hidden {
    display: none;
  }

  td {
    // height: 42px;
    padding: 0 3px;
    vertical-align: middle;
    text-align: center;

    &.icon,
    &.image {
      padding: 3px;
      width: 42px;
      img {
        width: 100%;
        height: auto;
      }
    }

    &.title {
      width: 170px;
      text-align: left;
      .content {
        width: inherit;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
