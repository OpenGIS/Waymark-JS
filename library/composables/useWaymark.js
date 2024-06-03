import { createApp } from "vue";
import { createPinia } from "pinia";

import Map from "@/components/Map.vue";

export function useWaymark() {
	const createInstance = (config) => {
		// Ensure we at least have an ID
		if (!config.id) {
			console.error("No ID provided for Waymark instance.");
			return;
		}

		// Create Map
		const app = createApp(Map, config);

		// Create Pinia Store
		const pinia = createPinia();

		// Use Pinia Store
		app.use(pinia);

		// Mount App
		app.mount("#" + config.id);
	};

	return {
		createInstance,
	};
}
