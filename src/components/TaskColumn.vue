<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import TaskCard from "@/components/TaskCard.vue";
import { useConvexQuery } from "convex-vue";

const props = defineProps<{
  columnId: Id<"columns">;
}>();

const columnId = computed(() => props.columnId);

const { data: tasks, isPending } = useConvexQuery(api.functions.tasks.getTasks, () => ({
  columnId: columnId.value,
}));

const isInitialLoad = ref(true);

const emit = defineEmits<{
  updateTaskCount: [count: number];
}>();

watch(
  isPending,
  (newVal) => {
    if (isInitialLoad.value) {
      if (!newVal) {
        isInitialLoad.value = false;
      }
    }
  },
  { immediate: true },
);

watch(
  tasks,
  (newTasks) => {
    if (newTasks) {
      emit("updateTaskCount", newTasks.length);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="h-full min-w-[280px] max-w-[280px] flex flex-col gap-6 overflow-auto scrollbar-hide relative"
  >
    <!-- Skeleton loading state -->
    <div v-if="isPending && isInitialLoad" class="space-y-4">
      <div v-for="n in 3" :key="n" class="bg-(--cst-bg2) rounded-lg p-4 animate-pulse">
        <div class="h-4 bg-(--cst-lines) rounded mb-2"></div>
        <div class="h-3 bg-(--cst-lines) rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-(--cst-lines) rounded w-1/2"></div>
      </div>
    </div>
    <TransitionGroup v-else tag="div" name="task-card-list" class="flex flex-col gap-4" appear>
      <TaskCard v-for="task in tasks" :key="task._id" :task="task" />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.task-card-list-move,
.task-card-list-enter-active,
.task-card-list-leave-active {
  transition: all 0.5s ease;
}

.task-card-list-enter-from,
.task-card-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.task-card-list-leave-active {
  position: absolute;
}
</style>
