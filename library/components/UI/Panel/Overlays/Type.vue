<script setup>
import { ref } from "vue";

import { getTypeData } from "@/helpers/Overlay.js";
import { visibleIcon, expandedIcon } from "@/helpers/Common.js";

import Preview from "@/components/UI/Common/Overlay/Preview.vue";
import Overlay from "@/components/UI/Panel/Overlays/Overlay.vue";
import Button from "@/components/UI/Common/Button.vue";

const props = defineProps({
  featureType: String,
  overlayType: String,
  overlays: Object,
});

// let expanded = ref(true);
// let visible = ref(true);

// const toggleHighlight = (overlay) => {
//   switch (props.byType.featureType) {
//     case "marker":
//       if (!overlay.element) {
//         return;
//       }

//       overlay.element.classList.toggle("overlay-highlight");

//       break;

//     case "line":
//       // if (!overlay.layer || !overlay.layer.getElement()) {
//       //   return;
//       // }
//       break;
//   }
// };

// const toggleExpanded = () => {
//   expanded.value = !expanded.value;
// };

// const toggleVisible = () => {
//   visible.value = !visible.value;

//   //Close Type if hiding all
//   if (!visible.value) {
//     expanded.value = false;
//   }

//   const overlays = props.byType.overlays;

//   for (let i in overlays) {
//     const element = overlays[i].element;

//     if (!visible.value) {
//       element.classList.add("overlay-hidden");
//     } else {
//       element.classList.remove("overlay-hidden");
//     }
//   }
// };

const typeData = getTypeData(props.featureType, props.overlayType);

const headingStyle = () => {
  let style = ``;

  switch (props.featureType) {
    case "marker":
      style += `color:${typeData.icon_colour};`;
      style += `border-color:${typeData.marker_colour};`;
      style += `background-color:${typeData.marker_colour};`;

      break;
    case "line":
      style += `color:#fff;background-color:${typeData.line_colour};`;

      break;
  }

  return style;
};
</script>

<template>
  <div class="type">
    <!-- Heading -->
    <!-- <div class="heading" :style="overlayStyle()" @click.stop="toggleExpanded()"> -->
    <div class="heading" :style="headingStyle()">
      <!-- Image -->
      <div class="icon">
        <Preview :featureType="props.featureType" :typeData="typeData" />
      </div>

      <!-- Title -->
      <div class="title">
        {{ typeData[props.featureType + "_title"] }}
        <!-- <span class="count">{{ byType.overlays.length }}</span> -->
      </div>

      <!-- Expand -->
      <!--       <div class="action expand">
        <Button :icon="expandedIcon(expanded)"></Button>
      </div> -->

      <!-- Visible -->
      <!--       <div class="action visible">
        <Button
          :icon="visibleIcon(visible)"
          @click.stop="toggleVisible()"
        ></Button>
      </div> -->
    </div>

    <!-- List -->
    <div class="overlays">
      <div v-for="overlay in props.overlays.getLayers()">
        <Overlay :overlay="overlay" />
      </div>
    </div>
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
    .icon,
    .title,
    .action {
      flex: 1;
      // height: 60px;
      max-width: 60px;
      vertical-align: middle;

      &.icon {
        width: 60px;
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
        font-size: 14px;
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

  .overlay {
    /* Every other */
    &:nth-child(odd) {
      background: #f7f7f7;
    }
  }
}
</style>
