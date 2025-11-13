<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, reactive, ref } from "vue";
import { useConvexMutation } from "convex-vue";
import { useToast } from "vue-toastification";

import { useBoardStore } from "@/stores/Board";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useTaskModalStore } from "@/stores/Task";
import TaskForm from "@/components/TaskForm.vue";
import type { Subtask } from "@/components/TaskForm.vue";

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

const taskForm = reactive({
  title: "",
  description: "" as string | undefined,
  subtasks: [{ id: "new", title: "", isCompleted: false }] as Subtask[],
  status: (columnNames.value[0] as string) || null,
});

const isCreatingTask = ref(false);

const createTask = useConvexMutation(api.functions.tasks.createTask);

const createTaskHandler = async () => {
  isCreatingTask.value = true;
  try {
    await createTask.mutate({
      task: {
        title: taskForm.title,
        description: taskForm.description,
        boardId: board.value?._id as Id<"boards">,
        columnId: columnNameToIdMap.value[taskForm.status as string] as Id<"columns">,
        subtasks: taskForm.subtasks.map((subtask) => ({
          title: subtask.title,
          isCompleted: false,
        })),
      },
    });
    toast.success("Task created successfully!");
    closeTaskModal();
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error("Failed to create task. Please try again.");
  } finally {
    isCreatingTask.value = false;
  }
};
</script>

<template>
  <TaskForm
    :isExecuting="isCreatingTask"
    :taskForm="taskForm"
    :columnNames="columnNames"
    taskAction="create"
    @createTask="createTaskHandler"
  />
</template>
