<template>
  <details
    class="sc-details"
    :open="!!open"
  >
    <summary class="sc-details-header">
      <Icon
        name="charm:chevron-right"
        class="expand-icon"
      />
      <header>{{ header }}</header>
    </summary>
    <slot />
  </details>
</template>

<script setup lang="ts">
  type Props = {
    header: string;
    open?: boolean
  }

  const props = defineProps<Props>();
</script>

<style scoped>
.sc-details {
  flex: 0 0 auto;
  width: 100%;
}

.sc-details-header {
  list-style: none;
  cursor: pointer;
  background-color: var(--color-background-500);
  padding: 0.2em;
  height: 22px;
  text-transform: uppercase;
  display: flex;
  gap: 0.5em;
}

.expand-icon {
  transition: transform var(--animation);
}
.sc-details[open] .expand-icon {
  transform: rotate(90deg);
}
</style>