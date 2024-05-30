import { createApp } from "vue";
import { createPinia } from "pinia";
import Editor from "./components/Editor.vue";

// import './style.css'
import App from "./App.vue";

// Create App
const app = createApp(App);

//Pinia
const pinia = createPinia();
app.use(pinia);

//Mount
app.mount("#app");

export { Editor };
