import { createApp } from "vue";
import { convexVue } from "convex-vue";
import { createPinia } from "pinia";
import Toast, { POSITION, type PluginOptions, TYPE } from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
const app = createApp(App);
app.use(convexVue, { url: import.meta.env.VITE_CONVEX_URL });

app.use(router);
app.use(pinia);

const toastOptions: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
  maxToasts: 3,
  toastDefaults: {
    // Here we define per-type defaults
    success: {
      toastClassName: "bg-success-toast",
    },
    error: {
      bodyClassName: "font-sans text-sm",
    },
  },
  closeButton: false,
};

app.use(Toast, toastOptions);

app.mount("#app");
