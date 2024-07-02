<script setup>
defineProps({
  featureType: {
    type: String,
    required: true,
  },
  typeData: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="preview">
    <div class="marker" v-if="featureType === 'marker'">
      <!-- Icon -->
      <div
        class="waymark-marker"
        :class="typeData.iconData.className"
        v-html="typeData.iconData.html"
        :style="`width:${typeData.iconData.iconSize[0]}px;height:${typeData.iconData.iconSize[1]}px`"
      />
    </div>
  </div>
</template>
