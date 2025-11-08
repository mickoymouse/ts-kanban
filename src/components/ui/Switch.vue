<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  state?: boolean;
}>();
const emit = defineEmits<{ (e: "update:state", value: boolean): void }>();

const isOn = ref(false);

const toggle = () => {
  isOn.value = !isOn.value;
  emit("update:state", isOn.value);
};

watch(
  () => props.state,
  (val) => {
    if (val !== undefined) {
      isOn.value = val;
    }
  },
  { immediate: true }
);
</script>

<template>
  <button
    class="relative bg-(--cst-primary) rounded-full w-10 h-5 px-1 cursor-pointer"
    @click="toggle"
  >
    <span
      class="block w-3.5 h-3.5 rounded-full bg-white transition-transform duration-300"
      :class="isOn ? 'translate-x-4.5' : 'translate-x-0'"
    ></span>
  </button>
</template>
