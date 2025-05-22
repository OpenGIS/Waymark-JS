<script setup>
import { ref, computed, useTemplateRef } from "vue";
import { storeToRefs } from "pinia";

import { getFeatureType } from "@/helpers/Overlay.js";

import { useLeaflet } from "@/composables/useLeaflet.js";
const { focusMapOnLayer, highlightLayer, unHighlightLayer } = useLeaflet();

import { useInstanceStore } from "@/stores/instanceStore.js";
const instanceStore = useInstanceStore();
const {
  map,
  panelOpen,
  activeLayer,
  activePanelKey,
  activeFeatureType,
  filteredLayers,
} = storeToRefs(instanceStore);

import { visibleIcon } from "@/helpers/Common.js";
import Button from "@/components/UI/Common/Button.vue";

const props = defineProps({
  layer: Object,
});

let isOnMap = ref(true);

const setActiveLayer = () => {
  // If active layer is set, remove it
  if (activeLayer.value) {
    // If this is the active layer
    if (activeLayer.value === props.layer) {
      // Increase zoom
      map.value.setZoom(map.value.getZoom() + 1);

      return;
    }

    // Remove highlight
    unHighlightLayer(activeLayer.value);

    // Make inactive
    activeLayer.value = null;
  }

  // Make active
  activeLayer.value = props.layer;
  focusMapOnLayer(props.layer);
  highlightLayer(props.layer);
};

const isActiveLayer = computed(() => {
  return activeLayer.value === props.layer;
});

const inFilteredLayers = computed(() => {
  return filteredLayers.value.hasLayer(props.layer);
});

const toggleOnMap = () => {
  isOnMap.value = !isOnMap.value;

  // Close if hiding
  if (isActiveLayer.value) {
    // Remove highlight
    unHighlightLayer(activeLayer.value);

    // Make inactive
    activeLayer.value = null;
  }

  map.value.removeLayer(props.layer);

  if (isOnMap.value) {
    map.value.addLayer(props.layer);
  }
};

// Add click handler to the layer
const container = useTemplateRef("container");

props.layer.on("click", () => {
  setActiveLayer();
  activeFeatureType.value = getFeatureType(props.layer.feature);
  activePanelKey.value = "overlays";
  panelOpen.value = true;

  // Wait for next tick to ensure DOM is updated
  nextTick(() => {
    // Scroll to the clicked layer
    container.value.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  });
});
</script>

<template>
  <!-- START Overlay -->

  <div
    ref="container"
    class="overlay"
    @click="setActiveLayer()"
    :class="{ active: isActiveLayer, hidden: !inFilteredLayers }"
  >
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

      <!-- OnMap -->
      <div class="action visible">
        <Button :icon="visibleIcon(isOnMap)" @click.stop="toggleOnMap()" />
      </div>
    </div>
    <!-- END Overview -->

    <!-- START Detail -->
    <div class="detail" v-show="isActiveLayer">
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
  <!-- END Overlay -->
</template>

<style lang="less">
.map {
  .waymark-marker {
    &.waymark-active {
      z-index: 1000 !important;
      .waymark-marker-background {
        border: 4px solid red;
      }
      .waymark-marker-icon::before {
        padding-top: 8px;
        margin-left: 8px;
      }
    }
  }
}

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
    .image {
      img {
        max-height: 120px;
      }
    }
  }

  &.active {
    color: blue !important;
    background: red !important;

    .overview {
      .title {
        font-weight: bold;
      }
    }
  }

  &.hidden {
    display: none;
  }
}
</style>
