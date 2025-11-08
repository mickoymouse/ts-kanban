<script setup lang="ts">
import { reactive } from "vue";

import TaskCard from "@/components/TaskCard.vue";

const props = defineProps<{
  tasks: {
    title: string;
    description: string;
    subtasks: { title: string; isCompleted: boolean }[];
    status: string;
  }[];
}>();

const tasks = reactive(props.tasks);
</script>

<template>
  <div class="h-full min-w-[280px] max-w-[280px] flex flex-col gap-6 overflow-auto scrollbar-hide">
    <TaskCard v-for="(task, index) in tasks" :key="index" :task="task" />
  </div>
</template>
