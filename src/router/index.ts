import { createRouter, createWebHistory } from "vue-router";

import Kanban from "@/views/Kanban.vue";
import Board from "@/views/Board.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "kanban",
      component: Kanban,
    },
    {
      path: "/:boardId",
      name: "board",
      component: Board,
    },
  ],
});

export default router;
