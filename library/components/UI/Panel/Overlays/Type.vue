<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";

import { Type } from "@/classes/Types.js";

import { useInstanceStore } from "@/stores/instanceStore.js";
import { useConfig } from "@/composables/useConfig.js";

const { map, filteredOverlays } = storeToRefs(useInstanceStore());
const { config } = useConfig();

import { visibleIcon, expandedIcon } from "@/helpers/Common.js";

import Preview from "@/components/UI/Common/Overlay/Preview.vue";
import Overlay from "@/components/UI/Panel/Overlays/Overlay.vue";
import Button from "@/components/UI/Common/Button.vue";

const props = defineProps({
  featureType: String,
  typeKey: String,
  overlays: Array,
});

let isExpanded = ref(true);
let isVisible = ref(true);

const layerCount = computed(() => {
  //Check occurence of each type overlay in filteredOverlays
  let count = 0;
  props.overlays.forEach((overlay) => {
    // Check if layer is in filteredOverlays
    if (filteredOverlays.value.includes(overlay)) {
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

  props.overlays.forEach((overlay) => {
    if (isVisible.value) {
      overlay.show();
    } else {
      overlay.hide();
    }
  });
};

const type = config.value.getType(props.featureType, props.typeKey);

const headingStyle = () => {
  let style = ``;

  switch (props.featureType) {
    case "marker":
      style += `color:${type.getIconColour()};`;
      style += `border-color:${type.getIconColour()};`;
      style += `background-color:${type.getPrimaryColour()};`;

      break;
    case "line":
      style += `border-color:${type.getPrimaryColour()};`;
      style += `background-color:${type.getPrimaryColour()};`;

      break;
  }

  return style;
};

const headingClick = () => {
  isExpanded.value = !isExpanded.value;

  // // Close all other types
  // if (isExpanded.value) {
  //   // Set bounds to
  //   map.value.fitBounds(props.layerGroup.getBounds(), {
  //     padding: [30, 30],
  //   });
  // }
};

const headingClass = () => {
  let out = "";

  out += ` ${props.featureType}`;
  out += ` ${props.typeKey}`;

  // Check if hidden
  if (!layerCount.value) {
    out += " hidden";
  }

  return out;
};
</script>

<template>
  <!-- Heading -->
  <tr
    class="heading"
    :class="headingClass()"
    :style="headingStyle()"
    @click.stop="headingClick()"
  >
    <!-- Image -->
    <td class="icon">
      <Preview :type="type" />
    </td>

    <!-- Title -->
    <td class="title">
      <div class="content">
        {{ type.getTitle() }}
      </div>
    </td>

    <!-- Expand -->
    <td class="action expand">
      <Button :icon="expandedIcon(isExpanded)">
        <span class="count">{{ layerCount }}</span>
      </Button>
    </td>

    <!-- Visible -->
    <td class="action visible">
      <Button
        :icon="visibleIcon(isVisible)"
        @click.stop="toggleVisible()"
      ></Button>
    </td>
  </tr>

  <!-- List Overlays for this Type -->
  <Overlay :overlay="overlay" v-for="overlay in overlays" v-show="isExpanded" />
</template>

<style lang="less">
tr.heading {
  overflow: hidden;
  align-items: center;
  border-bottom-width: 3px;
  border-bottom-style: solid;
  cursor: pointer;
  color: #333;

  td {
    padding: 0;

    &.icon {
      position: relative;
      vertical-align: middle;
      .waymark-marker {
        .waymark-marker-background {
          display: none;
        }

        .waymark-marker-icon::before {
          padding-top: 0 !important;
          font-size: 18px !important;
        }
      }
    }

    &.title {
      // padding-left: 5px;
      width: 120px;
      font-size: 13px;
    }

    &.action {
      text-align: center;
      &.expand {
        .button {
          margin-left: 0;
          margin-right: 0;
          width: 45px;
          i {
            margin-left: -2px;
          }
        }
      }

      .button {
        color: inherit;
        background: transparent;
        text-shadow:
          0 0 1px #000,
          0 0 1px #000;
        box-shadow: none;
        position: relative;

        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 5px;
          box-shadow: inset 0 0 0 1px currentColor;
          opacity: 0.4;
          pointer-events: none;
        }

        .count {
          border-color: currentColor;
        }

        &.active,
        &:hover {
          text-shadow: unset;
          color: inherit;
          box-shadow: none;

          &::after {
            opacity: 1;
          }
        }
      }
    }
  }

  &.line {
    .title {
      color: #fff;
      text-shadow:
        0 0 1px #000,
        0 0 1px #000;
    }
  }
  &.hidden {
    display: none;
  }
}
</style>
