<script setup lang="ts">
import { ref, reactive } from "vue";
import { useConvexMutation } from "convex-vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

import BoardForm from "@/components/BoardForm.vue";
import { api } from "../../convex/_generated/api";
import { useBoardStore } from "@/stores/Board";
import type { Columns } from "@/components/BoardForm.vue";

const isCreatingBoard = ref(false);
const boardForm = reactive({
  name: "",
  columns: [
    {
      id: "new",
      name: "",
    },
  ] as Columns[],
});
const boardStore = useBoardStore();
const { closeBoardModal, setBoard } = boardStore;

const toast = useToast();
const router = useRouter();

const createBoardMutation = useConvexMutation(api.functions.boards.createBoard);
const createBoard = async () => {
  isCreatingBoard.value = true;
  try {
    const newBoard = await createBoardMutation.mutate({
      board: {
        name: boardForm.name,
        columns: boardForm.columns.map((col) => ({ name: col.name })),
        user: "default_user",
      },
    });
    closeBoardModal();
    toast.success("Board created successfully!");
    setBoard(newBoard);
    router.push({ name: "board", params: { boardId: newBoard!._id } });
  } catch (error) {
    console.error("Error creating board:", error);
    toast.error("Failed to create board. Please try again.");
  } finally {
    isCreatingBoard.value = false;
  }
};
</script>

<template>
  <BoardForm
    :isExecuting="isCreatingBoard"
    :boardForm="boardForm"
    :boardAction="'create'"
    @createBoard="createBoard"
  />
</template>
