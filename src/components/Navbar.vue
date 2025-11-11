<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useBoardStore } from "@/stores/Board";
import OptionsButton from "@/icons/icon-vertical-ellipsis.svg";
import { useTaskModalStore } from "@/stores/Task";

const boardStore = useBoardStore();
const { board, isLoading } = storeToRefs(boardStore);

const taskModalStore = useTaskModalStore();
const { showTaskModal } = taskModalStore;
</script>

<template>
  <nav
    class="h-24 w-full bg-(--cst-bg2) flex justify-between items-center px-8 border border-(--cst-lines)"
  >
    <div>
      <!-- skeleton for board name -->
      <div v-if="isLoading" class="h-8 bg-gray-300 rounded animate-pulse w-48"></div>
      <h1 v-else class="text-[24px] font-bold">{{ board }}</h1>
    </div>
    <div class="flex items-center gap-4">
      <button
        class="bg-(--cst-primary) h-10 w-[164px] rounded-full disabled:opacity-30 text-white cursor-pointer hover:bg-(--cst-primary-hover) transition-colors"
        :disabled="isLoading || board == null"
        @click="showTaskModal('create')"
      >
        + Add New Task
      </button>
      <OptionsButton class="cursor-pointer" />
    </div>
  </nav>
</template>
