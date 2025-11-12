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
  const showDelete = ref(false);
  const taskAction = ref<TaskAction>("view");
  const task = ref<Task | null>(null);
  const taskToDelete = ref<Task | null>(null);

  const showTaskModal = (action: TaskAction, taskData: Task | null = null) => {
    taskAction.value = action;
    if (taskData) task.value = taskData;
    show.value = true;
  };

  const closeTaskModal = (reset = true) => {
    show.value = false;
    if (reset) {
      task.value = null;
      taskToDelete.value = null;
    }
  };

  const setTaskAction = (action: TaskAction) => {
    taskAction.value = action;
  };

  const setTaskToDelete = (taskData: Task | null) => {
    taskToDelete.value = taskData;
  };

  const showDeleteModal = () => {
    showDelete.value = true;
  };

  const closeDeleteModal = (reset = true) => {
    showDelete.value = false;
    if (reset) {
      task.value = null;
      taskToDelete.value = null;
    }
  };

  return {
    show,
    taskAction,
    task,
    showTaskModal,
    closeTaskModal,
    taskToDelete,
    setTaskToDelete,
    showDelete,
    showDeleteModal,
    closeDeleteModal,
    setTaskAction,
  };
});
