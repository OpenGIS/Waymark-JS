<script setup>
import { ref, onMounted } from "vue";
import WaymarkDevPanel from "./components/WaymarkDevPanel.vue";

const instanceDocuments = ref([]);

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
  const stonehengeDoc = await stonehengeResponse.json();

  // First instance: empty config (debug enabled) + 3 GeoJSON data layers
  const routeInstance = {
    config: { id: "map", debug: true },
    data: {
      layers: [
        { data: markersData },
        { data: track1Data },
        { data: track2Data },
      ],
    },
  };

  instanceDocuments.value = [routeInstance, stonehengeDoc];
});
</script>

<template>
  <div class="dev-app">
    <WaymarkDevPanel
      v-for="doc in instanceDocuments"
      :key="doc.config.id"
      :instance-document="doc"
    />
  </div>
</template>

<style lang="scss" scoped>
.dev-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
