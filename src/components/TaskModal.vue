<script setup lang="ts">
import { storeToRefs } from "pinia";

import Modal from "@/components/ui/Modal.vue";
import ViewTask from "@/components/ViewTask.vue";
import CreateTask from "@/components/CreateTask.vue";
import EditTask from "@/components/EditTask.vue";
import { useTaskModalStore } from "@/stores/Task";

const taskModalStore = useTaskModalStore();
const { show, task, taskAction } = storeToRefs(taskModalStore);
const { closeTaskModal } = taskModalStore;
</script>

<template>
  <Modal :show="show" @closeModal="closeTaskModal">
    <div
      class="flex flex-col bg-(--cst-bg2) p-6 rounded-md w-[480px] max-h-[75vh] overflow-auto gap-4 font-bold"
    >
      <ViewTask v-if="taskAction === 'view' && task" :task="task" />
      <CreateTask v-else-if="taskAction === 'create' && !task" />
      <EditTask v-else-if="taskAction === 'edit' && task" :task="task" />
    </div>
  </Modal>
</template>
