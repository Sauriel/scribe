<template>
  <ScTooltip
    tag="span"
    top
    :tooltip="tooltip"
    class="icon-badge"
  >
    <Icon :name="icon" />
    {{ text }}
  </ScTooltip>
</template>

<script setup lang="ts">
type Props = {
  icon: string;
  text: string;
  tooltip: string;
}

const props = defineProps<Props>();
</script>

<style scoped>
.icon-badge {
  display: inline-flex;
  gap: 0.5em;
  align-items: center;
  background-color: var(--color-background-600);
  border-radius: var(--border-radius);
  padding: 0 0.5em;
  font-size: 0.75em;
}
</style>