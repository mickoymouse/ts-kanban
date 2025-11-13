<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useBoardStore } from "@/stores/Board";
import OptionsButton from "@/icons/icon-vertical-ellipsis.svg";
import { useTaskModalStore } from "@/stores/Task";
import { onMounted, onUnmounted, ref, type Ref } from "vue";

const boardStore = useBoardStore();
const { openBoardModal } = boardStore;
const { board, isLoading } = storeToRefs(boardStore);

const taskModalStore = useTaskModalStore();
const { showTaskModal } = taskModalStore;

const showBoardOptions = ref(false);
const closeBoardOptions = () => {
  showBoardOptions.value = false;
};
const openBoardOptions = () => {
  showBoardOptions.value = true;
};

const boardOptionsRef: Ref<HTMLElement | null> = ref(null);

const boardOptionsClickOutside = (event: MouseEvent) => {
  if (
    boardOptionsRef.value &&
    !boardOptionsRef.value.contains(event.target as Node) &&
    !(event.target as Element).closest("svg")
  ) {
    closeBoardOptions();
  }
};

const editBoard = () => {
  openBoardModal("edit");
  closeBoardOptions();
};
const deleteBoard = () => {};

onMounted(() => {
  document.addEventListener("click", boardOptionsClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", boardOptionsClickOutside);
});
</script>

<template>
  <nav
    class="h-24 w-full bg-(--cst-bg2) flex justify-between items-center px-8 border border-(--cst-lines) select-none"
  >
    <div>
      <!-- skeleton for board name -->
      <div v-if="isLoading" class="h-8 bg-gray-300 rounded animate-pulse w-48"></div>
      <h1 v-else class="text-[24px] font-bold">{{ board?.name }}</h1>
    </div>
    <div class="flex items-center gap-4 relative">
      <button
        class="bg-(--cst-primary) h-10 w-[164px] rounded-full disabled:opacity-30 text-white cursor-pointer hover:bg-(--cst-primary-hover) transition-colors"
        :disabled="isLoading || board == null"
        @click="showTaskModal('create')"
      >
        + Add New Task
      </button>
      <OptionsButton class="cursor-pointer" @click="openBoardOptions" />
      <div
        v-show="showBoardOptions"
        ref="boardOptionsRef"
        class="bg-(--cst-bg2) flex flex-col gap-2 absolute right-0 top-full font-medium text-[13px] rounded-md shadow-md overflow-hidden"
      >
        <button
          class="text-(--cst-foreground) text-[13px] w-full text-left cursor-pointer hover:bg-(--cst-bg) px-4 py-2"
          @click="editBoard"
        >
          Edit Board
        </button>
        <button
          class="text-(--cst-destructive) text-[13px] w-full text-left cursor-pointer hover:bg-(--cst-bg) px-4 py-2"
          @click="deleteBoard"
        >
          Delete Board
        </button>
      </div>
    </div>
  </nav>
</template>
