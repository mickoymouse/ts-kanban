import { createRouter, createWebHistory } from "vue-router";

import Kanban from "@/views/Kanban.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Kanban,
    },
  ],
});

export default router;
