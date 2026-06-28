import { ref, onMounted, onUnmounted } from "vue";
import { createInstance } from "../../src/entry.js";
import {
  WAYMARK_DATA_LAYER_ADDED_EVENT,
  WAYMARK_DATA_LAYER_ERROR_EVENT,
  WAYMARK_DATA_LAYER_MOUNTED_EVENT,
  WAYMARK_INSTANCE_CREATED_EVENT,
  WAYMARK_INSTANCE_DESTROYED_EVENT,
  WAYMARK_INSTANCE_RECREATED_EVENT,
  WAYMARK_MAP_LOAD_EVENT,
  WAYMARK_MAP_MOVEEND_EVENT,
  WAYMARK_MAP_PITCHEND_EVENT,
  WAYMARK_MAP_ROTATEEND_EVENT,
  WAYMARK_MAP_ZOOMEND_EVENT,
  WAYMARK_UI_MODE_CHANGED_EVENT,
} from "../../src/runtime/createInstanceEvents.js";

const DEV_INSTANCE_CONTAINER_EVENTS = [
  WAYMARK_INSTANCE_CREATED_EVENT,
  WAYMARK_INSTANCE_RECREATED_EVENT,
  WAYMARK_INSTANCE_DESTROYED_EVENT,
  WAYMARK_MAP_LOAD_EVENT,
  WAYMARK_MAP_MOVEEND_EVENT,
  WAYMARK_MAP_ZOOMEND_EVENT,
  WAYMARK_MAP_ROTATEEND_EVENT,
  WAYMARK_MAP_PITCHEND_EVENT,
  WAYMARK_UI_MODE_CHANGED_EVENT,
  WAYMARK_DATA_LAYER_ADDED_EVENT,
  WAYMARK_DATA_LAYER_MOUNTED_EVENT,
  WAYMARK_DATA_LAYER_ERROR_EVENT,
];

export function useWaymarkInstance({ instanceDocument }) {
  const instance = ref(null);
  const uiMode = ref(instanceDocument.config?.ui?.mode ?? "view");

  const mapId = instanceDocument.config.id;

  function attachEventLogging() {
    for (const eventType of DEV_INSTANCE_CONTAINER_EVENTS) {
      instance.value.on(eventType, (event) => {
        console.info(`[waymark:dev:event] ${mapId} ${event.type}`);
      });
    }
  }

  function getCurrentMode() {
    const doc = instance.value.toJSON();

    return doc.state.ui?.mode ?? doc.config.ui.mode;
  }

  onMounted(() => {
    instance.value = createInstance(instanceDocument);
    uiMode.value = getCurrentMode();

    if (!window.waymarkInstances) {
      window.waymarkInstances = {};
    }
    window.waymarkInstances[mapId] = instance.value;

    attachEventLogging();
  });

  onUnmounted(() => {
    if (instance.value) {
      instance.value.destroy();
    }

    delete window.waymarkInstances?.[mapId];
  });

  function setMode(mode) {
    instance.value.ui.setMode(mode);
    uiMode.value = getCurrentMode();
  }

  return {
    instance,
    uiMode,
    setMode,
  };
}
