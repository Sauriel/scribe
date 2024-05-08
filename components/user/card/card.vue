<template>
  <div
    class="user-card"
    :class="{
      'user-card--small': small
    }"
  >
    <UserAvatar
      class="avatar"
      :width="avatarWidth"
    />
    <header class="name">
      {{ userName }}
    </header>
    <footer class="title">
      Master Scribe
    </footer>
  </div>
</template>

<script setup lang="ts">
type Props = {
  small?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  small: false
});

const { user } = useScribeUser();

const avatarWidth = computed(() => props.small ? '31px' : '100%');
const userName = computed(() => user.value?.displayName ?? 'UNKNOWN');
</script>

<style scoped>
  .user-card {
    display: grid;
    grid-template-areas: "name avatar"
                        "title avatar";
    grid-template-columns: auto 36px;
    padding: 0 1em;
    column-gap: 1em;
    transition: all var(--animation);
  }

  .user-card--small {
    grid-template-columns: auto 31px;
    column-gap: 0.5em;
  }
  .user-card--small .name {
    font-size: 1em;
  }

  .user-card--small .title {
    font-size: 0.6em;
  }

  .avatar {
    grid-area: avatar;
  }

  .name {
    grid-area: name;
    font-size: 1.2em;
    font-weight: bold;
    transition: font-size var(--animation);
  }

  .title {
    grid-area: title;
    font-size: 0.7em;
    color: var(--color-secondary-500);
    transition: font-size var(--animation);
  }
</style>