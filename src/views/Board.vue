<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";

import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import TaskColumn from "@/components/TaskColumn.vue";
import { useLocalConvexQuery } from "@/composables/convex/useConvexQuery";

const route = useRoute();
const boardId = computed(() => route.params.boardId as Id<"boards">);

const { data: columns, isPending } = useLocalConvexQuery(api.functions.boards.getColumns, () => ({
  boardId: boardId.value,
}));

watch([columns, isPending], () => {
  console.log("Columns:", columns.value);
  console.log("Is Pending:", isPending.value);
});
</script>
<template>
  <div class="flex flex-col h-full w-full">
    <div v-if="isPending" class="w-full flex-1 flex gap-4 pl-4 pt-4 overflow-auto scrollbar-hide">
      <div v-for="i in 3" :key="i" class="flex flex-col gap-4">
        <!-- Column header skeleton -->
        <div class="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
        <!-- Column content skeleton -->
        <!-- Column content skeleton -->
        <div
          class="h-full min-w-[280px] max-w-[280px] flex flex-col gap-6 overflow-auto scrollbar-hide"
        >
          <div class="space-y-4">
            <div v-for="n in 3" :key="n" class="bg-gray-200 rounded-lg p-4 animate-pulse">
              <div class="h-4 bg-gray-300 rounded mb-2"></div>
              <div class="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="!columns || columns.length == 0"
      class="flex-1 flex flex-col items-center justify-center gap-4 font-bold"
    >
      <p class="text-[18px] text-(--cst-foreground)">
        This board is empty. Create a new column to get started.
      </p>
      <button
        class="text-[15px] bg-(--cst-primary) px-4 py-2 rounded-full text-white cursor-pointer"
      >
        + Add New Column
      </button>
    </div>
    <div v-else class="w-full flex-1 flex gap-4 pl-4 pt-4 overflow-auto scrollbar-hide">
      <div v-for="(column, index) in columns" class="flex flex-col gap-4" :key="index">
        <p class="font-bold text-[12px] tracking-[2.4px] text-(--cst-foreground)">
          {{ column.name.toUpperCase() }} ({{ column.tasks.length }})
        </p>
        <TaskColumn :column-id="column._id" />
      </div>
    </div>
  </div>
</template>
