<script setup>
import Group from "@/components/UI/Panel/Overlay/List/Group.vue";

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
    <Group :byType="byType" />
  </div>
</template>
