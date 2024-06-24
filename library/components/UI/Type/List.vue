<script setup>
import ListGroup from "@/components/UI/Type/ListGroup.vue";

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
    <ListGroup :byType="byType" />
  </div>
</template>
