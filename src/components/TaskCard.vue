<script setup lang="ts">
import { computed, ref } from "vue";

import type { Id } from "../../convex/_generated/dataModel";

const props = defineProps<{
  task: {
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
}>();

const taskCompleted = computed(
  () => props.task.subtasks.filter((subtask) => subtask.isCompleted).length ?? 0,
);
const totalTasks = computed(() => props.task.subtasks.length ?? 0);

const emit = defineEmits<{
  openTaskModal: [task: typeof props.task];
}>();
</script>

<template>
  <div
    class="w-full bg-(--cst-bg2) flex flex-col font-bold p-4 rounded-md cursor-pointer gap-2"
    @click="emit('openTaskModal', task)"
  >
    <p class="text-[15px]">{{ task?.title }}</p>
    <p class="text-[12px] text-(--cst-foreground)">
      {{ taskCompleted }} of {{ totalTasks }} subtasks
    </p>
  </div>
</template>
