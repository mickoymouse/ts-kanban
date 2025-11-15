<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, watch, ref, onMounted, nextTick } from "vue";
import { storeToRefs } from "pinia";

import { useBoardStore } from "@/stores/Board";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import TaskColumn from "@/components/TaskColumn.vue";
import TaskModal from "@/components/TaskModal.vue";
import DeleteTaskModal from "@/components/DeleteTaskModal.vue";
import { useTaskModalStore } from "@/stores/Task";
import NumberFlow from "@/components/ui/NumberFlow.vue";
import { useConvexQuery } from "convex-vue";

const boardStore = useBoardStore();
const { setColumns, openBoardModal, setBoardComponentMounted } = boardStore;

const taskModalStore = useTaskModalStore();
const { show, showDelete } = storeToRefs(taskModalStore);
const route = useRoute();
const boardId = computed(() => route.params.boardId as Id<"boards">);

const { data: columns, isPending } = useConvexQuery(api.functions.columns.getColumns, () => ({
  boardId: boardId.value,
}));

const isInitialLoad = ref(true);

const taskCounts = ref<Record<string, number>>({});
const updateTaskCount = (columnId: string, count: number) => {
  taskCounts.value[columnId] = count;
};

const editBoard = () => {
  openBoardModal("edit");
};

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
  columns,
  (newColumns) => {
    if (newColumns) {
      setColumns(newColumns);
    }
  },
  { immediate: true },
);

onMounted(async () => {
  await nextTick();
  setBoardComponentMounted(true);
});
</script>
<template>
  <div id="board" class="flex flex-col h-full w-full select-none relative">
    <div
      v-if="isPending && isInitialLoad"
      class="w-full flex-1 flex gap-4 pl-4 pt-4 overflow-auto scrollbar-hide"
    >
      <div v-for="i in 3" :key="i" class="flex flex-col gap-4">
        <!-- Column header skeleton -->
        <div class="h-4 bg-(--cst-bg2) rounded animate-pulse w-32"></div>
        <!-- Column content skeleton -->
        <div
          class="h-full min-w-[280px] max-w-[280px] flex flex-col gap-6 overflow-auto scrollbar-hide"
        >
          <div class="space-y-4">
            <div v-for="n in 3" :key="n" class="bg-(--cst-bg2) rounded-lg p-4 animate-pulse">
              <div class="h-4 bg-(--cst-lines) rounded mb-2"></div>
              <div class="h-3 bg-(--cst-lines) rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-(--cst-lines) rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="!columns || columns.length == 0"
      class="flex-1 flex flex-col items-center justify-center gap-4 font-bold text-center mx-8"
    >
      <p class="text-[18px] text-(--cst-foreground)">
        This board is empty. Create a new column to get started.
      </p>
      <button
        class="text-[15px] bg-(--cst-primary) px-4 py-2 rounded-full text-white cursor-pointer"
        @click="editBoard"
      >
        + Add New Column
      </button>
    </div>
    <div v-else class="w-full flex-1 flex gap-4 px-4 py-4 overflow-auto scrollbar-hide">
      <div v-for="column in columns" class="flex flex-col gap-4" :key="column._id">
        <p class="font-bold text-[12px] tracking-[2.4px] text-(--cst-foreground)">
          <span>{{ column.name.toUpperCase() }}</span>
          (<NumberFlow
            :class="'font-bold text-[12px] tracking-[2.4px] text-(--cst-foreground)'"
            :number="taskCounts[column._id] || 0"
          />)
        </p>
        <TaskColumn
          :column-id="column._id"
          @updateTaskCount="(count) => updateTaskCount(column._id, count)"
        />
      </div>
    </div>
  </div>
  <TaskModal v-if="show" />
  <DeleteTaskModal v-else-if="showDelete" />
</template>
