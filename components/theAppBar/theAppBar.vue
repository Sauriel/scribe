<template>
  <div id="app-bar">
    <header id="app-info">
      <NuxtLink
        to="/"
        class="no-link"
      >
        <img
          src="@/assets/images/scribe-logo.svg"
          :alt="$t('global.app.name')"
          class="app-logo"
        >
      </NuxtLink>
    </header>
    <div class="menu">
      <MenuDropdown
        label="File"
        :entries="fileMenu"
      />
      <MenuDropdown
        label="Edit"
        :entries="editMenu"
        disabled
      />
      <MenuDropdown
        label="Page"
        :entries="pageMenu"
        disabled
      />
      <MenuDropdown
        label="Document"
        :entries="documentMenu"
        disabled
      />
      <MenuDropdown
        label="View"
        :entries="viewMenu"
      />
    </div>
    <div class="actions">
      <div class="user-actions">
        <UserMenu v-if="user" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuEntry } from '../global/menu/dropdown/dropdown.vue';

const router = useRouter();

const { user } = useScribeUser();

const fileMenu: MenuEntry[] = [
  {
    label: 'New',
    link: '/doc/create',
    shortcut: 'Ctrl+K'
  },
  {
    label: 'Open',
    shortcut: 'Ctrl+O'
  },
  {
    label: 'Save',
    disabled: true,
    shortcut: 'Ctrl+S'
  },
  {
    label: 'Import'
  },
  {
    label: 'Export',
    disabled: true
  },
];

const editMenu: MenuEntry[] = [
  {
    label: 'Undo',
    shortcut: 'Ctrl+Z'
  },
  {
    label: 'Redo',
    shortcut: 'Ctrl+Y'
  },
];

const documentMenu: MenuEntry[] = [
  {
    label: 'Change defaults'
  },
];

const pageMenu: MenuEntry[] = [
  {
    label: 'Change background'
  },
  {
    label: 'Background images'
  },
];

const viewMenu: MenuEntry[] = [
  {
    label: 'Home',
    link: '/'
  },
  {
    label: 'Document editor',
    link: '/editor'
  },
  {
    label: 'Library',
    link: '/library'
  },
  {
    label: 'Test',
    link: '/test'
  },
];

onMounted(() => {
  document.addEventListener('keyup', keyupHandler);
  document.addEventListener('keydown', keydownHandler);
});

onUnmounted(() => {
  document.removeEventListener('keyup', keyupHandler);
  document.removeEventListener('keydown', keydownHandler);

});

let keyPressed: string | null = null; // Fix for Mac OS, because CMD+Z is catched by the browser

function keydownHandler(event: KeyboardEvent) {
  const ctrlOrCmd = event.ctrlKey || event.metaKey;
  if (ctrlOrCmd) {
    keyPressed = event.key;
  }
}

function keyupHandler(event: KeyboardEvent) {
  event.stopImmediatePropagation();
  const ctrlOrCmd = event.ctrlKey || event.metaKey;
  if (ctrlOrCmd && event.key === keyPressed) {
    const pressed = `Ctrl+${event.key}`;
    console.log(`User pressed ${pressed}`);
    const allMenuEntries: MenuEntry[] = [
      ...fileMenu,
      ...editMenu,
      ...documentMenu,
      ...pageMenu,
      ...viewMenu
    ];
    const menuEntry = allMenuEntries.find(entry => entry.shortcut?.toLocaleLowerCase() === pressed.toLocaleLowerCase());
    if (menuEntry) {
      if (menuEntry.link) {
        router.push(menuEntry.link);
      }
    }
  }
  keyPressed = null;
}
</script>

<style scoped>
#app-bar {
  display: grid;
  grid-template-areas: "logo menu actions";
  grid-template-columns: 50px auto auto;
  grid-template-rows: calc(40px - 0.5rem - 1px); /* height - 2*padding - border-bottom */
  height: 40px;
  border-bottom: 1px solid var(--color-background-700);
  background-color: var(--color-background-500);
  padding: 0.25rem;
}

#app-info {
  grid-area: logo;
  padding-left: 0.5rem;
  padding-right: 0.5em;
  z-index: 999999;
  flex-grow: 0;
}

.app-logo {
  width: auto;
  height: 45px;
}

.menu {
  grid-area: menu;
  display: flex;
  padding: 0 0.5em;
}

.menu-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2em 0.75em 0;
  color: var(--color-foreground-500);
  text-decoration: none;
  border-radius: var(--border-radius);
  font-size: 1.2em;
}

.menu-link:hover {
  background-color: var(--color-background-400);
}

.actions {
  grid-area: actions;
  display: flex;
  justify-content: flex-end;
  padding: 0 0.25rem;
}
</style>