<template>
  <LayoutMainCentered>
    <ScFloatingPanel>
      <template #header>
        <span>{{ $t('welcome.header') }}</span>
        <AppName />
      </template>
      <div>
        <WelcomeVisualQuickStart />
        <div class="show-welcome">
          <ScCheckbox v-model="showWelcome">
            {{ $t('welcome.show') }}
          </ScCheckbox>
        </div>
      </div>
    </ScFloatingPanel>
  </LayoutMainCentered>
</template>

<script setup lang="ts">
const showWelcome = ref(true);
</script>

<style scoped>
.show-welcome {
  display: flex;
  justify-content: flex-end;
  margin-top: 1em;
  font-size: 0.75rem;
}
</style>