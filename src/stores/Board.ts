import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export type BoardAction = "create" | "edit";
export type Board = {
  _id: string;
  name: string;
  columns:
    | Array<{
        _id: string;
        name: string;
      }>
    | undefined;
};

export const useBoardStore = defineStore("board", () => {
  const board = ref<Board | null>(null);
  const boardAction = ref<BoardAction | null>(null);
  const isLoading = ref(false);
  const showModal = ref(false);
  const showDeleteModal = ref(false);

  const setBoard = (boardData: Board | null) => {
    board.value = boardData;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setColumns = (newColumns: Array<{ _id: string; name: string }>) => {
    if (board.value) board.value.columns = newColumns;
  };

  const openBoardModal = (action: BoardAction) => {
    boardAction.value = action;
    showModal.value = true;
  };

  const closeBoardModal = () => {
    showModal.value = false;
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
  };
});
