<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <div class="flex w-full h-screen overflow-hidden">
    <Sidebar />
    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <Navbar />
      <main class="flex-1 w-full max-w-[1440px] mx-auto overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
