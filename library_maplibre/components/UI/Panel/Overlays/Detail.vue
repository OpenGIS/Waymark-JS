<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

const instanceStore = useInstanceStore();
const { activeOverlay } = storeToRefs(instanceStore);

import { expandedIcon } from "@/helpers/Common.js";

import Button from "@/components/UI/Common/Button.vue";
import Preview from "@/components/UI/Common/Overlay/Preview.vue";

const panelExpanded = ref(true);

// const detailHeight = computed(() => {
//   //Closed
//   if (!activeOverlay.value) {
//     return "0px";
//   }

//   //Open
//   if (!panelExpanded.value) {
//     return "60px";
//   }
// });

const detailClass = computed(() => {
  if (Object.keys(activeOverlay.value.imageURLs).length) {
    return "has-image";
  }
});

const togglePanelExpanded = () => {
  panelExpanded.value = !panelExpanded.value;
};
</script>

<template>
  <div v-if="activeOverlay.feature" :class="`detail ${detailClass}`">
    <table>
      <tr class="item" @click="setActive">
        <!-- Image -->
        <td class="image">
          <Preview
            :typeData="activeOverlay.typeData"
            :featureType="activeOverlay.featureType"
          />
        </td>

        <!-- Title -->
        <td class="title">{{ activeOverlay.feature.properties.title }}</td>

        <!-- Expand -->
        <td class="action expand">
          <Button
            :icon="expandedIcon(panelExpanded)"
            @click.stop="togglePanelExpanded()"
          />
        </td>

        <!-- Close -->
        <td class="action close">
          <Button icon="ion-close" @click.stop="activeOverlay = {}" />
        </td>
      </tr>
    </table>

    <div v-show="panelExpanded" :class="getImageUrls">
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
  </div>
</template>

<style lang="less">
.detail {
  padding: 1%;
  max-height: 31.33%;
  overflow-y: scroll;
  background: rgba(249, 249, 249, 0.9);
  transition: all 0.1s;
  box-shadow: 0 0 0 3px #eee;

  // &.has-image {
  //   .content {
  //     display: flex;
  //     flex-direction: row;
  //     > div {
  //       max-width: 48%;
  //     }
  //     .image {
  //       img {
  //         max-width: 100%;
  //       }
  //     }
  //   }
  // }

  .title {
    font-size: 140%;
  }

  .content {
    .description {
      padding: 0 2%;
      font-size: 120%;
    }
  }
}
</style>
