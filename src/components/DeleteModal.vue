<script setup lang="ts">
import { storeToRefs } from "pinia";

import Modal from "@/components/ui/Modal.vue";
import { useTaskModalStore } from "@/stores/Task";

const taskModalStore = useTaskModalStore();
const { showDelete, taskToDelete } = storeToRefs(taskModalStore);
const { closeDeleteModal, showTaskModal } = taskModalStore;

const deleteTask = () => {
  // Implement the delete task logic here
  closeDeleteModal();
};

const cancelDelete = () => {
  closeDeleteModal();
  showTaskModal("view", taskToDelete.value!);
};
</script>

<template>
  <Modal :show="showDelete" @closeModal="closeDeleteModal">
    <div
      class="flex flex-col bg-(--cst-bg2) p-6 rounded-md w-[480px] max-h-[75vh] overflow-auto gap-4 font-bold"
    >
      <h2 class="text-(--cst-destructive) text-[18px]">Delete this task?</h2>
      <p class="font-medium text-[13px] text-(--cst-foreground)">
        Are you sure you want to delete the '{{ taskToDelete?.title }}' task and its subtasks? This
        action cannot be reversed.
      </p>
      <div class="flex items-center justify-between text-[13px] gap-4">
        <button
          class="bg-(--cst-destructive) text-white flex-1 rounded-full p-2 cursor-pointer hover:bg-(--cst-destructive-hover) transition-colors disabled:cursor-not-allowed disabled:hover:bg-(--cst-destructive-hover)"
          @click="deleteTask"
        >
          Delete
        </button>
        <button
          class="bg-(--cst-primary)/10 text-(--cst-primary) flex-1 rounded-full p-2 cursor-pointer hover:bg-(--cst-primary) hover:text-white transition-colors disabled:cursor-not-allowed disabled:hover:bg-(--cst-primary)/10 disabled:text-(--cst-primary)"
          @click="cancelDelete"
        >
          Cancel
        </button>
      </div>
    </div>
  </Modal>
</template>
