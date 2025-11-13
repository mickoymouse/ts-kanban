<script setup lang="ts">
import { watch, computed } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";
import { useConvexQuery } from "convex-vue";

import { api } from "../../convex/_generated/api";
import { useBoardStore } from "@/stores/Board";
import LogoLight from "@/icons/logo-light.svg";
import LogoDark from "@/icons/logo-dark.svg";
import ListIcon from "@/icons/icon-board.svg";
import HideIcon from "@/icons/icon-hide-sidebar.svg";
import LightIcon from "@/icons/icon-light-theme.svg";
import DarkIcon from "@/icons/icon-dark-theme.svg";
import { useTheme } from "@/composables/Theme.js";
import Switch from "@/components/ui/Switch.vue";

const boardStore = useBoardStore();
const { isDarkMode, toggleTheme } = useTheme();
const router = useRouter();
const route = useRoute();
const user: string = "default_user";
const { data: boards, isPending } = useConvexQuery(api.functions.boards.getBoards, { user });
const boardsCount = computed(() => (boards.value ? boards.value.length : 0));
const currentBoardId = computed(() => route.params.boardId as string);

watch(
  isPending,
  (pending) => {
    boardStore.setLoading(pending);
    if (!pending) {
      if (!boards.value || boards.value.length === 0) {
        router.replace({ name: "kanban" });
        boardStore.setBoard(null);
      } else if (boards.value[0]) {
        const firstBoard = boards.value[0];
        boardStore.setBoard(firstBoard);
        router.replace({ name: "board", params: { boardId: firstBoard._id } });
      }
    }
  },
  { immediate: true },
);
</script>

<template>
  <aside
    class="min-w-[300px] max-w-[300px] bg-(--cst-bg2) border border-(--cst-lines) text-[15px] text-(--cst-foreground) font-bold select-none"
  >
    <div class="h-24 flex items-center px-6">
      <LogoDark v-if="!isDarkMode" />
      <LogoLight v-else />
    </div>
    <div v-if="isPending" class="h-[calc(100vh-96px)] flex flex-col justify-between">
      <div class="flex flex-col pr-6 gap-4">
        <!-- Skeleton for "All Boards" heading -->
        <div class="px-6">
          <div class="h-3 w-24 bg-(--cst-lines) animate-pulse rounded"></div>
        </div>
        <!-- Skeleton for board items -->
        <div v-for="n in 6" :key="n" class="px-6">
          <div class="h-10 bg-(--cst-bg) animate-pulse rounded-r-full flex items-center gap-2 px-2">
            <div class="w-4 h-4 bg-(--cst-lines) rounded"></div>
            <div class="h-3 bg-(--cst-lines) rounded flex-1"></div>
          </div>
        </div>
        <!-- Skeleton for "Create New Board" -->
        <div class="px-6">
          <div class="h-10 bg-(--cst-lines) animate-pulse rounded flex items-center gap-2 px-2">
            <div class="w-4 h-4 bg-(--cst-bg) rounded"></div>
            <div class="h-3 bg-(--cst-bg) rounded w-32"></div>
          </div>
        </div>
      </div>
      <!-- Skeleton for bottom section -->
      <div class="pb-12 px-6 flex flex-col gap-4">
        <!-- Skeleton for theme toggle -->
        <div class="flex gap-4 w-full items-center justify-center bg-(--cst-bg) py-4 rounded-md">
          <div class="w-4 h-4 bg-(--cst-lines) animate-pulse rounded"></div>
          <div class="w-12 h-6 bg-(--cst-lines) animate-pulse rounded-full"></div>
          <div class="w-4 h-4 bg-(--cst-lines) animate-pulse rounded"></div>
        </div>
        <!-- Skeleton for hide sidebar -->
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-(--cst-lines) animate-pulse rounded"></div>
          <div class="h-3 w-20 bg-(--cst-lines) animate-pulse rounded"></div>
        </div>
      </div>
    </div>
    <div v-else class="h-[calc(100vh-96px)] flex flex-col justify-between">
      <div class="flex flex-col pr-6 gap-4">
        <p class="px-6 text-[12px]">All Boards ( {{ boardsCount }} )</p>
        <ul class="flex flex-col gap-4">
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
            <span>{{ board.name }}</span>
          </RouterLink>
        </ul>
        <p class="flex items-center gap-2 px-6 text-(--cst-primary) cursor-pointer">
          <ListIcon />
          <span>+ Create New Board</span>
        </p>
      </div>
      <div class="pb-12 px-6 flex flex-col gap-4">
        <div class="flex gap-4 w-full items-center justify-center bg-(--cst-bg) py-4 rounded-md">
          <LightIcon />
          <Switch :state="isDarkMode" @update:state="toggleTheme" />
          <DarkIcon />
        </div>
        <p class="cursor-pointer flex items-center gap-2"><HideIcon />Hide Sidebar</p>
      </div>
    </div>
  </aside>
</template>
