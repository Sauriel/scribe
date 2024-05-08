<template>
  <div
    class="toast"
    :class="`toast--${toast.type}`"
  >
    <Icon
      name="iconoir:hexagon"
      class="hex-icon hex-icon-hexagon"
    />
    <Icon
      :name="icon"
      class="hex-icon hex-icon-symbol"
    />
    <div class="content">
      {{ toast.message }}
    </div>
    <Icon
      v-if="hasCloseIcon"
      name="iconamoon:close-bold"
      class="close"
      @click="emit('close', toast)"
    />
  </div>
</template>

<script setup lang="ts">
import type Toast from '~~/models/components/toast';

type Props = {
  toast: Toast;
}

type Emits = {
  (e: 'close', payload: Toast): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const icon = computed(() => {
  switch (props.toast.type) {
    case 'alert':
      return 'iconamoon:close-bold';
    case 'warning':
      return 'humbleicons:exclamation';
    case 'success':
      return 'iconamoon:check-bold';
    case 'default':
    default:
      return 'mdi:information-variant';
  }
});

const hasCloseIcon = computed(() => props.toast.type === 'alert');
</script>

<style scoped>
.toast {
  --temp-color-bg-highlight: var(--color-secondary-400);
  --temp-color-bg: var(--color-secondary-500);
  display: grid;
  grid-template-areas: "icon content close";
  grid-template-columns: 4em auto 4em;
  align-items: center;
  min-width: 400px;
  padding: 1em 0;
  border-radius: var(--border-radius);
  border-left: var(--border-radius) solid var(--temp-color-bg-highlight);
  background-color: var(--temp-color-bg);
  font-size: 0.75rem;
}

.toast--alert {
  --temp-color-bg-highlight: var(--color-alert-400);
  --temp-color-bg: var(--color-alert-500);
}

.toast--warning {
  --temp-color-bg-highlight: var(--color-warning-400);
  --temp-color-bg: var(--color-warning-500);
}

.toast--success {
  --temp-color-bg-highlight: var(--color-success-400);
  --temp-color-bg: var(--color-success-500);
}

.hex-icon {
  grid-area: icon;
  justify-self: center;
  color: var(--temp-color-bg-highlight);
}

.hex-icon-hexagon {
  font-size: 3em;
}

.hex-icon-symbol {
  font-size: 2em;
}

.content {
  grid-area: content;
}

.close {
  grid-area: close;
  justify-self: center;
  font-size: 3em;
  cursor: pointer;
  color: var(--temp-color-bg-highlight);
}

.close:hover {
  color: var(--color-foreground-500)
}
</style>