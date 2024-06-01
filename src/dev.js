import { createApp } from "vue";
import { createPinia } from "pinia";

//Icons
import "ionicons-npm/css/ionicons.css";
import "font-awesome/css/font-awesome.css";

import "@/assets/css/index.css";

import Dev from "@/components/Dev.vue";

// Create App
const app = createApp(Dev);

// Create Pinia Store
const pinia = createPinia();

// Use Pinia Store
app.use(pinia);

// Mount App
app.mount("#dev");
