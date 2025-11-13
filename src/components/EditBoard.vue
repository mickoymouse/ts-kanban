<script setup lang="ts">
import { ref, reactive } from "vue";
import { useConvexMutation } from "convex-vue";
import { useToast } from "vue-toastification";

import BoardForm from "@/components/BoardForm.vue";
import { api } from "../../convex/_generated/api";
import { useBoardStore, type Board } from "@/stores/Board";
import type { Id } from "../../convex/_generated/dataModel";

const props = defineProps<{
  board: Board;
}>();
const isCreatingBoard = ref(false);
const boardForm = reactive({
  name: props.board.name,
  columns: props.board.columns?.map((col) => {
    const c = {
      id: col._id as string,
      name: col.name,
    };
    return c;
  }),
});
const boardStore = useBoardStore();
const { closeBoardModal } = boardStore;

const toast = useToast();

const updateBoard = useConvexMutation(api.functions.boards.updateBoard);
const updateBoardHandler = async () => {
  isCreatingBoard.value = true;
  try {
    await updateBoard.mutate({
      boardId: props.board._id as Id<"boards">,
      board: {
        name: boardForm.name,
        user: "default_user",
        columns: boardForm.columns.map((col) => ({ _id: col.id as Id<"columns">, name: col.name })),
      },
    });
    closeBoardModal();
    toast.success("Board updated successfully!");
  } catch (error) {
    console.error("Error updating board:", error);
    toast.error("Failed to update board. Please try again.");
  } finally {
    isCreatingBoard.value = false;
  }
};
</script>

<template>
  <BoardForm
    :isExecuting="isCreatingBoard"
    :boardForm="boardForm"
    :boardAction="'edit'"
    @updateBoard="updateBoardHandler"
  />
</template>
