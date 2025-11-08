<script setup lang="ts">
import OptionsButton from "@/icons/icon-vertical-ellipsis.svg";
</script>

<template>
  <nav
    class="h-24 w-full bg-(--cst-bg2) flex justify-between items-center px-8 border border-(--cst-lines)"
  >
    <div>
      <h1 class="text-[24px] font-bold">Platform Launch</h1>
    </div>
    <div class="flex items-center gap-4">
      <button
        class="bg-(--cst-primary) px-8 py-3 rounded-full disabled:opacity-30 text-white cursor-pointer"
        disabled
      >
        + Add New Task
      </button>
      <OptionsButton class="cursor-pointer" />
    </div>
  </nav>
</template>
