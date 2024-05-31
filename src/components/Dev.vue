<script setup>
import Map from "./Map.vue";

const data = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-128.0094, 50.6539] },
      properties: { type: "food" },
    },
  ],
};
</script>

<template>
  <!--   <h1>Default</h1>

  <Map />

  <h1>Eiffel Tower</h1>

  <Map id="eiffel" lng="2.2945" lat="48.8584" zoom="16" /> -->

  <h1>Data</h1>

  <Map id="data" :data="data" />
</template>

<style scoped>
#dev {
}

.map {
  margin-top: 1em;
}
</style>
