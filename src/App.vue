<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
</script>

<template>
  <div class="flex w-full h-screen overflow-hidden">
    <div><p>side bar</p></div>
    <div>qweqeqw</div>
    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <Navbar />
      <main class="flex-1 w-full max-w-[1440px] mx-auto overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
