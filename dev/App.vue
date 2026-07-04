<script setup>
import { ref, onMounted } from "vue";
import WaymarkDevPanel from "./components/WaymarkDevPanel.vue";

const routeLayers = ref([]);
const stonehengeDoc = ref(null);

onMounted(async () => {
  const [markersResponse, track1Response, track2Response, stonehengeResponse] =
    await Promise.all([
      fetch("/documents/geojson/markers.json"),
      fetch("/documents/geojson/track-1.geojson"),
      fetch("/documents/geojson/track-2.geojson"),
      fetch("/documents/instances/stonehenge.json"),
    ]);

  const markersData = await markersResponse.json();
  const track1Data = await track1Response.json();
  const track2Data = await track2Response.json();
  const stonehengeData = await stonehengeResponse.json();

  // First instance: boot with minimal debug config, add layers at runtime
  routeLayers.value = [
    { data: track1Data },
    { data: track2Data },
    { data: markersData },
  ];
  stonehengeDoc.value = stonehengeData;
});
</script>

<template>
  <div class="dev-app">
    <WaymarkDevPanel
      :instance-document="{ config: { id: 'map', debug: true } }"
      :initial-layers="routeLayers"
    />
    <WaymarkDevPanel v-if="stonehengeDoc" :instance-document="stonehengeDoc" />
  </div>
</template>

<style lang="scss" scoped>
.dev-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
