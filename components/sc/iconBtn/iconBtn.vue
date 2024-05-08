<template>
  <button
    class="icon-btn"
    :class="{
      'secondary': secondary,
      'small': small,
      'big': big,
      'colored': color,
      'inverted': invertHoverColor
    }"
    :disabled="disabled"
  >
    <Icon :name="icon" />
  </button>
</template>

<script setup lang="ts">
type Props = {
  icon: string;
  secondary?: boolean;
  disabled?: boolean;
  small?: boolean;
  big?: boolean;
  color?: string;
  invertHoverColor?: boolean;
}

const props = defineProps<Props>();
</script>

<style scoped>
.icon-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-primary-500);
  border: 1px solid var(--color-primary-500);
  color: var(--color-foreground-500);
  padding: 0;
  color: inherit;
  font-size: 1.6em;
  height: 1.8em;
  aspect-ratio: 1/1;
  border-radius: 50%;
  cursor: pointer;
}

.icon-btn.small {
  font-size: 1.2em;
}

.icon-btn.big {
  font-size: 2em;
}

.icon-btn:hover {
  background-color: var(--color-primary-600);
}

.icon-btn.secondary {
  color: var(--color, inherit);
  background-color: var(--color-background-700);
  border: 1px solid var(--color-background-700);
}

.icon-btn.secondary:hover {
  background-color: var(--color, var(--color-background-600));
}

.icon-btn.colored {
  color: v-bind("props.color");
}

.icon-btn.colored:hover {
  color: var(--color-foreground-500);
  background-color: v-bind("props.color");
}

.icon-btn.colored.inverted:hover {
  color: var(--color-background-500);
}

.icon-btn:disabled {
  cursor: not-allowed;
  background-color: var(--color-foreground-900);
  border: 1px solid var(--color-foreground-900);
  color: var(--color-foreground-700);
}
</style>