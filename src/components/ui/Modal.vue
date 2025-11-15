<script setup lang="ts">
import { Teleport } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  class: {
    type: String,
    required: false,
    default: "items-center justify-center",
  },
  teleportPlace: {
    type: String,
    required: false,
    default: "body",
  },
  transitionName: {
    type: String,
    required: false,
    default: "",
  },
});

const emit = defineEmits(["closeModal"]);
</script>

<template>
  <Teleport :to="props.teleportPlace">
    <div v-if="props.show" class="w-full h-full absolute z-99 bg-black/50 inset-0"></div>
    <Transition v-if="props.transitionName" :name="props.transitionName">
      <div
        v-if="props.show"
        :class="`flex w-full h-full z-999 absolute ${props.class}`"
        @mousedown.self="emit('closeModal')"
      >
        <slot></slot>
      </div>
    </Transition>
    <div v-else-if="props.show" class="w-full h-full absolute z-999 bg-black/50 inset-0">
      <div
        :class="`flex w-full h-full absolute ${props.class}`"
        @mousedown.self="emit('closeModal')"
      >
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
