<script setup>
defineProps({
  typeData: Object,
});
</script>

<template>
  <!-- Icon -->
  <div
    class="waymark-marker"
    :class="typeData.iconData.className"
    v-html="typeData.iconData.html"
    :style="`width:${typeData.iconData.iconSize[0]}px;height:${typeData.iconData.iconSize[1]}px`"
  />
</template>
