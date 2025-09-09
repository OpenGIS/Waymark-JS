<script setup>
import Type from "@/components/UI/Panel/Overlays/List/Type.vue";

defineProps({
  overlaysByType: Object,
});
</script>

<template>
  <div
    class="type-list"
    v-for="(byType, typeKey, index) in overlaysByType"
    :key="`${byType.featureType}-${typeKey}-${index}`"
  >
    <!-- Features by Type -->
    <Type :byType="byType" />
  </div>
</template>
