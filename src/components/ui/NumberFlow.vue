<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
const props = defineProps<{
  number: number; // Number to display
  class?: string; // Optional classes from parent
  duration?: number; // Animation duration in ms
}>();

const displayNumber = ref(props.number || 0);
const duration = props.duration || 100;

const classProp = props.class || "";

watch(
  () => props.number,
  (newVal, oldVal = 0) => {
    const start = oldVal;
    const end = newVal;
    const startTime = performance.now();

    function animate(time: number) {
      const t = Math.min((time - startTime) / duration, 1);

      const easedT = 1 - Math.pow(1 - t, 3);

      displayNumber.value = Math.floor(start + (end - start) * easedT);

      if (t < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  },
  { immediate: true },
);
</script>

<template>
  <span :class="classProp">{{ displayNumber }}</span>
</template>
