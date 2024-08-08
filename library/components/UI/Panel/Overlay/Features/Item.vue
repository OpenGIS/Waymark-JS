<script setup>
import { ref } from "vue";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();

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
</script>

<template>
  <div
    class="item"
    @click="setActive"
    @mouseenter="toggleHover"
    @mouseleave="toggleHover"
  >
    <!-- Image -->
    <div class="image">
      <img
        v-if="feature_props.image_thumbnail_url"
        :alt="feature_props.title"
        :src="feature_props.image_thumbnail_url"
      />
    </div>

    <!-- Title -->
    <div class="title">{{ feature_props.title }}</div>

    <!-- Go To -->
    <div class="action go">
      <Button icon="ion-android-search" @click.stop="centerOn()" />
    </div>

    <!-- Visible -->
    <div class="action visible">
      <Button :icon="visibleIcon(visible)" @click.stop="toggleVisible()" />
    </div>
  </div>
</template>

<style lang="less">
.item {
  display: flex;
  align-items: center;

  height: 60px;

  &:nth-of-type(odd) {
    background: #f9f9f9;
  }

  > div {
    flex: 1;
    max-width: 60px;

    &.title {
      max-width: unset;
      flex: auto;
    }
  }
}
</style>
