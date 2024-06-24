<script setup>
import ListTypesGroup from "@/components/UI/Overlay/ListTypesGroup.vue";

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
    <ListTypesGroup :byType="byType" />
  </div>
</template>
