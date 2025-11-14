<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";
import * as z from "zod";
import { ref, computed, nextTick, toRef } from "vue";

import Dropdown from "@/components/ui/Dropdown.vue";
import CrossIcon from "@/icons/icon-cross.svg";
import type { TaskAction } from "@/stores/Task";
import { validateForm } from "@/lib/zod";

export interface TaskForm {
  title: string;
  description?: string;
  subtasks: Subtask[];
  status: string | null;
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

const props = defineProps<{
  isExecuting: boolean;
  taskForm: TaskForm;
  columnNames: string[];
  taskAction: TaskAction;
}>();

const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, "Task title must be at least 3 characters long.")
    .max(75, "Task title must be at most 75 characters long."),
  description: z
    .string()
    .max(150, "Task description must be at most 150 characters long.")
    .optional(),
  subtasks: z.array(
    z.object({
      id: z.string(),
      title: z
        .string()
        .min(3, "Subtask title must be at least 3 characters long.")
        .max(75, "Subtask title must be at most 75 characters long."),
    }),
  ),
});

const taskFormFirstSubmit = ref(false);
const taskFormErrors = ref<any>(null);

const onFormBlur = () => {
  if (taskFormFirstSubmit.value) {
    validateForm(taskFormSchema, taskFormErrors, toRef(props.taskForm));
  }
};

const getFieldErrors = (fieldName: string) => {
  const errs = taskFormErrors.value?.properties?.[fieldName]?.errors ?? [];
  return errs.join(" ");
};

const getSubtaskError = (index: number, field: string) => {
  const errs =
    taskFormErrors.value?.properties?.subtasks?.items?.[index]?.properties?.[field]?.errors ?? [];
  return errs.join(" ");
};

const taskTitle = computed(() => {
  if (props.taskAction === "create") return "Add New Task";
  if (props.taskAction === "edit") return "Edit Task";
});

const taskButtonLabel = computed(() => {
  const labels = {
    create: props.isExecuting ? "Creating task" : "Create task",
    edit: props.isExecuting ? "Saving Changes" : "Save Changes",
    view: "View Task",
  };
  return labels[props.taskAction];
});

const emit = defineEmits<{
  (e: "createTask", taskForm: TaskForm): void;
  (e: "updateTask", taskForm: TaskForm): void;
}>();

const handleSubmit = () => {
  taskFormFirstSubmit.value = true;
  if (!validateForm(taskFormSchema, taskFormErrors, toRef(props.taskForm))) return;
  if (props.taskAction == "create") {
    emit("createTask", props.taskForm);
  } else if (props.taskAction == "edit") {
    emit("updateTask", props.taskForm);
  }
};

const subtaskRefs: (HTMLInputElement | null)[] = [];

const addSubtask = async () => {
  props.taskForm.subtasks.push({ id: "new", title: "", isCompleted: false });
  await nextTick();
  const lastIndex = props.taskForm.subtasks.length - 1;
  subtaskRefs[lastIndex]?.focus();
};

const removeSubtask = (index: number) => {
  props.taskForm.subtasks.splice(index, 1);
  subtaskRefs.splice(index, 1);
};
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="font-bold flex flex-col w-full gap-4 text-[13px] select-none"
  >
    <h2 class="text-[18px]">{{ taskTitle }}</h2>
    <label class="text-[12px] text-(--cst-foreground)" for="title">Title</label>
    <div class="w-full flex flex-col gap-2">
      <input
        class="w-full font-medium border border-(--cst-foreground)/25 p-2 rounded-md focus:outline-(--cst-primary)"
        id="title"
        type="text"
        placeholder="e.g. Take coffee break"
        v-model="taskForm.title"
        :disabled="isExecuting"
        @blur="onFormBlur"
      />
      <p
        v-if="getFieldErrors('title').length != 0"
        class="text-[12px] font-medium text-(--cst-destructive)"
      >
        {{ getFieldErrors("title") }}
      </p>
    </div>
    <label class="text-[12px] text-(--cst-foreground)" for="description">Description</label>
    <div class="w-full flex flex-col gap-2">
      <textarea
        class="font-medium resize-none border border-(--cst-foreground)/25 p-2 rounded-md focus:outline-(--cst-primary)"
        id="description"
        rows="4"
        cols="50"
        placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
        v-model="taskForm.description"
        :disabled="isExecuting"
        @blur="onFormBlur"
      ></textarea>
      <p
        v-if="getFieldErrors('description').length != 0"
        class="text-[12px] font-medium text-(--cst-destructive)"
      >
        {{ getFieldErrors("description") }}
      </p>
    </div>
    <fieldset class="flex flex-col gap-2" :disabled="isExecuting">
      <legend class="text-[12px] text-(--cst-foreground) pb-4">Subtasks</legend>
      <div class="flex flex-col gap-2" v-for="(_, index) in taskForm.subtasks" :key="index">
        <div class="flex items-center gap-4 w-full">
          <input
            class="flex-1 font-medium border border-(--cst-foreground)/25 p-2 rounded-md focus:outline-(--cst-primary)"
            type="text"
            placeholder="e.g. Make coffee"
            v-model="taskForm.subtasks[index]!.title"
            :ref="(el) => (subtaskRefs[index] = el as HTMLInputElement | null)"
            @blur="onFormBlur"
          />

          <CrossIcon
            :class="[
              'shrink-0',
              isExecuting
                ? 'cursor-not-allowed opacity-50 text-(--cst-foreground)/50'
                : 'cursor-pointer text-(--cst-foreground) hover:text-(--cst-destructive)',
            ]"
            @click="!isExecuting && removeSubtask(index)"
          />
        </div>
        <p
          v-if="getSubtaskError(index, 'title').length != 0"
          class="text-[12px] font-medium text-(--cst-destructive)"
        >
          {{ getSubtaskError(index, "title") }}
        </p>
      </div>
    </fieldset>
    <button
      class="bg-(--cst-primary)/10 dark:bg-white dark:text-(--cst-primary) h-10 rounded-full text-(--cst-primary) cursor-pointer hover:bg-(--cst-primary-hover) hover:text-white dark:hover:bg-(--cst-primary-hover) dark:hover:text-white transition-colors disabled:cursor-not-allowed disabled:hover:bg-(--cst-primary)/10 disabled:text-(--cst-primary)"
      @click="addSubtask"
      type="button"
      :disabled="isExecuting"
    >
      + Add New Subtask
    </button>
    <Dropdown :options="columnNames" v-model="taskForm.status" :disabled="isExecuting" />
    <button
      class="flex items-center justify-center gap-2 bg-(--cst-primary) dark:bg-(--cst-primary) dark:text-white h-10 rounded-full disabled:opacity-30 text-white cursor-pointer hover:bg-(--cst-primary-hover) dark:hover:bg-(--cst-primary-hover) transition-colors disabled:cursor-not-allowed disabled:hover:bg-(--cst-primary)"
      type="submit"
      :disabled="isExecuting"
    >
      {{ taskButtonLabel }}
      <LoaderCircle v-if="isExecuting" class="mr-3 size-5 animate-spin text-white" />
    </button>
  </form>
</template>
