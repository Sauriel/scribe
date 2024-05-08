<template>
  <div class="test-wrapper">
    <div class="test-field">
      <ScCheckbox v-model="test">
        Lorem Ipsum
      </ScCheckbox>
      <ScBtn @click="clickTest">
        TEST
      </ScBtn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ToastType } from '~~/models/components/toast';

const test = ref(true);

const { $bus } = useNuxtApp();

function clickTest() {
  $bus.emit('toast:show', {
    type: getRandomElement<ToastType>(['default', 'alert', 'warning', 'success']),
    message: 'Hello World!'
  });
}
</script>

<style scoped>
.test-wrapper {
  display: flex;
  grid-area: main;
  align-items: center;
  justify-content: center;
}

.test-field {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 720px;
  padding: 2rem;
  border-radius: var(--border-radius);
  background-color: var(--color-background-500);
}
</style>