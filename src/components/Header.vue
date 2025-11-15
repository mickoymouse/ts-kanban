<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref, type Ref } from "vue";
import { useRoute } from "vue-router";
import { useConvexQuery } from "convex-vue";

// stores
import { useBoardStore } from "@/stores/Board";
import { useSidebarStore } from "@/stores/Sidebar";
import { useTaskModalStore } from "@/stores/Task";

// composables
import { useTheme } from "@/composables/Theme";

// modals
import DeleteBoardModal from "@/components/DeleteBoardModal.vue";

// icons
import OptionsButton from "@/icons/icon-vertical-ellipsis.svg";
import LogoLight from "@/icons/logo-light.svg";
import LogoDark from "@/icons/logo-dark.svg";
import LogoMobile from "@/icons/logo-mobile.svg";
import AddTaskIcon from "@/icons/icon-add-task-mobile.svg";
import ListIcon from "@/icons/icon-board.svg";
import LightIcon from "@/icons/icon-light-theme.svg";
import DarkIcon from "@/icons/icon-dark-theme.svg";
import Modal from "@/components/ui/Modal.vue";
import Switch from "@/components/ui/Switch.vue";
import ArrowDownIcon from "@/icons/icon-chevron-down.svg";
import ArrowUpIcon from "@/icons/icon-chevron-up.svg";

import { api } from "../../convex/_generated/api";

const sidebarStore = useSidebarStore();
const { toggleSidebar } = sidebarStore;
const { showSidebar, isMobile } = storeToRefs(sidebarStore);
const boardStore = useBoardStore();
const { openBoardModal, openDeleteModal } = boardStore;
const { board, isLoading, showDeleteModal, boardComponentMounted } = storeToRefs(boardStore);
const taskModalStore = useTaskModalStore();
const { showTaskModal } = taskModalStore;

const route = useRoute();
const { isDarkMode, toggleTheme } = useTheme();

const user: string = "default_user";
const { data: boards } = useConvexQuery(api.functions.boards.getBoards, { user });
const boardsCount = computed(() => (boards.value ? boards.value.length : 0));
const boardOptionsRef: Ref<HTMLElement | null> = ref(null);
const showBoardOptions = ref(false);

const currentBoardId = computed(() => route.params.boardId as string);
const closeBoardOptions = () => {
  showBoardOptions.value = false;
};
const openBoardOptions = () => {
  if (isLoading.value || board.value == null) return;
  showBoardOptions.value = true;
};

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
        class="hidden md:flex h-24 items-center border-b border-(--cst-lines) transition-all duration-500 ease-in-out"
        :class="showSidebar ? 'w-0 px-0 overflow-hidden' : 'w-[210px] px-6'"
      >
        <LogoDark v-if="!isDarkMode" />
        <LogoLight v-else />
      </div>
    </Transition>

    <div
      class="h-24 w-full items-center flex justify-between px-4 md:px-8 border border-(--cst-lines)"
    >
      <!-- skeleton for board name -->
      <div v-if="isLoading" class="h-8 bg-(--cst-lines) rounded animate-pulse w-48"></div>
      <div v-else class="flex items-center gap-2">
        <LogoMobile class="md:hidden" />
        <h1 class="hidden md:block text-[24px] font-bold">{{ board?.name }}</h1>
        <button
          class="cursor-pointer md:hidden text-[18px] font-bold flex items-center gap-2"
          @click="toggleSidebar"
        >
          {{ board?.name }}
          <ArrowUpIcon v-if="showSidebar" aria-hidden="true" />
          <ArrowDownIcon v-else aria-hidden="true" />
        </button>
      </div>
      <!-- skeleton for add task button and option -->
      <div v-if="isLoading" class="flex items-center gap-4">
        <div class="h-10 bg-(--cst-lines) rounded-full animate-pulse w-[164px]"></div>
        <div class="w-6 h-6 bg-(--cst-lines) rounded-full animate-pulse"></div>
      </div>
      <div v-else class="flex items-center gap-4 relative">
        <button
          class="h-8 md:h-10 w-12 md:w-[164px] flex items-center justify-center bg-(--cst-primary) rounded-full disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer hover:bg-(--cst-primary-hover) transition-colors"
          :disabled="isLoading || board == null || board.columns.length === 0"
          @click="showTaskModal('create')"
        >
          <p class="hidden md:block">+ Add New Task</p>
          <AddTaskIcon class="flex md:hidden" />
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

    <Modal
      v-if="boardComponentMounted"
      :show="showSidebar && isMobile"
      :class="'items-center justify-center md:hidden'"
      @closeModal="toggleSidebar"
      :teleportPlace="'#board'"
    >
      <div class="bg-(--cst-bg2) text-(--cst-foreground) min-w-[264px] rounded-md font-bold">
        <div class="flex flex-col pr-6 gap-4">
          <p class="px-6 text-[12px] tracking-[2.4px] pt-4">ALL BOARDS ({{ boardsCount }})</p>
          <nav aria-label="Navigation main sidebar">
            <ul class="flex flex-col gap-4 overflow-auto scrollbar-hide max-h-[450px]">
              <RouterLink
                v-for="board in boards"
                :key="board._id"
                :to="{ name: 'board', params: { boardId: board._id } }"
                class="flex items-center gap-2 px-6 py-2 rounded-r-full cursor-pointer"
                :class="{
                  'bg-(--cst-primary) text-white': currentBoardId === board._id,
                  'hover:bg-(--cst-bg)': currentBoardId !== board._id,
                }"
                tag="li"
                @click="boardStore.setBoard(board)"
              >
                <ListIcon />
                <p class="truncate text-[15px]">{{ board.name }}</p>
              </RouterLink>
            </ul>
          </nav>
          <p
            class="flex items-center gap-2 px-6 text-(--cst-primary) cursor-pointer"
            @click="openBoardModal('create')"
          >
            <ListIcon />
            <span>+ Create New Board</span>
          </p>
        </div>
        <div class="p-6">
          <div class="flex gap-4 w-full items-center justify-center bg-(--cst-bg) py-4 rounded-md">
            <LightIcon />
            <Switch :state="isDarkMode" @update:state="toggleTheme" />
            <DarkIcon />
          </div>
        </div>
      </div>
    </Modal>
  </header>

  <DeleteBoardModal v-if="showDeleteModal" />
</template>
