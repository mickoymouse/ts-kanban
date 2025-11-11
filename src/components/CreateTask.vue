<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, nextTick, reactive, ref } from "vue";
import { useConvexMutation } from "convex-vue";
import { LoaderCircle } from "lucide-vue-next";

import Dropdown from "@/components/ui/Dropdown.vue";
import { useBoardStore } from "@/stores/Board";
import CrossIcon from "@/icons/icon-cross.svg";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useTaskModalStore } from "@/stores/Task";

const boardStore = useBoardStore();
const { board } = storeToRefs(boardStore);
const { columns } = storeToRefs(boardStore);
const taskModalStore = useTaskModalStore();
const { closeTaskModal } = taskModalStore;

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
  description: "" as string | undefined,
  subtasks: [""] as Array<string>,
  status: (columnNames.value[0] as string) || null,
});

const isCreatingTask = ref(false);

const subtaskRefs: (HTMLInputElement | null)[] = [];

const createTask = useConvexMutation(api.functions.boards.createTask);

const createTaskHandler = async () => {
  isCreatingTask.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await createTask.mutate({
      task: {
        title: taskForm.title,
        description: taskForm.description,
        boardId: board.value?.id as Id<"boards">,
        columnId: columnNameToIdMap.value[taskForm.status as string] as Id<"columns">,
        subtasks: taskForm.subtasks
          .filter((subtask) => subtask.trim() !== "")
          .map((subtask) => ({ title: subtask, isCompleted: false })),
      },
    });
    closeTaskModal();
  } catch (error) {
    console.error("Error creating task:", error);
  } finally {
    isCreatingTask.value = false;
  }
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
  <form
    @submit.prevent="createTaskHandler"
    class="font-bold flex flex-col w-full gap-4 text-[13px]"
  >
    <h2 class="text-[18px]">Add New Task</h2>
    <label class="text-[12px] text-(--cst-foreground)" for="title">Title</label>
    <input
      class="font-medium border border-(--cst-foreground)/25 p-2 rounded-md focus:outline-(--cst-primary)"
      id="title"
      type="text"
      placeholder="e.g. Take coffee break"
      v-model="taskForm.title"
      :disabled="isCreatingTask"
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
      :disabled="isCreatingTask"
    ></textarea>
    <fieldset class="flex flex-col gap-2" :disabled="isCreatingTask">
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
          :class="[
            'shrink-0',
            isCreatingTask
              ? 'cursor-not-allowed opacity-50 text-(--cst-foreground)/50'
              : 'cursor-pointer text-(--cst-foreground) hover:text-red-500',
          ]"
          @click="!isCreatingTask && removeSubtask(index)"
        />
      </div>
    </fieldset>
    <button
      class="bg-(--cst-primary)/10 h-10 rounded-full text-(--cst-primary) cursor-pointer hover:bg-(--cst-primary) hover:text-white transition-colors disabled:cursor-not-allowed disabled:hover:bg-(--cst-primary)/10 disabled:text-(--cst-primary)"
      @click="addSubtask"
      type="button"
      :disabled="isCreatingTask"
    >
      + Add New Subtask
    </button>
    <Dropdown :options="columnNames" v-model="taskForm.status" :disabled="isCreatingTask" />
    <button
      class="flex items-center justify-center gap-2 bg-(--cst-primary) h-10 rounded-full disabled:opacity-30 text-white cursor-pointer hover:bg-(--cst-primary-hover) transition-colors disabled:cursor-not-allowed disabled:hover:bg-(--cst-primary)"
      type="submit"
      :disabled="isCreatingTask"
    >
      {{ isCreatingTask ? "Creating task" : "Create Task" }}
      <LoaderCircle v-if="isCreatingTask" class="mr-3 size-5 animate-spin text-white" />
    </button>
  </form>
</template>
