import { createApp } from "vue";
import { createPinia } from "pinia";
import Instance from "../library/components/Instance.vue";

export function useWaymark() {
	const createInstance = (config) => {
		// Ensure we have an ID
		if (typeof config.map_options.div_id === "undefined") {
			console.error("No ID provided for Waymark instance.");

			return;
		}

		// Create Instance
		const instance = createApp(Instance, config);

		// Add Pinia
		const pinia = createPinia();
		instance.use(pinia);

		// Mount to DOM
		instance.mount("#" + config.map_options.div_id);
	};

	return {
		createInstance,
	};
}
