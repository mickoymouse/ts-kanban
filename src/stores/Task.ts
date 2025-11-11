import { defineStore } from "pinia";
import { ref } from "vue";
import type { Id } from "../../convex/_generated/dataModel";

export type TaskAction = "view" | "edit" | "create";
export type Task = {
  _id: Id<"tasks">;
  column: string;
  title: string;
  description?: string;
  subtasks: Array<{
    _id: Id<"subtasks">;
    title: string;
    isCompleted: boolean;
  }>;
};

export const useTaskModalStore = defineStore("taskModal", () => {
  const show = ref(false);
  const taskAction = ref<TaskAction>("view");
  const task = ref<Task | null>(null);

  const showTaskModal = (action: TaskAction, taskData: Task | null = null) => {
    taskAction.value = action;
    task.value = taskData;
    show.value = true;
  };

  const closeTaskModal = () => {
    show.value = false;
    task.value = null;
  };

  return {
    show,
    taskAction,
    task,
    showTaskModal,
    closeTaskModal,
  };
});
