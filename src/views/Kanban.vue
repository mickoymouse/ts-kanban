<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useBoardStore } from "@/stores/Board";

const boardStore = useBoardStore();
const { isLoading } = storeToRefs(boardStore);
const { openBoardModal } = boardStore;
</script>
<template>
  <div class="flex flex-col h-full w-full">
    <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center gap-4 font-bold">
      <!-- Skeleton for text -->
      <div class="h-6 bg-gray-300 rounded animate-pulse w-80"></div>
      <!-- Skeleton for button -->
      <div class="h-10 bg-gray-300 rounded-full animate-pulse w-36"></div>
    </div>
    <div v-else class="flex-1 flex flex-col items-center justify-center gap-4 font-bold">
      <p class="text-[18px] text-(--cst-foreground)">
        Your kanban is empty. Create a new board to get started.
      </p>
      <button
        class="text-[15px] bg-(--cst-primary) px-4 py-2 rounded-full text-white cursor-pointer"
        @click="openBoardModal('create')"
      >
        + Add New Board
      </button>
    </div>
  </div>
</template>
