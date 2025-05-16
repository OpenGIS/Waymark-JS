<script setup>
import { ref } from "vue";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { state } = useInstanceStore();

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

const toggleVisible = () => {
  isVisible.value = !isVisible.value;

  //Close Type if hiding all
  if (!isVisible.value) {
    isExpanded.value = false;
  }

  props.layerGroup.eachLayer((layer) => {
    state.map.removeLayer(layer);

    if (isVisible.value) {
      state.map.addLayer(layer);
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

      break;
  }

  return style;
};

const headingClick = () => {
  isExpanded.value = !isExpanded.value;

  // Close all other types
  if (isExpanded.value) {
    // Set bounds to
    state.map.fitBounds(props.layerGroup.getBounds(), {
      padding: [30, 30],
    });
  }
};
</script>

<template>
  <div class="type">
    <!-- Heading -->
    <div class="heading" :style="headingStyle()" @click.stop="headingClick()">
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
          <span class="count">{{ layerGroup.getLayers().length }}</span>
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
  </div>
</template>

<style lang="less">
.type {
  margin-bottom: 0;

  .heading {
    display: flex;

    align-items: center;
    border-bottom-width: 3px;
    border-bottom-style: solid;

    /* Columns */
    .icon,
    .title,
    .action {
      padding: 10px 0;
      flex: 1;
      // max-width: 60px;
      vertical-align: middle;

      &.icon {
        // width: 50px;
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
        // flex: auto;
        // overflow: hidden;
        // max-width: unset;
        min-width: 140px;
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
}
</style>
