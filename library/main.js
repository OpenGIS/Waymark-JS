import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "../library/components/App.vue";
import { useMap } from "@/composables/useMap.js";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

export class Instance {
	constructor(config) {
		// Ensure we have an ID
		if (typeof config.map_options.div_id === "undefined") {
			console.error("No Container ID provided for Waymark instance.");

			return;
		}

		// Create Vue App
		const app = createApp(App, config);

		// Add Pinia
		const pinia = createPinia();
		app.use(pinia);

		// Mount to DOM
		app.mount("#" + config.map_options.div_id);

		this.store = storeToRefs(useInstanceStore());
		this.loadGeoJSON = useMap().loadGeoJSON;
		this.toGeoJSON = useMap().toGeoJSON;
		this.clearGeoJSON = useMap().clearGeoJSON;
	}
}
