import { defineStore } from "pinia";
import { ref } from "vue";

export const useBoardStore = defineStore("board", () => {
  const board = ref("");
  const isLoading = ref(false);

  const setName = (name: string) => {
    board.value = name;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  return { board, setName, isLoading, setLoading };
});
