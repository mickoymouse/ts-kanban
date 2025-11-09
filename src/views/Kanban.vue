<script setup lang="ts"></script>
<template>
  <div class="flex flex-col h-full w-full">
    <div class="flex-1 flex flex-col items-center justify-center gap-4 font-bold">
      <p class="text-[18px] text-(--cst-foreground)">
        Your kanban is empty. Create a new board to get started.
      </p>
      <button
        class="text-[15px] bg-(--cst-primary) px-4 py-2 rounded-full text-white cursor-pointer"
      >
        + Add New Board
      </button>
    </div>
  </div>
</template>
