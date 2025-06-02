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
    <!-- Type Preview -->
    <div class="type">
      <Preview
        :featureType="activeLayer.featureType"
        :typeData="activeLayer.typeData"
      />
    </div>

    <!-- Title -->
    <div class="title">{{ activeLayer.feature.properties.title }}</div>

    <!-- Image -->
    <div class="image">
      <img
        v-if="activeLayer.feature.properties.image_medium_url"
        :src="activeLayer.feature.properties.image_medium_url"
      />
    </div>

    <!-- Coordinates -->
    <div class="coordinates">
      {{ activeLayer.feature.geometry.coordinates[1].toFixed(5) }},
      {{ activeLayer.feature.geometry.coordinates[0].toFixed(5) }}
    </div>

    <!-- Description -->
    <div
      class="description"
      v-if="activeLayer.feature.properties.description"
      v-html="activeLayer.feature.properties.description"
    />

    <!-- Close -->
    <Button icon="ion-close" @click="activeLayer = null" />
  </div>
  <!-- End Active Layer -->
</template>

<style lang="less">
.active-layer {
  max-height: 160px;
  padding: 8px;
  overflow: scroll;
  color: #333;

  border-bottom: 1px solid #999;

  > div {
    margin-bottom: 5px;
  }

  .type {
    float: left;
    margin-right: 10px;
    width: 30px;
  }

  .title {
    padding-right: 30px;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .coordinates {
    // font-size: 14px;
    color: #666;
    // margin-bottom: 10px;
  }

  .image {
    float: left;
    margin-right: 10px;
    img {
      max-width: 120px;
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
</style>
