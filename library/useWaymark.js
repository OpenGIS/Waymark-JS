import { watch, createApp } from "vue";
import { createPinia } from "pinia";
import Instance from "../library/components/Instance.vue";
import { useMap } from "@/composables/useMap.js";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

export function useWaymark() {
	const createInstance = (config) => {
		// Ensure we have an ID
		if (typeof config.map_options.div_id === "undefined") {
			console.error("No Container ID provided for Waymark instance.");

			return;
		}

		// Create Vue App
		const app = createApp(Instance, config);

		// Add Pinia
		const pinia = createPinia();
		app.use(pinia);

		// Mount to DOM
		app.mount("#" + config.map_options.div_id);

		// Create Instance
		const { overlays, activeOverlay } = storeToRefs(useInstanceStore());

		const instance = {
			overlays,
			activeOverlay,
			loadGeoJSON: useMap().loadGeoJSON,
		};

		return instance;
	};

	return {
		createInstance,
	};
}
