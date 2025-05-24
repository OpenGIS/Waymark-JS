<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { map, filteredLayers } = storeToRefs(useInstanceStore());

import { getTypeData } from "@/helpers/Overlay.js";
import { visibleIcon, expandedIcon } from "@/helpers/Common.js";

import Preview from "@/components/UI/Common/Overlay/Preview.vue";
import Overlay from "@/components/UI/Panel/Overlays/Overlay.vue";
import Button from "@/components/UI/Common/Button.vue";

const props = defineProps({
  featureType: String,
  overlayType: String,
  layerGroup: Object,
});

let isExpanded = ref(true);
let isVisible = ref(true);

const layerCount = computed(() => {
  //Check occurence of each props.layerGroup layer in filteredLayers
  let count = 0;
  props.layerGroup.eachLayer((layer) => {
    // Check if layer is in filteredLayers
    if (filteredLayers.value.hasLayer(layer)) {
      count++;
    }
  });
  return count;
});

const toggleVisible = () => {
  isVisible.value = !isVisible.value;

  //Close Type if hiding all
  if (!isVisible.value) {
    isExpanded.value = false;
  }

  props.layerGroup.eachLayer((layer) => {
    map.value.removeLayer(layer);

    if (isVisible.value) {
      map.value.addLayer(layer);
    }
  });
};

const typeData = getTypeData(props.featureType, props.overlayType);

const headingStyle = () => {
  let style = ``;

  switch (props.featureType) {
    case "marker":
      style += `color:${typeData.icon_colour};`;
      style += `border-color:${typeData.icon_colour};`;
      style += `background-color:${typeData.marker_colour};`;

      break;
    case "line":
      style += `color:${typeData.icon_colour};`;
      style += `border-color:${typeData.line_colour};`;
      style += `background-color:${typeData.line_colour};`;

      break;
  }

  return style;
};

const headingClick = () => {
  isExpanded.value = !isExpanded.value;

  // Close all other types
  if (isExpanded.value) {
    // Set bounds to
    map.value.fitBounds(props.layerGroup.getBounds(), {
      padding: [30, 30],
    });
  }
};

const headingClass = () => {
  let out = "";

  out += ` ${props.featureType}`;
  out += ` ${props.overlayType}`;

  // Check if hidden
  if (!layerCount.value) {
    out += " hidden";
  }

  return out;
};
</script>

<template>
  <!-- Heading -->
  <div
    class="heading"
    :class="headingClass()"
    :style="headingStyle()"
    @click.stop="headingClick()"
  >
    <!-- Image -->
    <div class="icon" v-if="featureType == 'marker'">
      <Preview :featureType="featureType" :typeData="typeData" />
    </div>

    <!-- Title -->
    <div class="title">
      {{ typeData[props.featureType + "_title"] }}
    </div>

    <!-- Expand -->
    <div class="action expand">
      <Button :icon="expandedIcon(isExpanded)">
        <span class="count">{{ layerCount }}</span>
      </Button>
    </div>

    <!-- Visible -->
    <div class="action visible">
      <Button
        :icon="visibleIcon(isVisible)"
        @click.stop="toggleVisible()"
      ></Button>
    </div>
  </div>

  <!-- List Overlays for this Type -->
  <div class="overlays" v-show="isExpanded">
    <Overlay :layer="layer" v-for="layer in layerGroup.getLayers()" />
  </div>
</template>

<style lang="less">
.heading {
  display: flex;
  overflow: hidden;
  align-items: center;
  border-bottom-width: 3px;
  border-bottom-style: solid;

  /* Columns */
  .icon,
  .title,
  .action {
    padding: 0 5px;
    flex: 1;
    vertical-align: middle;

    &.icon {
      position: relative;
      .waymark-marker {
        .waymark-marker-background {
          display: none;
        }

        .waymark-marker-icon::before {
          padding-top: 0 !important;
          font-size: 24px !important;
        }
      }
    }

    &.title {
      // min-width: 255px;
      padding-left: 5px;
      font-size: 14px;
    }

    .count {
      opacity: 0.7;
      font-size: 80%;
    }
  }
}

.overlay {
  /* Every other */
  &:nth-child(odd) {
    background: #f7f7f7;
  }
}
</style>
