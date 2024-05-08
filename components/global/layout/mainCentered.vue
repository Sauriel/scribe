<template>
  <main class="main">
    <slot />
  </main>
</template>

<style scoped>
.main {
  display: flex;
  grid-area: main;
  align-items: center;
  justify-content: center;
}
</style>