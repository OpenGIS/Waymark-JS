<script setup>
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { activeOverlay, detailExpanded } = storeToRefs(instanceStore);

import Preview from "@/components/UI/Common/Overlay/Preview.vue";

const detailClass = computed(() => {
  if (Object.keys(activeOverlay.value.imageURLs).length) {
    return "has-image";
  } else {
    return "";
  }
});
</script>

<template>
  <div v-if="activeOverlay.feature" :class="`panel detail ${detailClass}`">
    <!-- Type -->
    <div class="type">
      <Preview
        :typeData="activeOverlay.typeData"
        :featureType="activeOverlay.featureType"
      />
    </div>

    <!-- Title -->
    <div class="title">{{ activeOverlay.feature.properties.title }}</div>

    <!-- Image -->
    <div class="image">
      <img
        v-if="activeOverlay.feature.properties.image_medium_url"
        :src="activeOverlay.feature.properties.image_medium_url"
      />
    </div>

    <!-- Description -->
    <div
      class="description"
      v-if="activeOverlay.feature.properties.description"
      v-html="activeOverlay.feature.properties.description"
    />
  </div>
</template>

<style lang="less">
.panel.detail {
  > div {
    margin-bottom: 1rem;
  }

  .type {
    width: 40px;
    height: 40px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
  }

  .description {
    font-size: 14px;
  }
}
</style>
