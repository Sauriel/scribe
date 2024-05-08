<template>
  <img
    class="user-avatar"
    src="/images/avatar.png"
    alt="Sauriel"
  >
</template>

<script setup lang="ts">
  type Props = {
    height?: string;
    width?: string;
  }

const props = withDefaults(defineProps<Props>(), {
  height: 'auto',
  width: 'auto',
});
</script>

<style scoped>
.user-avatar {
  height: v-bind(height);
  width: v-bind(width);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid white;
  transition: all var(--animation);
}
</style>