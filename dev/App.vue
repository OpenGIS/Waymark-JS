<script setup>
import { ref, onMounted } from "vue";
import WaymarkDevPanel from "./components/WaymarkDevPanel.vue";

const routeConfig = ref(null);
const routeLayers = ref([]);
const stonehengeDoc = ref(null);

onMounted(async () => {
  const [
    configResponse,
    markersResponse,
    track1Response,
    track2Response,
    stonehengeResponse,
  ] = await Promise.all([
    fetch("/documents/config/route.json"),
    fetch("/documents/geojson/route/markers.json"),
    fetch("/documents/geojson/route/track-1.geojson"),
    fetch("/documents/geojson/route/track-2.geojson"),
    fetch("/documents/instances/stonehenge.json"),
  ]);

  const configData = await configResponse.json();
  const markersData = await markersResponse.json();
  const track1Data = await track1Response.json();
  const track2Data = await track2Response.json();
  const stonehengeData = await stonehengeResponse.json();

  routeConfig.value = configData;
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
      v-if="routeConfig"
      :instance-document="routeConfig"
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
