<template>
  <div
    class="menu-dropdown-wrapper"
    :class="{ 'disabled': disabled }"
  >
    <div class="menu-trigger">
      {{ label }}
    </div>
    <ClientOnly>
      <div
        v-if="!disabled"
        class="menu-dropdown"
      >
        <ul class="list">
          <li
            v-for="(entry, index) of entries"
            :key="index"
            class="menu-entry"
            :class="{ 'disabled': entry.disabled }"
          >
            <NuxtLink
              v-if="entry.link"
              :to="entry.link"
            >
              {{ entry.label }}
              <span
                v-if="entry.shortcut"
                class="shortcut"
              >
                {{ entry.shortcut }}
              </span>
            </NuxtLink>
            <a
              v-else
              @click="entry.action"
            >
              {{ entry.label }}
              <span
                v-if="entry.shortcut"
                class="shortcut"
              >
                {{ entry.shortcut }}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
export type MenuEntry = {
  label: string;
  disabled?: boolean;
  link?: string;
  action?: () => void;
  shortcut?: string;
}

type Props = {
  label: string;
  disabled?: boolean;
  entries: MenuEntry[];
}

const props = defineProps<Props>();
</script>

<style scoped>
.menu-dropdown-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: var(--border-radius);
}

.menu-dropdown-wrapper:not(.disabled):hover {
  background-color: var(--color-background-400);
}

.menu-dropdown-wrapper:not(.disabled):hover .menu-dropdown {
  display: block;
}

.menu-dropdown-wrapper.disabled .menu-trigger  {
  cursor: default;
  color: var(--color-foreground-800);
}

.menu-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2em 0.75em 0;
  color: var(--color-foreground-500);
  border-radius: var(--border-radius);
  cursor: pointer;
}
.menu-dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--color-background-500);
  padding: 4px 0 0.5rem;
  border-radius: var(--border-radius);
  z-index: 999999;
  border: 1px solid var(--color-background-700);
  min-width: 10ch;
}

.menu-entry > a {
  display: flex;
  justify-content: space-between;
  gap: 3ch;
  padding: 0.25em 1em;
  border-radius: var(--border-radius);
  cursor: pointer;
  color: var(--color-foreground-500);
  text-decoration: none;
  white-space: nowrap;
}

.menu-entry > a:hover {
  background-color: var(--color-background-400);
}

.menu-entry > a .shortcut {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-background-600);
  border-radius: var(--border-radius);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  padding: 0.2em 0.5em;
  margin-right: -1em;
}

.menu-entry.disabled > a {
  cursor: default;
  color: var(--color-foreground-800);
  pointer-events: none;
}
</style>