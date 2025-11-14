<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";
import * as z from "zod";
import { ref, toRef } from "vue";

import CrossIcon from "@/icons/icon-cross.svg";
import { computed, nextTick } from "vue";
import type { BoardAction } from "@/stores/Board";
import { validateForm } from "@/lib/zod";

export interface BoardForm {
  name: string;
  columns: Columns[];
}

export interface Columns {
  id: string;
  name: string;
}

const props = defineProps<{
  isExecuting: boolean;
  boardForm: BoardForm;
  boardAction: BoardAction;
}>();

const boardFormSchema = z.object({
  name: z
    .string()
    .min(3, "Board name must be at least 3 characters long.")
    .max(25, "Board name must be at most 25 characters long."),
  columns: z.array(
    z.object({
      id: z.string(),
      name: z
        .string()
        .min(3, "Column name must be at least 3 characters long.")
        .max(15, "Column name must be at most 15 characters long."),
    }),
  ),
});

const boardFormFirstSubmit = ref(false);
const boardFormErrors = ref<any>(null);

const boardButtonLabel = computed(() => {
  const labels = {
    create: props.isExecuting ? "Creating New Board" : "Create New Board",
    edit: props.isExecuting ? "Save Changes" : "Saving Changes",
  };
  return labels[props.boardAction];
});

const boardTitle = computed(() => {
  if (props.boardAction === "create") return "Add New Board";
  if (props.boardAction === "edit") return "Edit Board";
});

const emit = defineEmits<{
  (e: "createBoard", boardForm: BoardForm): void;
  (e: "updateBoard", boardForm: BoardForm): void;
}>();

const handleSubmit = () => {
  boardFormFirstSubmit.value = true;
  if (!validateForm(boardFormSchema, boardFormErrors, toRef(props.boardForm))) return;
  if (props.boardAction == "create") {
    emit("createBoard", props.boardForm);
  } else if (props.boardAction == "edit") {
    emit("updateBoard", props.boardForm);
  }
};

const onFormBlur = () => {
  if (boardFormFirstSubmit.value) {
    validateForm(boardFormSchema, boardFormErrors, toRef(props.boardForm));
  }
};

const getFieldErrors = (fieldName: string) => {
  const errs = boardFormErrors.value?.properties?.[fieldName]?.errors ?? [];
  return errs.join(" ");
};

const getColumnErrors = (index: number, field: string) => {
  const errs =
    boardFormErrors.value?.properties?.columns?.items?.[index]?.properties?.[field]?.errors ?? [];
  return errs.join(" ");
};

const columnsRef: (HTMLInputElement | null)[] = [];

const addColumn = async () => {
  props.boardForm.columns.push({ id: "new", name: "" });
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
    <h2 class="text-[18px]">{{ boardTitle }}</h2>
    <label class="text-[12px] text-(--cst-foreground)" for="name">Name</label>
    <div class="flex flex-col gap-2 w-full">
      <input
        class="w-full font-medium border border-(--cst-foreground)/25 p-2 rounded-md focus:outline-(--cst-primary) focus:invalid:outline-(--cst-destructive)"
        id="name"
        type="text"
        placeholder="e.g. Web Design"
        v-model="boardForm.name"
        :disabled="isExecuting"
        @blur="onFormBlur"
      />
      <p
        v-if="getFieldErrors('name').length != 0"
        class="text-[12px] font-medium text-(--cst-destructive)"
      >
        {{ getFieldErrors("name") }}
      </p>
    </div>
    <fieldset class="flex flex-col gap-2" :disabled="isExecuting">
      <legend class="text-[12px] text-(--cst-foreground) pb-4">Columns</legend>
      <div class="flex flex-col gap-2" v-for="(_, index) in boardForm.columns" :key="index">
        <div class="flex items-center gap-4 w-full">
          <input
            class="flex-1 font-medium border border-(--cst-foreground)/25 p-2 rounded-md focus:outline-(--cst-primary) focus:invalid:outline-(--cst-destructive)"
            type="text"
            placeholder="e.g. Todo"
            v-model="boardForm.columns[index]!.name"
            :ref="(el) => (columnsRef[index] = el as HTMLInputElement | null)"
            @blur="onFormBlur"
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
        <p
          v-if="getColumnErrors(index, 'name').length != 0"
          class="text-[12px] font-medium text-(--cst-destructive)"
        >
          {{ getColumnErrors(index, "name") }}
        </p>
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
