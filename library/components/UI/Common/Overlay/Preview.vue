<script setup>
import { Type, MarkerType, LineType, ShapeType } from "@/classes/Types.js";

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
    <div class="marker" v-if="type instanceof MarkerType">
      <!-- Icon -->
      <div
        class="waymark-marker"
        :class="type.iconData.className"
        v-html="type.iconData.html"
        :style="`width:${type.iconData.iconSize[0]}px;height:${type.iconData.iconSize[1]}px`"
      />
    </div>

    <!-- Line -->
    <div class="line" v-else-if="type instanceof LineType">
      <div
        class="inner"
        :style="`background-color:${type.getPrimaryColour()};height:${type.getLineWeight()}px`"
      />
    </div>

    <!-- Shape -->
    <div class="shape" v-else-if="type instanceof ShapeType">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="40" :fill="type.getPrimaryColour()" />
      </svg>
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
