<script setup>
import { storeToRefs } from "pinia";

import Preview from "@/components/UI/Common/Overlay/Preview.vue";
import Button from "@/components/UI/Common/Button.vue";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { activeOverlay } = storeToRefs(useInstanceStore());

import { useMap } from "@/composables/useMap.js";
const { setActiveOverlay } = useMap();
</script>

<template>
  <!-- START Active Overlay -->
  <div
    v-if="activeOverlay"
    :class="`active-overlay feature-${activeOverlay.featureType}`"
  >
    <!-- START Top -->
    <div class="overlay-top">
      <!-- Type Preview -->
      <div class="type">
        <Preview :type="activeOverlay.type" />
      </div>

      <!-- Title -->
      <div class="title">{{ activeOverlay.getTitle() }}</div>

      <Button icon="fa-close" @click="setActiveOverlay(null)" />
    </div>
    <!-- End Top -->

    <!-- START Content -->
    <div class="overlay-content">
      <!-- Image -->
      <div class="image" v-if="activeOverlay.hasImage()">
        <img
          v-if="activeOverlay.images.thumbnail"
          :src="activeOverlay.images.thumbnail"
        />
      </div>
      <!-- Description -->
      <div
        class="description"
        v-if="activeOverlay.getDescription()"
        v-html="activeOverlay.getDescription()"
      />

      <!-- START Stats -->
      <div class="stats">
        <!-- Coordinates -->
        <div class="coordinates">
          {{ activeOverlay.getCoordsString() }}
        </div>

        <!-- Length -->
        <div
          class="length"
          v-if="activeOverlay.featureType === 'line'"
          v-html="activeOverlay.getLengthString()"
        />

        <!-- Elevation -->
        <div class="elevation" v-if="activeOverlay.hasElevationData()">
          {{ activeOverlay.getElevationString() }}
        </div>
      </div>
      <!-- END Stats -->
    </div>
    <!-- End Content -->
  </div>
  <!-- End Active Overlay -->
</template>

<style lang="less">
.active-overlay {
  min-height: 100px;
  max-height: 185px;
  overflow: scroll;
  color: #333;

  border-left: 1px solid #999;

  /* Top */
  .overlay-top {
    padding: 3px;
    background: linear-gradient(to bottom, #f9f9f9, #eee);
    margin-bottom: 5px;
    padding-bottom: 5px;
    padding-right: 40px;
    border-bottom: 1px solid #999;
    min-height: 30px;
    display: flex;
    align-items: center;
    position: relative;
    vertical-align: middle;

    // .type {
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   width: 30px;
    //   height: 30px;
    // }

    .type {
      width: 32px;
      margin-right: 5px;
    }

    .title {
      // padding: 0 35px;
      font-size: 15px;
      font-weight: bold;
    }
    .button {
      position: absolute;
      top: 3px;
      right: 3px;
      margin: 0;
    }
  }

  /* Content */
  .overlay-content {
    padding: 5px 7px;
    /* Self Clear floats */
    height: auto;
    clear: both;

    > div {
      margin-bottom: 5px;
    }

    .coordinates {
      color: #666;
    }

    .image {
      float: left;
      margin-right: 10px;
      margin-bottom: 5px;

      img {
        max-width: 129px;
      }
    }

    .description {
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 1.15em;
    }

    .button {
      position: absolute;
      top: 2px;
      right: 5px;
    }
  }

  /* Lines */
  &.feature-line {
    .overlay-top {
      .type {
        width: 30px;
      }
    }
  }
}
</style>
