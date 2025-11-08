<script setup>
import { Teleport, defineEmits } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["closeModal"]);
</script>

<template>
  <Teleport to="body">
    <div v-if="props.show" class="w-full h-full fixed z-999 bg-black/50 inset-0">
      <div class="flex items-center justify-center w-full h-full" @click.self="emit('closeModal')">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
