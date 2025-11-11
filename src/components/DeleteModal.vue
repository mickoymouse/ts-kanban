<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useConvexMutation } from "convex-vue";
import { useToast } from "vue-toastification";
import { LoaderCircle } from "lucide-vue-next";

import Modal from "@/components/ui/Modal.vue";
import { useTaskModalStore } from "@/stores/Task";
import { api } from "../../convex/_generated/api";

const toast = useToast();
const taskModalStore = useTaskModalStore();
const { showDelete, taskToDelete } = storeToRefs(taskModalStore);
const { closeDeleteModal, showTaskModal } = taskModalStore;
const isDeletingTask = ref(false);

const deleteTaskMutation = useConvexMutation(api.functions.tasks.deleteTask);

const deleteTask = async () => {
  isDeletingTask.value = true;
  try {
    await deleteTaskMutation.mutate({ taskId: taskToDelete.value!._id });
    closeDeleteModal();
    toast.success("Task deleted successfully!");
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("Failed to delete task. Please try again.");
  } finally {
    isDeletingTask.value = false;
  }
};

const cancelDelete = () => {
  closeDeleteModal(false);
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
          class="flex items-center justify-center gap-2 bg-(--cst-destructive) text-white flex-1 rounded-full p-2 cursor-pointer hover:bg-(--cst-destructive-hover) transition-colors disabled:cursor-not-allowed disabled:hover:bg-(--cst-destructive-hover)"
          @click="deleteTask"
          :disabled="isDeletingTask"
        >
          {{ isDeletingTask ? "Deleting task" : "Delete" }}
          <LoaderCircle v-if="isDeletingTask" class="mr-3 size-5 animate-spin text-white" />
        </button>
        <button
          class="bg-(--cst-primary)/10 text-(--cst-primary) flex-1 rounded-full p-2 cursor-pointer hover:bg-(--cst-primary) hover:text-white transition-colors disabled:cursor-not-allowed disabled:hover:bg-(--cst-primary)/10 disabled:text-(--cst-primary)"
          @click="cancelDelete"
          :disabled="isDeletingTask"
        >
          Cancel
        </button>
      </div>
    </div>
  </Modal>
</template>
