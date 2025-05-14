<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { highlightOverlay } = instanceStore;

import { visibleIcon } from "@/helpers/Common.js";
import Button from "@/components/UI/Common/Button.vue";

const props = defineProps({
  overlay: Object,
});

// const props.overlay.feature = props.overlay.properties;

// let visible = ref(true);

// const toggleVisible = () => {
//   visible.value = !visible.value;

//   const element = props.overlay.element;

//   if (!visible.value) {
//     element.classList.add("overlay-hidden");
//   } else {
//     element.classList.remove("overlay-hidden");
//   }
// };

// const centerOn = () => {
//   instanceStore.setFocus(props.overlay);
// };

// const setActive = () => {
//   instanceStore.setActiveOverlay(props.overlay);
// };

// const isActive = () => {
//   return activeOverlay.value === props.overlay;
// };
</script>

<template>
  <div class="overlay">
    <!-- START Overview -->
    <div class="overview">
      <!-- Title -->
      <div class="title">{{ props.overlay.feature.properties.title }}</div>

      <!-- Image -->
      <div class="image">
        <img
          v-if="props.overlay.feature.properties.image_thumbnail_url"
          :alt="props.overlay.feature.properties.title"
          :src="props.overlay.feature.properties.image_thumbnail_url"
        />
      </div>

      <!-- Go To -->
      <!--       <div class="action go">
        <Button icon="ion-android-arrow-forward" @click.stop="centerOn()" />
      </div> -->

      <!-- Visible -->
      <!--       <div class="action visible">
        <Button :icon="visibleIcon(visible)" @click.stop="toggleVisible()" />
      </div>
 -->
    </div>
    <!-- END Overview -->

    <!-- START Detail -->
    <div class="detail">
      <!-- Image -->
      <div class="image">
        <img
          v-if="props.overlay.feature.properties.image_medium_url"
          :src="props.overlay.feature.properties.image_medium_url"
        />
      </div>

      <!-- Description -->
      <div
        class="description"
        v-if="props.overlay.feature.properties.description"
        v-html="props.overlay.feature.properties.description"
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

      &.action {
        display: none;
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
