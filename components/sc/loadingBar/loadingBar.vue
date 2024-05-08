<template>
  <div class="loading-bar" />
</template>

<style scoped>
.loading-bar {
  --loading-bar-indicator-width: 25%;
  height: 1.5em;
  background-color: var(--color-primary-500);
  background-image: linear-gradient(to right, transparent, var(--color-primary-700), transparent);
  background-size: var(--loading-bar-indicator-width);
  background-repeat: no-repeat;
  border: 1px solid var(--color-background-700);
  border-radius: var(--border-radius);
  animation: loading-bar 2s infinite;
}

@keyframes loading-bar {
  0% {
    background-position: calc(0 - (var(--loading-bar-indicator-width) * 1.25));
  }
  50%, 100% {
  background-position: calc(100% + (var(--loading-bar-indicator-width) * 1.25));
  }
}
</style>