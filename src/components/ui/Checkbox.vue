<script setup lang="ts">
import { ref, watch } from "vue";

import CheckIcon from "@/icons/icon-check.svg";

const props = defineProps<{
  modelValue?: boolean;
  id?: string;
  label?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
const isChecked = ref<boolean>(props.modelValue ?? false);

const toggle = () => {
  isChecked.value = !isChecked.value;
  emit("update:modelValue", isChecked.value);
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined) {
      isChecked.value = newVal;
    }
  },
);
</script>

<template>
  <label class="flex items-center gap-4 cursor-pointer">
    <input type="checkbox" :id="id" class="sr-only" :checked="isChecked" @click="toggle" />
    <span
      class="h-4 w-4 border border-(--cst-foreground)/24 rounded-xs flex items-center justify-center shrink-0"
      :class="isChecked ? 'bg-(--cst-primary)' : 'bg-white'"
      aria-hidden="true"
    >
      <CheckIcon v-show="isChecked" class="text-white" />
    </span>
    <span
      v-if="label"
      class="text-[12px]"
      :class="{
        'line-through text-(--cst-foreground)': isChecked,
      }"
      >{{ label }}</span
    >
  </label>
</template>
