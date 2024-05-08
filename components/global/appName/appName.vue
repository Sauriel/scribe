<template>
  <span class="app-name">
    <NuxtLink
      v-if="to"
      v-slot="{ href, navigate }"
      :to="to"
      custom
    >
      <strong
        :href="href"
        class="app-name-base app-name-base--link"
        @click="navigate"
      >
        {{ $t('global.app.name') }}
      </strong>
    </NuxtLink>
    <strong
      v-else
      class="app-name-base"
    >
      {{ $t('global.app.name') }}
    </strong>
    <span class="app-name-type">{{ appInfo.type }}</span>
    <span class="app-name-version">{{ appInfo.version }}</span>
  </span>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

type Props = {
  to?: string | RouteLocationRaw;
}

const appInfo = ref({
  type: '',
  version: 'v1.0.0-alpha'
});

const props = defineProps<Props>();
</script>

<style scoped>
.app-name {
  font-size: 2rem;
}

.app-name-base {
  font-weight: 700;
}

.app-name-base--link {
  cursor: pointer;
}

.app-name-type {
  font-weight: 200;
}

.app-name-version {
  padding-left: 0.25em;
  color: var(--color-foreground-700);
  font-size: 0.65em;
  font-weight: 200;
  cursor: help;
}
</style>