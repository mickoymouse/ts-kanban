<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, ref, type Ref } from "vue";

import { useBoardStore } from "@/stores/Board";
import OptionsButton from "@/icons/icon-vertical-ellipsis.svg";
import { useTaskModalStore } from "@/stores/Task";
import DeleteBoardModal from "@/components/DeleteBoardModal.vue";
import { useTheme } from "@/composables/Theme";
import LogoLight from "@/icons/logo-light.svg";
import LogoDark from "@/icons/logo-dark.svg";
import { useSidebarStore } from "@/stores/Sidebar";

const { isDarkMode } = useTheme();
const sidebarStore = useSidebarStore();
const { showSidebar } = storeToRefs(sidebarStore);

const boardStore = useBoardStore();
const { openBoardModal, openDeleteModal } = boardStore;
const { board, isLoading, showDeleteModal } = storeToRefs(boardStore);

const taskModalStore = useTaskModalStore();
const { showTaskModal } = taskModalStore;

const showBoardOptions = ref(false);
const closeBoardOptions = () => {
  showBoardOptions.value = false;
};
const openBoardOptions = () => {
  if (isLoading.value || board.value == null) return;
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
const deleteBoard = () => {
  closeBoardOptions();
  openDeleteModal();
};

onMounted(() => {
  document.addEventListener("click", boardOptionsClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", boardOptionsClickOutside);
});
</script>

<style scoped>
.fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  transition: opacity 0.3s ease-out;
  position: absolute;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}

.fade-enter-active {
  transition: opacity 0.3s ease-in;
}
</style>

<template>
  <header class="h-24 w-full bg-(--cst-bg2) select-none flex">
    <Transition name="fade">
      <div
        class="h-24 flex items-center border-b border-(--cst-lines) transition-all duration-500 ease-in-out"
        :class="showSidebar ? 'w-0 px-0 overflow-hidden' : 'w-[210px] px-6'"
      >
        <LogoDark v-if="!isDarkMode" />
        <LogoLight v-else />
      </div>
    </Transition>

    <div class="h-24 w-full items-center flex justify-between px-8 border border-(--cst-lines)">
      <div>
        <!-- skeleton for board name -->
        <div v-if="isLoading" class="h-8 bg-gray-300 rounded animate-pulse w-48"></div>
        <h1 v-else class="text-[24px] font-bold">{{ board?.name }}</h1>
      </div>
      <!-- skeleton for add task button and option -->
      <div v-if="isLoading" class="flex items-center gap-4">
        <div class="h-10 bg-gray-300 rounded-full animate-pulse w-[164px]"></div>
        <div class="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
      </div>
      <div v-else class="flex items-center gap-4 relative">
        <button
          class="bg-(--cst-primary) h-10 w-[164px] rounded-full disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer hover:bg-(--cst-primary-hover) transition-colors"
          :disabled="isLoading || board == null || board.columns.length === 0"
          @click="showTaskModal('create')"
        >
          + Add New Task
        </button>
        <OptionsButton
          :class="[
            { 'opacity-30 cursor-not-allowed': isLoading || board == null },
            { 'cursor-pointer hover:opacity-80': !isLoading && board != null },
          ]"
          @click="openBoardOptions"
        />
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
    </div>
  </header>

  <DeleteBoardModal v-if="showDeleteModal" />
</template>
