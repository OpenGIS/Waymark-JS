import { createApp } from "vue";
import { createPinia } from "pinia";

//Icons
import "ionicons-npm/css/ionicons.css";
import "font-awesome/css/font-awesome.css";

import "@/assets/css/index.css";

import App from "@/components/App.vue";

// Get App Element
const appElement = document.getElementById("app");

// Get App Data
const appData = appElement.dataset;

console.log(appData);

// Pass props to App
const app = createApp(App, appData);

// Create Pinia Store
const pinia = createPinia();

// Use Pinia Store
app.use(pinia);

// Mount App
app.mount("#app");
