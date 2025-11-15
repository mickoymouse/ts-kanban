import { defineStore } from "pinia";
import { ref } from "vue";

export const useSidebarStore = defineStore("sidebar", () => {
  const showSidebar = ref(true);
  const toggleSidebar = () => (showSidebar.value = !showSidebar.value);

  return { showSidebar, toggleSidebar };
});
