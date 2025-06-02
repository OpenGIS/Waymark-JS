<script setup>
import { Type } from "@/classes/Type.js";

const props = defineProps({
  type: {
    type: Type,
    required: true,
  },
});
</script>

<template>
  <div class="preview">
    <!-- Marker -->
    <div class="marker" v-if="type.featureType === 'marker'">
      <!-- Icon -->
      <div
        class="waymark-marker"
        :class="type.iconData.className"
        v-html="type.iconData.html"
        :style="`width:${type.iconData.iconSize[0]}px;height:${type.iconData.iconSize[1]}px`"
      />
    </div>

    <!-- Line -->
    <div class="line" v-else-if="type.featureType === 'line'">
      <div
        class="inner"
        :style="`background-color:${type.data.line_colour};height:${type.data.line_weight}px`"
      />
    </div>
  </div>
</template>

<style lang="less">
.preview {
  .line {
    .inner {
      margin: 10px 0;
      width: 100%;
    }
  }
}
</style>
