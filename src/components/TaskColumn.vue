<script setup lang="ts">
import { useConvexQuery } from "convex-vue";
import { computed } from "vue";

import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import TaskCard from "@/components/TaskCard.vue";

const props = defineProps<{
  columnId: Id<"columns">;
}>();

const columnId = computed(() => props.columnId);

const { data: tasks, isPending } = useConvexQuery(api.functions.boards.getTasks, () => ({
  columnId: columnId.value,
}));
</script>

<template>
  <div class="h-full min-w-[280px] max-w-[280px] flex flex-col gap-6 overflow-auto scrollbar-hide">
    <TaskCard v-for="(task, index) in tasks" :key="index" :task="task" />
  </div>
</template>
