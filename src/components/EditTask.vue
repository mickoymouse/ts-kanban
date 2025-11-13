<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, reactive, ref } from "vue";
import { useConvexMutation } from "convex-vue";
import { useToast } from "vue-toastification";

import { useBoardStore } from "@/stores/Board";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useTaskModalStore, type Task } from "@/stores/Task";
import TaskForm from "@/components/TaskForm.vue";

const toast = useToast();
const boardStore = useBoardStore();
const { board } = storeToRefs(boardStore);
const taskModalStore = useTaskModalStore();
const { closeTaskModal } = taskModalStore;

const columnNames = computed(() => board.value?.columns?.map((column) => column.name) || []);
const columnNameToIdMap = computed(() => {
  const map: Record<string, Id<"columns">> = {};
  board.value?.columns?.forEach((column) => {
    map[column.name] = column._id as Id<"columns">;
  });
  return map;
});

const props = defineProps<{
  task: Task;
}>();

const taskForm = reactive({
  title: props.task.title,
  description: props.task.description || undefined,
  subtasks: props.task.subtasks.map((subtask) => {
    const s = {
      id: subtask._id,
      title: subtask.title,
      isCompleted: subtask.isCompleted,
    };

    return s;
  }),
  status: props.task.column,
});

const isUpdatingTask = ref(false);

const updateTask = useConvexMutation(api.functions.tasks.updateTask);

const updateTaskHandler = async () => {
  isUpdatingTask.value = true;
  try {
    await updateTask.mutate({
      taskId: props.task._id as Id<"tasks">,
      task: {
        title: taskForm.title,
        description: taskForm.description,
        boardId: board.value?._id as Id<"boards">,
        columnId: columnNameToIdMap.value[taskForm.status as string] as Id<"columns">,
        subtasks: taskForm.subtasks.map((subtask) => ({
          _id: subtask.id,
          title: subtask.title,
          isCompleted: false,
        })),
      },
    });
    toast.success("Task updated successfully!");
    closeTaskModal();
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task. Please try again.");
  } finally {
    isUpdatingTask.value = false;
  }
};
</script>

<template>
  <TaskForm
    :isExecuting="isUpdatingTask"
    :taskForm="taskForm"
    :columnNames="columnNames"
    taskAction="edit"
    @updateTask="updateTaskHandler"
  />
</template>
