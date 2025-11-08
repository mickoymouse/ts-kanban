<script setup lang="ts">
import { computed, ref, reactive, onMounted, onUnmounted, type Ref } from "vue";

import OptionsIcon from "@/icons/icon-vertical-ellipsis.svg";
import Modal from "@/components/ui/Modal.vue";
import Dropdown from "@/components/ui/Dropdown.vue";
import Checkbox from "@/components/ui/Checkbox.vue";

const props = defineProps<{
  task: {
    title: string;
    description: string;
    subtasks: { title: string; isCompleted: boolean }[];
    status: string;
  };
}>();

const taskCompleted: Ref<number> = computed(
  () => props.task.subtasks.filter((subtask) => subtask.isCompleted).length
);

const totalTasks: Ref<number> = computed(() => props.task.subtasks.length);

const editTask = () => {
  closeTaskOptions();
};

const deleteTask = () => {
  closeTaskOptions();
};

const taskOptionsRef: Ref<HTMLElement | null> = ref(null);
const showTaskOptions: Ref<boolean> = ref(false);
const closeTaskOptions = () => {
  showTaskOptions.value = false;
};
const openTaskOptions = () => {
  showTaskOptions.value = true;
};

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

const showTaskModal = ref(false);
const openTaskModal = () => {
  showTaskModal.value = true;
};
const closeTaskModal = () => {
  showTaskModal.value = false;
};
</script>

<template>
  <div
    class="w-full bg-(--cst-bg2) flex flex-col font-bold p-4 rounded-md cursor-pointer gap-2"
    @click="openTaskModal"
  >
    <p class="text-[15px]">{{ task.title }}</p>
    <p class="text-[12px] text-(--cst-foreground)">
      {{ taskCompleted }} of {{ totalTasks }} subtasks
    </p>
  </div>
  <Modal :show="showTaskModal" @closeModal="closeTaskModal">
    <div
      class="flex flex-col bg-(--cst-bg2) p-6 rounded-md w-[480px] max-h-[75vh] overflow-auto gap-4 font-bold"
    >
      <div class="flex gap-4 w-full justify-between relative">
        <h2 class="text-[15px]">{{ task.title }}</h2>
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
        {{ task.description }}
      </p>
      <p class="text-[12px] text-(--cst-foreground)">
        Subtasks ({{ taskCompleted }} of {{ totalTasks }})
      </p>
      <ul class="flex flex-col gap-2">
        <li
          v-for="(subtask, index) in task.subtasks"
          :key="index"
          class="p-4 bg-(--cst-bg) rounded-md hover:bg-(--cst-primary)/25 cursor-pointer"
        >
          <Checkbox :id="subtask.title" :label="subtask.title" v-model="subtask.isCompleted" />
        </li>
      </ul>
      <p class="text-[12px] text-(--cst-foreground)">Current Status</p>
      <Dropdown :options="['Todo', 'In Progress', 'Done']" :selected="task.status" />
    </div>
  </Modal>
</template>
