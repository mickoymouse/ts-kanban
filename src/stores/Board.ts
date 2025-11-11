import { defineStore } from "pinia";
import { ref } from "vue";

export const useBoardStore = defineStore("board", () => {
  const board = ref<string | null>(null);
  const isLoading = ref(false);
  const columns = ref<
    Array<{
      _id: string;
      name: string;
    }>
  >([]);

  const setName = (name: string) => {
    board.value = name;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const setColumns = (newColumns: Array<{ _id: string; name: string }>) => {
    columns.value = newColumns;
  };

  return { board, setName, isLoading, setLoading, columns, setColumns };
});
