<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useConvexMutation } from "convex-vue";
import { useToast } from "vue-toastification";
import { LoaderCircle } from "lucide-vue-next";

import Modal from "@/components/ui/Modal.vue";
import { api } from "../../convex/_generated/api";
import { useBoardStore } from "@/stores/Board";
import type { Id } from "../../convex/_generated/dataModel";

const toast = useToast();
const boardStore = useBoardStore();
const { showDeleteModal, board } = storeToRefs(boardStore);
const { closeDeleteModal, refreshBoardHandler } = boardStore;
const isDeletingBoard = ref(false);

const deleteBoardMutation = useConvexMutation(api.functions.boards.deleteBoard);

const deleteBoard = async () => {
  isDeletingBoard.value = true;
  try {
    await deleteBoardMutation.mutate({ boardId: board.value!._id as Id<"boards"> });
    refreshBoardHandler();
    closeDeleteModal(true);
    toast.success("Board deleted successfully!");
  } catch (error) {
    console.error("Error deleting board:", error);
    toast.error("Failed to delete board. Please try again.");
  } finally {
    isDeletingBoard.value = false;
  }
};

const cancelDelete = () => {
  closeDeleteModal();
};
</script>

<template>
  <Modal :show="showDeleteModal" @closeModal="closeDeleteModal">
    <div
      class="flex flex-col bg-(--cst-bg2) p-6 rounded-md w-[480px] max-h-[75vh] overflow-auto gap-4 font-bold"
    >
      <h2 class="text-(--cst-destructive) text-[18px]">Delete this board?</h2>
      <p class="font-medium text-[13px] text-(--cst-foreground)">
        Are you sure you want to delete the '{{ board?.name }}' board? This action will remove all
        columns and tasks and cannot be reversed.
      </p>
      <div class="flex items-center justify-between text-[13px] gap-4">
        <button
          class="flex items-center justify-center gap-2 bg-(--cst-destructive) text-white flex-1 rounded-full p-2 cursor-pointer hover:bg-(--cst-destructive-hover) transition-colors disabled:cursor-not-allowed disabled:hover:bg-(--cst-destructive-hover)"
          @click="deleteBoard"
          :disabled="isDeletingBoard"
        >
          {{ isDeletingBoard ? "Deleting board" : "Delete" }}
          <LoaderCircle v-if="isDeletingBoard" class="mr-3 size-5 animate-spin text-white" />
        </button>
        <button
          class="bg-(--cst-primary)/10 text-(--cst-primary) flex-1 rounded-full p-2 cursor-pointer hover:bg-(--cst-primary) hover:text-white transition-colors disabled:cursor-not-allowed disabled:hover:bg-(--cst-primary)/10 disabled:text-(--cst-primary)"
          @click="cancelDelete"
          :disabled="isDeletingBoard"
        >
          Cancel
        </button>
      </div>
    </div>
  </Modal>
</template>
