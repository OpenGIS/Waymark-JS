<script setup>
import { onMounted } from "vue";
import { useWaymark } from "../dist/library/waymark-js.js";

const { createInstance } = useWaymark();

onMounted(() => {
  createInstance({
    id: "app",
    lng: -128.0094,
    lat: 50.6539,
    zoom: 18,
    geoJSON: {},
  });
});
</script>

<template>
  <div id="app"></div>
</template>

<style></style>
