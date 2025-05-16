<script setup>
import { ref } from "vue";

import { useLeaflet } from "@/composables/useLeaflet.js";
const { focusMapOnLayer } = useLeaflet();

import { useInstanceStore } from "@/stores/instanceStore.js";
const { state } = useInstanceStore();

import { visibleIcon, expandedIcon } from "@/helpers/Common.js";
import Button from "@/components/UI/Common/Button.vue";

const props = defineProps({
  layer: Object,
});

let isVisible = ref(true);
let isExpanded = ref(false);

const toggleVisible = () => {
  isVisible.value = !isVisible.value;

  // Close if hiding
  if (!isVisible.value) {
    isExpanded.value = false;
  }

  state.map.removeLayer(props.layer);

  if (isVisible.value) {
    state.map.addLayer(props.layer);
  }
};
</script>

<template>
  <div class="overlay">
    <!-- START Overview -->
    <div class="overview">
      <!-- Image -->
      <div class="image">
        <img
          v-if="props.layer.feature.properties.image_thumbnail_url"
          :alt="props.layer.feature.properties.title"
          :src="props.layer.feature.properties.image_thumbnail_url"
        />
      </div>

      <!-- Title -->
      <div class="title">{{ props.layer.feature.properties.title }}</div>

      <!-- Go To -->
      <div class="action go">
        <Button
          icon="ion-android-arrow-forward"
          @click.stop="focusMapOnLayer(props.layer)"
        />
      </div>

      <!-- Expanded -->
      <div class="action visible">
        <Button
          :icon="expandedIcon(isExpanded)"
          @click.stop="isExpanded = !isExpanded"
        />
      </div>

      <!-- Visible -->
      <div class="action visible">
        <Button :icon="visibleIcon(isVisible)" @click.stop="toggleVisible()" />
      </div>
    </div>
    <!-- END Overview -->

    <!-- START Detail -->
    <div class="detail" v-show="isExpanded">
      <!-- Image -->
      <div class="image">
        <img
          v-if="props.layer.feature.properties.image_medium_url"
          :src="props.layer.feature.properties.image_medium_url"
        />
      </div>

      <!-- Description -->
      <div
        class="description"
        v-if="props.layer.feature.properties.description"
        v-html="props.layer.feature.properties.description"
      />
    </div>
    <!-- END Detail -->
  </div>
</template>

<style lang="less">
.overlay {
  /* Overview */
  .overview {
    display: flex;
    align-items: center;

    height: 60px;

    .image,
    .title,
    .action {
      flex: 1;
      // max-width: 60px;
      padding-right: 5px;

      &.image {
        min-width: 60px;

        img {
          max-width: 100%;
          max-height: 100%;
        }
      }

      &.title {
        padding-left: 10px;
        width: 200px;
        flex: auto;
        font-size: 13px;
        font-weight: 300;
      }
    }
  }

  /* Detail */
  .detail {
    // display: none;
  }

  &.active {
    color: blue !important;
    background: red !important;

    .overview {
      .title {
        font-weight: bold;
      }

      .action {
        display: block;
      }
    }

    .detail {
      display: block;
    }
  }
}
</style>
