import { createApp } from "vue";
import { convexVue } from "convex-vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
const app = createApp(App);
app.use(convexVue, { url: import.meta.env.VITE_CONVEX_URL });

app.use(router);
app.use(pinia);

app.mount("#app");
