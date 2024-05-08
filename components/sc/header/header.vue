<template>
  <header class="sc-header sc-h1">
    <slot />
  </header>
</template>

<style scoped>
.sc-header {
  position: relative;
  margin: 0 0 10px;
  z-index: 1;
}

.sc-header::before {
  content: "";
  border-bottom: 2px solid var(--color-primary-500);
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1px;
  z-index: -1;
}

.sc-header.sc-h1 {
  font-size: 2rem;
  font-weight: bold;
}
</style>