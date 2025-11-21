<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, type Ref } from "vue";

import ArrowDownIcon from "@/icons/icon-chevron-down.svg";
import ArrowUpIcon from "@/icons/icon-chevron-up.svg";

const props = defineProps<{
  options: Array<string>;
  modelValue: string | null;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const selectedOption: Ref<string | null> = ref(props.modelValue || null);
const open: Ref<boolean> = ref(false);
const buttonRef: Ref<HTMLElement | null> = ref(null);
const menuRef: Ref<HTMLElement | null> = ref(null);

const menuStyle = ref<Record<string, string>>({
  position: "fixed",
  top: "0px",
  left: "0px",
  minWidth: "auto",
  zIndex: "9999",
});

const updateWidth = () => {
  if (buttonRef.value) {
    menuStyle.value.minWidth = `${buttonRef.value.offsetWidth}px`;
  }
};

const updatePosition = () => {
  if (!buttonRef.value) return;
  const rect = buttonRef.value.getBoundingClientRect();
  menuStyle.value.top = `${rect.bottom}px`;
  menuStyle.value.left = `${rect.left}px`;
};

const openMenu = async () => {
  if (props.disabled) return;
  open.value = true;
  await nextTick();
  updateWidth();
  updatePosition();
  window.addEventListener("resize", updatePosition);
  window.addEventListener("scroll", updatePosition, true);
};

const closeMenu = () => {
  open.value = false;
  window.removeEventListener("resize", updatePosition);
  window.removeEventListener("scroll", updatePosition, true);
};

const optionSelected = (option: string) => {
  selectedOption.value = option;
  emit("update:modelValue", option);
  closeMenu();
};

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target as Node;
  if (menuRef.value?.contains(target) || buttonRef.value?.contains(target)) return;
  closeMenu();
};

onMounted(() => {
  updateWidth();
  document.addEventListener("click", handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
  window.removeEventListener("resize", updatePosition);
  window.removeEventListener("scroll", updatePosition, true);
});
</script>

<template>
  <div class="select-none">
    <button
      ref="buttonRef"
      class="relative w-full bg-(--cst-bg2) flex justify-between items-center border border-(--cst-foreground)/25 p-3 rounded-md font-medium text-[13px] cursor-pointer focus:border-(--cst-primary) focus:border-2 disabled:cursor-not-allowed"
      @click="open ? closeMenu() : openMenu()"
      :disabled="disabled"
      type="button"
    >
      {{ selectedOption || "Select an option" }}
      <ArrowUpIcon v-if="open" aria-hidden="true" />
      <ArrowDownIcon v-else aria-hidden="true" />
    </button>

    <teleport to="body">
      <div
        v-if="open"
        ref="menuRef"
        class="bg-(--cst-bg2) rounded-b-md max-h-[20vh] overflow-auto scrollbar-hide"
        :style="menuStyle"
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
    </teleport>
  </div>
</template>
