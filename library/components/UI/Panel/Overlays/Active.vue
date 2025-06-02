<script setup>
import { computed } from "vue";

import { storeToRefs } from "pinia";

import { getFeatureImages, featureHasImage } from "@/helpers/Overlay.js";

import Preview from "@/components/UI/Common/Overlay/Preview.vue";
import Button from "@/components/UI/Common/Button.vue";

import { useInstanceStore } from "@/stores/instanceStore.js";
const { activeLayer } = storeToRefs(useInstanceStore());

const featureImages = computed(() => {
  if (!activeLayer.value) return {};
  return getFeatureImages(activeLayer.value.feature);
});
</script>

<template>
  <!-- START Active Layer -->
  <div v-if="activeLayer" class="active-layer">
    <!-- START Top -->
    <div class="layer-top">
      <!-- Type Preview -->
      <div class="type">
        <Preview
          :featureType="activeLayer.featureType"
          :typeData="activeLayer.typeData"
        />
      </div>

      <!-- Title -->
      <div class="title">{{ activeLayer.feature.properties.title }}</div>

      <Button icon="ion-close" @click="activeLayer = null" />
    </div>
    <!-- End Top -->

    <!-- START Content -->
    <div class="layer-content">
      <!-- Image -->
      <div class="image" v-if="featureHasImage(activeLayer.feature)">
        <img v-if="featureImages.thumbnail" :src="featureImages.thumbnail" />
      </div>

      <!-- Coordinates -->
      <div class="coordinates" v-if="activeLayer.featureType === 'marker'">
        {{ activeLayer.feature.geometry.coordinates[1].toFixed(5) }},
        {{ activeLayer.feature.geometry.coordinates[0].toFixed(5) }}
      </div>

      <!-- Elevation -->
      <div
        class="elevation"
        v-if="
          activeLayer.featureType === 'marker' &&
          activeLayer.feature.geometry.coordinates[2]
        "
        v-html="
          `Elevation: ${activeLayer.feature.geometry.coordinates[2].toFixed(2)} m`
        "
      />

      <!-- Description -->
      <div
        class="description"
        v-if="activeLayer.feature.properties.description"
        v-html="activeLayer.feature.properties.description"
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
