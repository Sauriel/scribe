<template>
  <div id="toast-wrapper">
    <ScToast
      v-for="(toast, index) of toasts"
      :key="index"
      :toast="toast"
      @close="onClose"
    />
  </div>
</template>

<script setup lang="ts">
import type Toast from '~~/models/components/toast';
import { type ToastMessage } from '~~/models/components/toast';

const { $bus } = useNuxtApp();

const toasts = ref<Toast[]>([]);

onMounted(() => {
  $bus.on('toast:show', (message: ToastMessage) => {
    const timestamp = Date.now();
    toasts.value.push({
      ...message,
      timestamp
    });
    if (message.type !== 'alert') {
      setTimeout(() => removeToast(timestamp), 3000);
    }
  });
});

function onClose(toast: Toast) {
  removeToast(toast.timestamp);
}

function removeToast(timestamp: number) {
  const index = toasts.value.findIndex(toast => toast.timestamp === timestamp);
  toasts.value.splice(index, 1);
}
</script>

<style scoped>
#toast-wrapper {
  position: absolute;
  top: 10vh;
  left: 50%;
  translate: -50% 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 30vh;
  overflow-y: hidden;
  -webkit-mask-image: linear-gradient(#fff 10vh, transparent);
}
</style>