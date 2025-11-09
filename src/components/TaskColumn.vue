<script setup lang="ts">
import { computed, ref } from "vue";

import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import TaskCard from "@/components/TaskCard.vue";
import TaskModal from "@/components/TaskModal.vue";
import { useLocalConvexQuery } from "@/composables/convex/useConvexQuery";

const props = defineProps<{
  columnId: Id<"columns">;
}>();

const columnId = computed(() => props.columnId);

const { data: tasks, isPending } = useLocalConvexQuery(api.functions.boards.getTasks, () => ({
  columnId: columnId.value,
}));

// Modal state
const selectedTask = ref(null);
const showTaskModal = ref(false);

const openTaskModal = (task: any) => {
  selectedTask.value = task;
  showTaskModal.value = true;
};

const closeTaskModal = () => {
  selectedTask.value = null;
  showTaskModal.value = false;
};
</script>

<template>
  <div class="h-full min-w-[280px] max-w-[280px] flex flex-col gap-6 overflow-auto scrollbar-hide">
    <!-- Skeleton loading state -->
    <div v-if="isPending" class="space-y-4">
      <div v-for="n in 3" :key="n" class="bg-gray-200 rounded-lg p-4 animate-pulse">
        <div class="h-4 bg-gray-300 rounded mb-2"></div>
        <div class="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
    <TaskCard
      v-else
      v-for="task in tasks"
      :key="task._id"
      :task="task"
      @openTaskModal="openTaskModal"
    />

    <TaskModal
      v-if="selectedTask"
      :show="showTaskModal"
      :task="selectedTask"
      @closeTaskModal="closeTaskModal"
    />
  </div>
</template>
