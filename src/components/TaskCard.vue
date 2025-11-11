<script setup lang="ts">
import { computed } from "vue";

import { useTaskModalStore, type Task } from "@/stores/Task";

const props = defineProps<{
  task: Task;
}>();

const taskModalStore = useTaskModalStore();
const { showTaskModal } = taskModalStore;

const taskCompleted = computed(
  () => props.task.subtasks.filter((subtask) => subtask.isCompleted).length ?? 0,
);
const totalTasks = computed(() => props.task.subtasks.length ?? 0);
</script>

<template>
  <div
    class="w-full bg-(--cst-bg2) flex flex-col font-bold p-4 rounded-md cursor-pointer gap-2"
    @click="showTaskModal('view', task)"
  >
    <p class="text-[15px]">{{ task?.title }}</p>
    <p class="text-[12px] text-(--cst-foreground)">
      {{ taskCompleted }} of {{ totalTasks }} subtasks
    </p>
  </div>
</template>
