<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type Ref } from "vue";
import { useConvexMutation } from "convex-vue";
import { storeToRefs } from "pinia";

import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useBoardStore } from "@/stores/Board";
import Checkbox from "@/components/ui/Checkbox.vue";
import Dropdown from "@/components/ui/Dropdown.vue";
import OptionsIcon from "@/icons/icon-vertical-ellipsis.svg";

const props = defineProps<{
  show: boolean;
  task: {
    _id: Id<"tasks">;
    column: string;
    title: string;
    description?: string;
    subtasks: Array<{
      _id: Id<"subtasks">;
      title: string;
      isCompleted: boolean;
    }>;
  };
}>();

const taskCompleted = computed(
  () => props.task.subtasks.filter((subtask) => subtask.isCompleted).length ?? 0,
);
const totalTasks = computed(() => props.task.subtasks.length ?? 0);

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

const { mutate: updateSubtaskStatus } = useConvexMutation(api.functions.boards.updateSubtaskStatus);

const updateSubtaskStatusHandler = async (subtaskId: Id<"subtasks">, isCompleted: boolean) => {
  try {
    await updateSubtaskStatus({ subtaskId, isCompleted });
  } catch (error) {
    console.error("Error updating subtask status:", error);
  }
};

const { mutate: updateTaskStatus } = useConvexMutation(api.functions.boards.updateTaskStatus);

const updateTaskStatusHandler = async (taskId: Id<"tasks">, columnName: string) => {
  console.log("Updating task status to column:", columnName);
  try {
    const columnId = columnNameToIdMap.value[columnName];
    console.log("Mapped column ID:", columnId);
    if (columnId) {
      await updateTaskStatus({ taskId, newColumnId: columnId });
    }
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

const editTask = () => {
  closeTaskOptions();
};

const deleteTask = () => {
  closeTaskOptions();
};
const showTaskOptions: Ref<boolean> = ref(false);
const closeTaskOptions = () => {
  showTaskOptions.value = false;
};
const openTaskOptions = () => {
  showTaskOptions.value = true;
};

const taskOptionsRef: Ref<HTMLElement | null> = ref(null);

const taskOptionsClickOutside = (event: MouseEvent) => {
  if (
    taskOptionsRef.value &&
    !taskOptionsRef.value.contains(event.target as Node) &&
    !(event.target as Element).closest("svg")
  ) {
    closeTaskOptions();
  }
};

onMounted(() => {
  document.addEventListener("click", taskOptionsClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", taskOptionsClickOutside);
});
</script>
<template>
  <div class="flex gap-4 w-full justify-between relative">
    <h2 class="text-[15px]">{{ task?.title }}</h2>
    <OptionsIcon class="cursor-pointer shrink-0" @click="openTaskOptions" />
    <div
      v-show="showTaskOptions"
      ref="taskOptionsRef"
      class="bg-(--cst-bg2) flex flex-col gap-2 absolute right-0 top-full font-medium text-[13px] rounded-md shadow-md overflow-hidden"
    >
      <button
        class="text-(--cst-foreground) text-[13px] w-full text-left cursor-pointer hover:bg-(--cst-bg) px-4 py-2"
        @click="editTask"
      >
        Edit Task
      </button>
      <button
        class="text-(--cst-destructive) text-[13px] w-full text-left cursor-pointer hover:bg-(--cst-bg) px-4 py-2"
        @click="deleteTask"
      >
        Delete Task
      </button>
    </div>
  </div>
  <p class="font-medium text-[13px] text-(--cst-foreground)">
    {{ task?.description }}
  </p>
  <p class="text-[12px] text-(--cst-foreground)">
    Subtasks ({{ taskCompleted }} of {{ totalTasks }})
  </p>
  <ul class="flex flex-col gap-2">
    <li
      v-for="subtask in task?.subtasks"
      :key="subtask._id"
      class="p-4 bg-(--cst-bg) rounded-md hover:bg-(--cst-primary)/25 cursor-pointer"
    >
      <Checkbox
        :id="subtask.title"
        :label="subtask.title"
        v-model="subtask.isCompleted"
        @change="updateSubtaskStatusHandler(subtask._id, subtask.isCompleted)"
      />
    </li>
  </ul>
  <p class="text-[12px] text-(--cst-foreground)">Current Status</p>
  <Dropdown
    :options="columnNames"
    :selected="task.column"
    @change="updateTaskStatusHandler(task._id, $event)"
  />
</template>
