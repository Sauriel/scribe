<template>
  <slot
    name="trigger"
    :open="openDialog"
    :close="closeDialog"
  >
    <button @click="openDialog">
      Show
    </button>
    <button @click="closeDialog">
      Close
    </button>
  </slot>
  <Teleport :to="teleport">
    <dialog
      ref="dialog"
      class="sc-dialog"
    >
      <slot
        :open="openDialog"
        :close="closeDialog"
      >
        Hello World
        <button @click="closeDialog">
          Close
        </button>
      </slot>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Props = {
  teleport?: string;
}

const props = withDefaults(defineProps<Props>(), {
  teleport: 'body'
});

const dialog = ref<HTMLDialogElement | null>(null);

function openDialog() {
  dialog.value?.showModal();
}

function closeDialog() {
  dialog.value?.close();
}
</script>

<style scoped>
.sc-dialog {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: inherit;
  background-color: var(--color-background-500);
  min-width: 20vw;
  max-width: calc(100vw - 100px);
  max-height: calc(100vh - 100px);
  padding: 2rem;
  border: none;
  border-radius: var(--border-radius);
  z-index: 999;
}

.sc-dialog::backdrop {
  background: rgba(0, 0, 0, .25);
  backdrop-filter: blur(1px);
}
</style>