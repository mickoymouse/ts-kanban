<script setup lang="ts">
import { ref, onMounted, onUnmounted, type Ref } from "vue";

import ArrowDownIcon from "@/icons/icon-chevron-down.svg";
import ArrowUpIcon from "@/icons/icon-chevron-up.svg";

const props = defineProps<{
  options: Array<string>;
  selected: string | null;
}>();

const emit = defineEmits<{
  change: [value: string];
}>();

const selectedOption: Ref<string | null> = ref(props.selected || null);
const open: Ref<boolean> = ref(false);
const buttonRef: Ref<HTMLElement | null> = ref(null);
const dropdownRef: Ref<HTMLElement | null> = ref(null);

const optionSelected = (option: string) => {
  selectedOption.value = option;
  open.value = false;
  emit("change", option);
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    open.value = false;
  }
};

const buttonWidth = ref("auto");

const updateWidth = () => {
  if (buttonRef.value) {
    buttonWidth.value = `${buttonRef.value.offsetWidth}px`;
  }
};

onMounted(() => {
  updateWidth();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div ref="dropdownRef">
    <button
      ref="buttonRef"
      class="relative w-full bg-(--cst-bg2) flex justify-between items-center border border-(--cst-foreground)/25 p-3 rounded-md font-medium text-[13px] cursor-pointer focus:border-(--cst-primary)"
      @click="open = !open"
    >
      {{ selectedOption || "Select an option" }}
      <ArrowUpIcon v-if="open" aria-hidden="true" />
      <ArrowDownIcon v-else aria-hidden="true" />
    </button>
    <div
      v-show="open"
      class="absolute z-10 bg-(--cst-bg2) rounded-b-md transition-all duration-150 ease-in-out"
      :style="{ width: buttonWidth }"
    >
      <ul>
        <li
          v-for="(option, index) in options"
          :key="index"
          class="p-3 hover:bg-(--cst-bg) cursor-pointer font-medium text-[13px] text-(--cst-foreground) last:rounded-b-md"
          @click="optionSelected(option)"
        >
          {{ option }}
        </li>
      </ul>
    </div>
  </div>
</template>
