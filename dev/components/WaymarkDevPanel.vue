<script setup>
import { computed, ref, watch } from "vue";
import { useWaymarkInstance } from "../composables/useWaymarkInstance.js";

const props = defineProps({
  instanceDocument: {
    type: Object,
    required: true,
  },
  initialLayers: {
    type: Array,
    default: () => [],
  },
});

const { instance, uiMode, setMode, debugEnabled, setDebug } =
  useWaymarkInstance({
    instanceDocument: props.instanceDocument,
  });

// Add initial layers via runtime API after instance is created
// Uses addLayer() so layers are mounted individually with fitBounds support
let layersAdded = false;

watch(
  () => [instance.value, props.initialLayers],
  ([inst, layers]) => {
    if (inst && layers.length > 0 && !layersAdded) {
      layersAdded = true;

      layers.forEach((layer, index) => {
        const isLast = index === layers.length - 1;
        inst.data.addLayer(layer, { fitBounds: isLast });
      });
    }
  },
  { immediate: true },
);

const mapId = computed(() => props.instanceDocument.config.id);
const selectId = computed(() => {
  if (mapId.value === "map") {
    return "dev-instance-mode";
  }

  if (mapId.value === "map-two") {
    return "dev-instance-mode-two";
  }

  return `${mapId.value}-mode-select`;
});
const labelText = computed(() => `#${mapId.value} ui.mode`);
const uploadInputId = computed(() => `${mapId.value}-geojson-upload`);
const debugCheckboxId = computed(() => `${mapId.value}-debug`);

const fileInput = ref(null);

function triggerUpload() {
  fileInput.value?.click();
}

function handleFileUpload(event) {
  const file = event.target.files?.[0];

  if (!file || !instance.value) {
    event.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = (loadEvent) => {
    try {
      const parsedGeoJSON = JSON.parse(loadEvent.target.result);

      instance.value.data.addLayer(
        { data: parsedGeoJSON },
        { fitBounds: true },
      );
    } catch (error) {
      console.error("[waymark:dev] Failed to parse uploaded GeoJSON", error);
    } finally {
      event.target.value = "";
    }
  };

  reader.onerror = () => {
    console.error("[waymark:dev] Failed to read uploaded GeoJSON file");
    event.target.value = "";
  };

  reader.readAsText(file);
}
</script>

<template>
  <div class="waymark-dev-panel">
    <div class="waymark-dev-panel-controls">
      <label :for="selectId">{{ labelText }}: </label>
      <select
        :id="selectId"
        :value="uiMode"
        @change="setMode($event.target.value)"
      >
        <option value="view">view</option>
        <option value="debug">debug</option>
      </select>
      <label :for="debugCheckboxId">
        <input
          :id="debugCheckboxId"
          type="checkbox"
          :checked="debugEnabled"
          @change="setDebug($event.target.checked)"
        />
        debug logging
      </label>
      <input
        :id="uploadInputId"
        ref="fileInput"
        type="file"
        accept=".geojson,.json,application/geo+json,application/json"
        aria-label="Upload GeoJSON"
        class="waymark-dev-panel-upload-input"
        @change="handleFileUpload"
      />
      <button type="button" @click="triggerUpload">Upload GeoJSON</button>
    </div>
    <div :id="mapId" class="waymark-dev-panel-map"></div>
  </div>
</template>

<style lang="scss" scoped>
.waymark-dev-panel {
  height: 50vh;
  display: flex;
  flex-direction: column;
}

.waymark-dev-panel-controls {
  padding: 0.25rem 0.5rem;
  background: #f8f9fb;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.waymark-dev-panel-upload-input {
  display: none;
}

.waymark-dev-panel-map {
  flex: 1;
  min-height: 0;
}
</style>
