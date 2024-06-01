import { createApp } from "vue";
import { createPinia } from "pinia";

import Dev from "./components/Dev.vue";

// Create App
const app = createApp(Dev);

// Create Pinia Store
const pinia = createPinia();

// Use Pinia Store
app.use(pinia);

// Mount App
app.mount("#dev");
