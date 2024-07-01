<script setup>
import List from "@/components/UI/Panel/Overlay/Feature/List.vue";

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
    <List :byType="byType" />
  </div>
</template>
