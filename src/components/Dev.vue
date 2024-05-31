<script setup>
import { ref } from "vue";

const lng = ref(-128.0094);
const lat = ref(50.6539);
const zoom = ref(14);
const data = ref({});

import Map from "./Map.vue";
</script>

<template>
  <h1>Default</h1>

  <Map />

  <h1>Eiffel Tower</h1>

  <Map id="eiffel" lng="2.2945" lat="48.8584" zoom="18" />
</template>

<style scoped>
#dev {
}

.map {
  margin-top: 1em;
}
</style>
