<template>
  <div
    class="user-menu-wrapper"
    :class="{
      'user-menu-wrapper--expanded': expanded
    }"
  >
    <div
      class="user-menu"
      @mouseleave="onCardMouseLeave"
    >
      <UserCard
        class="user-card"
        :small="!expanded"
        @mouseenter="onCardMouseEnter"
      />
      <ul class="list">
        <li
          class="menu-entry"
          @click="onProfileClick"
        >
          <Icon name="gg:profile" />
          {{ $t('app-bar.actions.user.profile') }}
        </li>
        <li class="menu-entry">
          <Icon name="ion:settings-sharp" />
          {{ $t('app-bar.actions.user.settings') }}
        </li>
        <li class="menu-entry">
          <Icon name="ic:round-help" />
          {{ $t('app-bar.actions.user.help') }}
        </li>
        <li
          class="menu-entry"
          @click="onLogoutClick"
        >
          <Icon name="majesticons:logout-half-circle-line" />
          {{ $t('app-bar.actions.user.logout') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useScribeUser();
const router = useRouter();
const { signOut } = useAuth();

const expanded = ref(false);

function onCardMouseEnter() {
  expanded.value = true;
}

function onCardMouseLeave() {
  expanded.value = false;
}

function onLogoutClick() {
  signOut();
}

function onProfileClick() {
  router.push(`/${user.value?.url}/profile`);
}
</script>

<style scoped>
.user-menu-wrapper {
  position: relative;
  z-index: 999999;
}
.user-menu-wrapper--expanded .user-menu {
  padding: 0.5rem 0;
  background-color: var(--color-background-500);
  border-color: var(--color-background-700);
}

.user-menu-wrapper--expanded .list {
  max-height: 100vh;
}

.user-menu-wrapper--expanded .user-card {
  margin-bottom: 1rem;
}

.user-menu-wrapper--expanded .user-card::after {
  opacity: 1;
}

.list {
  max-height: 0;
  overflow: hidden;
  transition: all var(--animation);
}

.user-menu {
  min-width: 150px;
  font-size: 0.9rem;
  border-radius: var(--border-radius);
  transition: all var(--animation);
  border: 1px solid transparent;
}

.user-card {
  margin-bottom: 1rem;
  position: relative;
  transition: all var(--animation);
}

.user-card::after {
  content: "";
  opacity: 0;
  position: absolute;
  left: 0.5em;
  right: 0.5em;
  bottom: -0.5rem;
  border-bottom: 1px solid var(--color-foreground-900);
  transition: opacity var(--animation);
}

.menu-entry {
  display: flex;
  gap: 0.75ch;
  padding: 0.2em 1em;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.menu-entry:hover {
  background-color: var(--color-background-400);
}
</style>