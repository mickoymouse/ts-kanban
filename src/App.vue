<script setup lang="ts">
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <div class="flex w-full h-screen overflow-hidden">
    <Sidebar />
    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <Header />
      <main class="flex-1 w-full flex flex-start overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
