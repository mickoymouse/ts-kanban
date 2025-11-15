import { defineStore } from "pinia";
import { onMounted, onUnmounted, ref } from "vue";

export const useSidebarStore = defineStore("sidebar", () => {
  const showSidebar = ref(true);
  const isMobile = ref(false);
  const toggleSidebar = () => (showSidebar.value = !showSidebar.value);

  const checkWidth = () => {
    showSidebar.value = window.innerWidth >= 768;
    isMobile.value = window.innerWidth < 768;
  };

  onMounted(() => {
    checkWidth();
    window.addEventListener("resize", checkWidth);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkWidth);
  });

  return { showSidebar, toggleSidebar, isMobile };
});
