import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useBoardStore = defineStore("board", () => {
  const board = reactive<{ id: string | null; name: string | null }>({ id: null, name: null });
  const isLoading = ref(false);
  const columns = ref<
    Array<{
      _id: string;
      name: string;
    }>
  >([]);

  const setBoard = (id: string, name: string) => {
    board.id = id;
    board.name = name;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setColumns = (newColumns: Array<{ _id: string; name: string }>) => {
    columns.value = newColumns;
  };

  return { board, setBoard, isLoading, setLoading, columns, setColumns };
});
