<script setup>
import { ref } from "vue";

import { visibleIcon, expandedIcon } from "@/helpers/Common.js";

import Preview from "@/components/UI/Common/Overlay/Preview.vue";
import Item from "@/components/UI/Panel/Overlay/Features/Item.vue";
import Button from "@/components/UI/Common/Button.vue";

const props = defineProps({
  byType: Object,
});

let expanded = ref(true);
let visible = ref(true);

const toggleHighlight = (overlay) => {
  switch (props.byType.featureType) {
    case "marker":
      if (!overlay.element) {
        return;
      }

      overlay.element.classList.toggle("overlay-highlight");

      break;

    case "line":
      // if (!overlay.layer || !overlay.layer.getElement()) {
      //   return;
      // }
      break;
  }
};

const toggleExpanded = () => {
  expanded.value = !expanded.value;
};

const toggleVisible = () => {
  visible.value = !visible.value;

  //Close Type if hiding all
  if (!visible.value) {
    expanded.value = false;
  }

  const overlays = props.byType.overlays;

  for (let i in overlays) {
    const element = overlays[i].element;

    if (!visible.value) {
      element.classList.add("overlay-hidden");
    } else {
      element.classList.remove("overlay-hidden");
    }
  }
};

const overlayStyle = () => {
  let style = ``;

  switch (props.byType.featureType) {
    case "marker":
      style += `color:${props.byType.typeData.icon_colour};`;
      style += `border-color:${props.byType.typeData.marker_colour};`;
      style += `background-color:${props.byType.typeData.marker_colour};`;

      break;
    case "line":
      style += `color:#fff;background-color:${props.byType.typeData.line_colour};`;

      break;
  }

  return style;
};
</script>

<template>
  <div class="type">
    <!-- Heading -->
    <div class="heading" :style="overlayStyle()" @click.stop="toggleExpanded()">
      <!-- Image -->
      <div class="icon">
        <Preview
          :featureType="byType.featureType"
          :typeData="byType.typeData"
        />
      </div>

      <!-- Title -->
      <div class="title">
        {{ byType.title }}
        <span class="count">{{ byType.overlays.length }}</span>
      </div>

      <!-- Expand -->
      <div class="action expand">
        <Button :icon="expandedIcon(expanded)"></Button>
      </div>

      <!-- Visible -->
      <div class="action visible">
        <Button
          :icon="visibleIcon(visible)"
          @click.stop="toggleVisible()"
        ></Button>
      </div>
    </div>

    <!-- List -->
    <Item
      class="content"
      v-show="expanded"
      v-for="(overlay, typeKey, index) in byType.overlays"
      :overlay="overlay"
      @mouseenter="toggleHighlight(overlay)"
      @mouseleave="toggleHighlight(overlay)"
      @click="toggleHighlight(overlay)"
      :key="`${byType.featureType}-${typeKey}-${index}`"
    />
  </div>
</template>

<style lang="less">
.type {
  margin-bottom: 0;

  .heading {
    display: flex;

    align-items: center;
    border-bottom-width: 2px;
    border-bottom-style: solid;

    /* Columns */
    > div {
      flex: 1;
      // height: 60px;
      max-width: 60px;
      vertical-align: middle;

      &.icon {
        position: relative;
        .waymark-marker {
          display: flex;
          flex-direction: row;

          .waymark-marker-icon::before {
            padding-top: 0 !important;
            font-size: 24px !important;
          }
        }

        .count {
          position: absolute;
          top: 15px;
          left: 5px;
        }
      }

      &.title {
        flex: auto;
        overflow: hidden;
        max-width: unset;
        font-size: 18px;
        // color: #000;
        // text-shadow: 1px 1px 1px #fff;

        .count {
          // float: right;
          opacity: 0.7;
          font-size: 80%;
          &::before {
            content: "x";
          }
        }
      }

      &.action {
        &.expand {
        }
      }
    }
  }
}
</style>
