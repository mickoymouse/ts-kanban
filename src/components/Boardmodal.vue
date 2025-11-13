<script setup lang="ts">
import { storeToRefs } from "pinia";

import Modal from "@/components/ui/Modal.vue";
import { useBoardStore } from "@/stores/Board";
import CreateBoard from "@/components/CreateBoard.vue";
import EditBoard from "@/components/EditBoard.vue";

const boardStore = useBoardStore();
const { showModal, board, boardAction } = storeToRefs(boardStore);
const { closeBoardModal } = boardStore;
</script>

<template>
  <Modal :show="showModal" @closeModal="closeBoardModal">
    <div
      class="flex flex-col bg-(--cst-bg2) p-6 rounded-md w-[480px] max-h-[75vh] overflow-auto gap-4 font-bold"
    >
      <CreateBoard v-if="boardAction === 'create'" />
      <EditBoard v-else-if="boardAction === 'edit' && board" :board="board" />
    </div>
  </Modal>
</template>
