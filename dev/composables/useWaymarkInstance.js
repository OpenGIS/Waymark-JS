import { ref, onMounted, onUnmounted } from "vue";
import { createInstance } from "../../src/entry.js";

export function useWaymarkInstance({ instanceDocument }) {
  const instance = ref(null);
  const uiMode = ref(instanceDocument.config?.ui?.mode ?? "view");
  const debugEnabled = ref(instanceDocument.config?.debug ?? false);

  const mapId = instanceDocument.config.id;

  function getCurrentMode() {
    const doc = instance.value.toJSON();

    return doc.state.ui?.mode ?? doc.config.ui.mode;
  }

  function getCurrentDebug() {
    const doc = instance.value.toJSON();

    return doc.state.debug ?? doc.config.debug;
  }

  onMounted(() => {
    instance.value = createInstance(instanceDocument);
    uiMode.value = getCurrentMode();
    debugEnabled.value = getCurrentDebug();

    if (!window.waymarkInstances) {
      window.waymarkInstances = {};
    }
    window.waymarkInstances[mapId] = instance.value;
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

  function setDebug(enabled) {
    instance.value.debug.setEnabled(enabled);
    debugEnabled.value = getCurrentDebug();
  }

  return {
    instance,
    uiMode,
    setMode,
    debugEnabled,
    setDebug,
  };
}
