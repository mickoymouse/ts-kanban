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
  const isLoading = ref(false);

  const setBoard = (boardData: Board | null) => {
    board.value = boardData;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setColumns = (newColumns: Array<{ _id: string; name: string }>) => {
    if (board.value) board.value.columns = newColumns;
  };

  return { board, setBoard, isLoading, setLoading, setColumns };
});
