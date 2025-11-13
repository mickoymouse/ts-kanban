<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";

import CrossIcon from "@/icons/icon-cross.svg";
import { computed, nextTick } from "vue";
import type { BoardAction } from "@/stores/Board";

export interface BoardForm {
  name: string;
  columns: Columns[];
}

export interface Columns {
  id: string;
  title: string;
}

const props = defineProps<{
  isExecuting: boolean;
  boardForm: BoardForm;
  boardAction: BoardAction;
}>();

const boardButtonLabel = computed(() => {
  const labels = {
    create: props.isExecuting ? "Creating New Board" : "Create New Board",
    edit: props.isExecuting ? "Save Changes" : "Saving Changes",
  };
  return labels[props.boardAction];
});

const emit = defineEmits<{
  (e: "createBoard", boardForm: BoardForm): void;
  (e: "updateBoard", boardForm: BoardForm): void;
}>();

const handleSubmit = () => {
  if (props.boardAction == "create") {
    emit("createBoard", props.boardForm);
  } else if (props.boardAction == "edit") {
    emit("updateBoard", props.boardForm);
  }
};

const columnsRef: (HTMLInputElement | null)[] = [];

const addColumn = async () => {
  props.boardForm.columns.push({ id: "new", title: "" });
  await nextTick();
  const lastIndex = props.boardForm.columns.length - 1;
  columnsRef[lastIndex]?.focus();
};

const removeColumn = (index: number) => {
  props.boardForm.columns.splice(index, 1);
  columnsRef.splice(index, 1);
};
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="font-bold flex flex-col w-full gap-4 text-[13px] select-none"
  >
    <h2 class="text-[18px]">Add New Board</h2>
    <label class="text-[12px] text-(--cst-foreground)" for="name">Name</label>
    <input
      class="font-medium border border-(--cst-foreground)/25 p-2 rounded-md focus:outline-(--cst-primary) focus:invalid:outline-(--cst-destructive)"
      id="name"
      type="text"
      placeholder="e.g. Web Design"
      v-model="boardForm.name"
      :disabled="isExecuting"
      required
    />
    <fieldset class="flex flex-col gap-2" :disabled="isExecuting">
      <legend class="text-[12px] text-(--cst-foreground) pb-4">Columns</legend>
      <div
        class="flex items-center gap-4 w-full"
        v-for="(_, index) in boardForm.columns"
        :key="index"
      >
        <input
          class="flex-1 font-medium border border-(--cst-foreground)/25 p-2 rounded-md focus:outline-(--cst-primary) focus:invalid:outline-(--cst-destructive)"
          type="text"
          placeholder="e.g. Make coffee"
          v-model="boardForm.columns[index]!.title"
          :ref="(el) => (columnsRef[index] = el as HTMLInputElement | null)"
          required
        />
        <CrossIcon
          :class="[
            'shrink-0',
            isExecuting
              ? 'cursor-not-allowed opacity-50 text-(--cst-foreground)/50'
              : 'cursor-pointer text-(--cst-foreground) hover:text-(--cst-destructive)',
          ]"
          @click="!isExecuting && removeColumn(index)"
        />
      </div>
    </fieldset>
    <button
      class="bg-(--cst-primary)/10 dark:bg-white dark:text-(--cst-primary) h-10 rounded-full text-(--cst-primary) cursor-pointer hover:bg-(--cst-primary-hover) hover:text-white dark:hover:bg-(--cst-primary-hover) dark:hover:text-white transition-colors disabled:cursor-not-allowed disabled:hover:bg-(--cst-primary)/10 disabled:text-(--cst-primary)"
      @click="addColumn"
      type="button"
      :disabled="isExecuting"
    >
      + Add New Column
    </button>
    <button
      class="flex items-center justify-center gap-2 bg-(--cst-primary) dark:bg-(--cst-primary) dark:text-white h-10 rounded-full disabled:opacity-30 text-white cursor-pointer hover:bg-(--cst-primary-hover) dark:hover:bg-(--cst-primary-hover) transition-colors disabled:cursor-not-allowed disabled:hover:bg-(--cst-primary)"
      type="submit"
      :disabled="isExecuting"
    >
      {{ boardButtonLabel }}
      <LoaderCircle v-if="isExecuting" class="mr-3 size-5 animate-spin text-white" />
    </button>
  </form>
</template>
