<script setup>
import { storeToRefs } from "pinia";

import Preview from "@/components/UI/Common/Overlay/Preview.vue";
import Button from "@/components/UI/Common/Button.vue";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { activeLayer } = storeToRefs(useInstanceStore());
</script>

<template>
  <!-- START Active Layer -->
  <div v-if="activeLayer" class="active-layer">
    <!-- START Top -->
    <div class="layer-top">
      <!-- Type Preview -->
      <div class="type">
        <Preview :type="activeLayer.overlay.type" />
      </div>

      <!-- Title -->
      <div class="title">{{ activeLayer.overlay.getTitle() }}</div>

      <Button icon="ion-close" @click="activeLayer = null" />
    </div>
    <!-- End Top -->

    <!-- START Content -->
    <div class="layer-content">
      <!-- Image -->
      <div class="image" v-if="activeLayer.overlay.hasImage()">
        <img
          v-if="activeLayer.overlay.images.thumbnail"
          :src="activeLayer.overlay.images.thumbnail"
        />
      </div>

      <!-- START Stats -->
      <div
        class="marker-stats"
        v-if="activeLayer.overlay.featureType === 'marker'"
      >
        <!-- Coordinates -->
        <div class="coordinates">
          {{ activeLayer.feature.geometry.coordinates[1].toFixed(5) }},
          {{ activeLayer.feature.geometry.coordinates[0].toFixed(5) }}
        </div>

        <!-- Elevation -->
        <div
          class="elevation"
          v-if="activeLayer.feature.geometry.coordinates[2]"
          v-html="
            `Elevation: ${activeLayer.feature.geometry.coordinates[2].toFixed(2)} m`
          "
        />
      </div>

      <div
        class="line-stats"
        v-else-if="activeLayer.overlay.featureType === 'line'"
      >
        <!-- Length -->
        <div
          class="length"
          v-html="`Length: ${activeLayer.overlay.getLength()} km`"
        />
      </div>
      <!-- END Stats -->

      <!-- Description -->
      <div
        class="description"
        v-if="activeLayer.overlay.getDescription()"
        v-html="activeLayer.overlay.getDescription()"
      />
    </div>
    <!-- End Content -->
  </div>
  <!-- End Active Layer -->
</template>

<style lang="less">
.active-layer {
  max-height: 190px;
  padding: 8px;
  overflow: scroll;
  color: #333;

  border-bottom: 1px solid #999;

  /* Top */
  .layer-top {
    margin-bottom: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid #f3f3f3;
    min-height: 34px;
    display: flex;
    align-items: center;
    position: relative;

    .type {
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 30px;
    }

    .title {
      padding: 0 35px;
      font-size: 20px;
      font-weight: bold;
    }
    .button {
      position: absolute;
      top: 0;
      right: 0;
      margin: 0;
    }
  }

  /* Content */
  .layer-content {
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
      margin-right: 5px;
      margin-bottom: 5px;

      img {
        max-width: 129px;
      }
    }

    .description {
      margin-bottom: 10px;
      font-size: 14px;
    }

    .button {
      position: absolute;
      top: 2px;
      right: 5px;
    }
  }
}
</style>
