<template>
  <span class="loading-points" />
</template>

<style scoped>
.loading-points,
.loading-points::before,
.loading-points::after {
  display: inline-block;
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 50%;
  background-color: var(--dot-color--inactive);
  animation: loading-points 1s infinite alternate;
}

.loading-points {
  --dot-size: 6px;
  --dot-color: var(--color-primary-500);
  --dot-color--inactive: var(--color-foreground-500);
  position: relative;
  margin: 0 calc(var(--dot-size) * 1.5);
  animation-delay: 0.5s;
}

.loading-points::before,
.loading-points::after {
  content: "";
  position: absolute;
  top: 0;
}

.loading-points::before {
  left: calc(var(--dot-size) * -1.5);
  animation-delay: 0s;
}

.loading-points::after {
  left: calc(var(--dot-size) * 1.5);
  animation-delay: 1s;
}

@keyframes loading-points {
  0% {
    background-color: var(--dot-color);
  }
  50%, 100% {
    background-color: var(--dot-color--inactive);
  }
}
</style>