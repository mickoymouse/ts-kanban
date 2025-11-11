<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, nextTick, reactive } from "vue";

import Dropdown from "@/components/ui/Dropdown.vue";
import { useBoardStore } from "@/stores/Board";
import type { Id } from "../../convex/_generated/dataModel";
import CrossIcon from "@/icons/icon-cross.svg";

const boardStore = useBoardStore();
const { columns } = storeToRefs(boardStore);
const columnNames = computed(() => columns.value.map((column) => column.name));
const columnNameToIdMap = computed(() => {
  const map: Record<string, Id<"columns">> = {};
  columns.value.forEach((column) => {
    map[column.name] = column._id as Id<"columns">;
  });
  return map;
});

const taskForm = reactive({
  title: "",
  description: "" as string | null,
  subtasks: [""] as Array<string>,
  status: (columnNames.value[0] as string) || null,
});

const subtaskRefs: (HTMLInputElement | null)[] = [];

const createTask = () => {
  console.log("Create Task clicked", taskForm);
};

const addSubtask = async () => {
  taskForm.subtasks.push("");
  await nextTick();
  const lastIndex = taskForm.subtasks.length - 1;
  subtaskRefs[lastIndex]?.focus();
};

const removeSubtask = (index: number) => {
  taskForm.subtasks.splice(index, 1);
  subtaskRefs.splice(index, 1);
};
</script>

<template>
  <form @submit.prevent="createTask" class="font-bold flex flex-col w-full gap-4 text-[13px]">
    <h2 class="text-[18px]">Add New Task</h2>
    <label class="text-[12px] text-(--cst-foreground)" for="title">Title</label>
    <input
      class="font-medium border border-(--cst-foreground)/25 p-2 rounded-md focus:outline-(--cst-primary)"
      id="title"
      type="text"
      placeholder="e.g. Take coffee break"
      v-model="taskForm.title"
    />
    <label class="text-[12px] text-(--cst-foreground)" for="description">Description</label>
    <textarea
      class="font-medium resize-none border border-(--cst-foreground)/25 p-2 rounded-md focus:outline-(--cst-primary)"
      id="description"
      rows="4"
      cols="50"
      placeholder="e.g. It's always good to take a break. This 15 minute break will 
recharge the batteries a little."
      v-model="taskForm.description"
    ></textarea>
    <fieldset class="flex flex-col gap-2">
      <legend class="text-[12px] text-(--cst-foreground) pb-4">Subtasks</legend>
      <div
        class="flex items-center gap-4 w-full"
        v-for="(subtask, index) in taskForm.subtasks"
        :key="index"
      >
        <input
          class="flex-1 font-medium border border-(--cst-foreground)/25 p-2 rounded-md focus:outline-(--cst-primary)"
          type="text"
          placeholder="e.g. Make coffee"
          v-model="taskForm.subtasks[index]"
          :ref="(el) => (subtaskRefs[index] = el as HTMLInputElement | null)"
        />
        <CrossIcon
          class="shrink-0 cursor-pointer text-(--cst-foreground)"
          @click="removeSubtask(index)"
        />
      </div>
    </fieldset>
    <button
      class="bg-(--cst-primary)/10 h-10 rounded-full text-(--cst-primary) cursor-pointer hover:bg-(--cst-primary) hover:text-white transition-colors"
      @click="addSubtask"
      type="button"
    >
      + Add New Subtask
    </button>
    <Dropdown :options="columnNames" v-model="taskForm.status" />
    <button
      class="bg-(--cst-primary) h-10 rounded-full disabled:opacity-30 text-white cursor-pointer hover:bg-(--cst-primary-hover) transition-colors"
      type="submit"
    >
      Create Task
    </button>
  </form>
</template>
