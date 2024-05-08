<template>
  <div id="default-layout">
    <TheAppBar class="header" />
    <slot />
    <TheAppFooter class="footer" />
  </div>
</template>

<script setup lang="ts">
  import { useThemeStore } from '@/store/theme';

  const themeStore = useThemeStore();
  const { updateStyle } = useTheme();

  themeStore.$subscribe((_mutation, state) => updateStyle(state.mode));
</script>

<style scoped>
#default-layout {
  display: grid;
  grid-template-areas: "header" "main" "footer";
  grid-template-rows: 40px auto 30px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#default-layout > .header {
  grid-area: header;
}

#default-layout > .footer {
  grid-area: footer;
}
</style>