<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { activeOverlay } = storeToRefs(instanceStore);

import { visibleIcon } from "@/helpers/Common.js";
import Button from "@/components/UI/Common/Button.vue";

const props = defineProps({
  overlay: Object,
});

const feature_props = props.overlay.feature.properties;

let visible = ref(true);

const toggleVisible = () => {
  visible.value = !visible.value;

  const element = props.overlay.element;

  if (!visible.value) {
    element.classList.add("overlay-hidden");
  } else {
    element.classList.remove("overlay-hidden");
  }
};

const centerOn = () => {
  instanceStore.setFocus(props.overlay);
};

const setActive = () => {
  instanceStore.setActiveOverlay(props.overlay);
};

const toggleHover = () => {
  instanceStore.toggleHoverOverlay(props.overlay);
};

const isActive = () => {
  return activeOverlay.value === props.overlay;
};
</script>

<template>
  <div
    :class="`overlay ${isActive() ? 'active' : ''} overlay-${props.overlay.id}`"
    @mouseenter="toggleHover"
    @mouseleave="toggleHover"
  >
    <!-- START Overview -->
    <div class="overview" @click="setActive">
      <!-- Title -->
      <div class="title">{{ feature_props.title }}</div>

      <!-- Image -->
      <div class="image">
        <img
          v-if="feature_props.image_thumbnail_url"
          :alt="feature_props.title"
          :src="feature_props.image_thumbnail_url"
        />
      </div>

      <!-- Go To -->
      <div class="action go">
        <Button icon="ion-android-search" @click.stop="centerOn()" />
      </div>

      <!-- Visible -->
      <div class="action visible">
        <Button :icon="visibleIcon(visible)" @click.stop="toggleVisible()" />
      </div>
    </div>
    <!-- END Overview -->

    <!-- START Detail -->
    <div class="detail">
      <!-- Image -->
      <div class="image">
        <img
          v-if="feature_props.image_medium_url"
          :src="feature_props.image_medium_url"
        />
      </div>

      <!-- Description -->
      <div
        class="description"
        v-if="feature_props.description"
        v-html="feature_props.description"
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
        font-size: 15px;
        font-weight: 300;
      }
    }
  }

  /* Detail */
  .detail {
    display: none;
  }

  &.active {
    color: blue !important;
    background: red !important;

    .overview {
      .title {
        font-weight: bold;
      }
    }

    .detail {
      display: block;
    }
  }
}
</style>
