<script setup>
import { onMounted } from "vue";

const props = defineProps({
  featureType: {
    type: String,
    required: true,
  },
  typeData: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  console.log("featureType", props);
});
</script>

<template>
  <div class="preview">
    <!-- Marker -->
    <div class="marker" v-if="featureType === 'marker'">
      <!-- Icon -->
      <div
        class="waymark-marker"
        :class="typeData.iconData.className"
        v-html="typeData.iconData.html"
        :style="`width:${typeData.iconData.iconSize[0]}px;height:${typeData.iconData.iconSize[1]}px`"
      />
    </div>

    <!-- Line -->
    <div class="line" v-else-if="featureType === 'line'">
      <div
        class="inner"
        :style="`background-color:${typeData.line_colour};height:${typeData.line_weight}px`"
      />
    </div>
  </div>
</template>

<style lang="less">
.preview {
  .line {
    .inner {
      width: 100%;
    }
  }
}
</style>
