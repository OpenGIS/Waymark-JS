import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "../library/components/App.vue";
import { useMap } from "@/composables/useMap.js";
import { storeToRefs } from "pinia";
import { useInstanceStore } from "@/stores/instanceStore.js";

export class Instance {
	constructor(config = {}) {
		// Normalise configuration object
		config.map_options = {
			div_id: "waymark-instance",
			...(config.map_options || {}),
		};

		// Ensure we have a container
		if (!document.getElementById(config.map_options.div_id)) {
			const container = document.createElement("div");
			container.id = config.map_options.div_id;
			// Add dimensions
			container.style.height = "100%";
			document.body.appendChild(container);
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
