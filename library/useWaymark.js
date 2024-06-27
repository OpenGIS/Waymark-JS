import { createApp } from "vue";
import { createPinia } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";
import Instance from "../library/components/Instance.vue";

export function useWaymark() {
	// Default Config
	let defaultConfig = {
		id: "map",
		lng: -128.0094,
		lat: 50.6539,
		zoom: 16,
		geoJSON: {},
		mapConfig: {},
	};

	const createInstance = (userConfig) => {
		// Apply User Config
		const config = { ...defaultConfig, ...userConfig };

		// Create Instance
		const instance = createApp(Instance);

		// Add Pinia
		const pinia = createPinia();
		instance.use(pinia);

		// Create Store
		const { createStore } = useInstanceStore();
		createStore(config);

		// Mount to DOM
		instance.mount("#" + config.id);
	};

	return {
		createInstance,
	};
}
