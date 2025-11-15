import { defineStore } from "pinia";
import { ref } from "vue";
import type { Id } from "../../convex/_generated/dataModel";

export type BoardAction = "create" | "edit";
export type Board = {
  _id: Id<"boards">;
  name: string;
  columns: Array<{
    _id: Id<"columns">;
    name: string;
  }>;
};

export const useBoardStore = defineStore("board", () => {
  const boardComponentMounted = ref(false);
  const board = ref<Board | null>(null);
  const boardAction = ref<BoardAction | null>(null);
  const isLoading = ref(false);
  const showModal = ref(false);
  const showDeleteModal = ref(false);
  const currentBoard = ref<Board | null>(null);
  const refreshBoard = ref(0);

  const setBoardComponentMounted = (mounted: boolean) => {
    boardComponentMounted.value = mounted;
  };

  const setBoard = (boardData: Board | null) => {
    board.value = boardData;
    currentBoard.value = boardData;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setColumns = (newColumns: Array<{ _id: Id<"columns">; name: string }>) => {
    if (board.value) board.value.columns = newColumns;
  };

  const openBoardModal = (action: BoardAction) => {
    boardAction.value = action;
    showModal.value = true;
  };

  const closeBoardModal = () => {
    showModal.value = false;
  };

  const openDeleteModal = () => {
    showDeleteModal.value = true;
  };

  const closeDeleteModal = (reset = true) => {
    showDeleteModal.value = false;
    if (reset) {
      board.value = null;
      currentBoard.value = null;
      boardAction.value = null;
    }
  };

  const refreshBoardHandler = () => {
    refreshBoard.value += 1;
  };

  const setCurrentBoard = (boardData: Board | null) => {
    currentBoard.value = boardData;
  };

  return {
    board,
    boardAction,
    showModal,
    showDeleteModal,
    setBoard,
    isLoading,
    setLoading,
    setColumns,
    closeBoardModal,
    openBoardModal,
    closeDeleteModal,
    openDeleteModal,
    currentBoard,
    setCurrentBoard,
    refreshBoard,
    refreshBoardHandler,
    boardComponentMounted,
    setBoardComponentMounted,
  };
});
