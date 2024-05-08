<template>
  <main class="main">
    <ClientOnly>
      <div class="main-content">
        <EditorPages />
      </div>
      <div class="sidebar-left">
        <EditorSidebarMain />
      </div>
      <div class="sidebar-right">
        <EditorSidebarDetails />
      </div>
    </ClientOnly>
  </main>
</template>

<script setup lang="ts"></script>

<style scoped>
.main {
  grid-area: main;
  display: grid;
  grid-template-areas: "sidebar-left content sidebar-right";
  grid-template-columns: auto 1fr auto;
}

.sidebar-left {
  grid-area: sidebar-left;
  height: calc(100vh - 40px - 30px);
}

.main-content {
  display: flex;
  grid-area: content;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 40px - 30px);
  overflow-y: auto;
}

.main-content::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.sidebar-right {
  grid-area: sidebar-right;
  height: calc(100vh - 40px - 30px);
}
</style>