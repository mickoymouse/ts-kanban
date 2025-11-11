<script setup lang="ts">
import type { Id } from "../../convex/_generated/dataModel";
import Modal from "@/components/ui/Modal.vue";
import ViewTask from "@/components/ViewTask.vue";

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
  action: "view" | "edit" | "create";
}>();

const emit = defineEmits<{
  closeTaskModal: [];
}>();
</script>

<template>
  <Modal :show="show" @closeModal="emit('closeTaskModal')">
    <div
      class="flex flex-col bg-(--cst-bg2) p-6 rounded-md w-[480px] max-h-[75vh] overflow-auto gap-4 font-bold"
    >
      <ViewTask :show="show" :task="task" @closeTaskModal="emit('closeTaskModal')" />
    </div>
  </Modal>
</template>
