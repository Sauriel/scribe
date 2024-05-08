<template>
  <div class="floating-panel">
    <ScHeader>
      <span v-if="title">
        {{ title }}
      </span>
      <slot
        v-else
        name="header"
      />
    </ScHeader>
    <slot />
    <footer>
      <slot name="footer">
        <img
          src="@/assets/images/scribe-logo.svg"
          :alt="$t('global.app.name')"
        >
      </slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
type Props = {
  title?: string;
}

const props = defineProps<Props>();
</script>

<style scoped>
.floating-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 720px;
  padding: 2rem 2rem 60px;
  border-radius: var(--border-radius);
  background-color: var(--color-background-500);
  position: relative;
}

.floating-panel footer {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}

.floating-panel footer > img {
  height: 100px;
}
</style>