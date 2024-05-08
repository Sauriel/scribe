<template>
  <article
    class="showcase-entry"
    :class="{
      'masterpiece': masterpiece
    }"
  >
    <footer class="footer">
      <div class="info">
        <ScIconBadge
          icon="mdi:heart"
          text="2"
          min-width="200px"
          :tooltip="$t('profile.showcase.entry.footer.favorite', { count: 2 })"
        />
        <ScIconBadge
          icon="mdi:comment"
          text="26"
          min-width="200px"
          :tooltip="$t('profile.showcase.entry.footer.comments', { count: 26 })"
        />
        <ScIconBadge
          icon="ri:share-line"
          text="136"
          min-width="200px"
          :tooltip="$t('profile.showcase.entry.footer.share', { count: 136 })"
        />
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
type Props = {
  masterpiece?: boolean;
}

// type Emits = {
//   (e: 'update', payload: string): void;
// }

const props = defineProps<Props>();
// const emit = defineEmits<Emits>();
</script>

<style scoped>
.showcase-entry {
  display: flex;
  flex-direction: column-reverse;
  aspect-ratio: 1;
  background-color: var(--color-background-800);
  border-radius: var(--border-radius);
  background-image: url(/images/showcase_cover.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-size var(--animation);
  cursor: pointer;
  border: 1px solid var(--color-background-800);
}

.showcase-entry:hover {
  border-color: var(--color-primary-500);
}

.showcase-entry.masterpiece {
  grid-area: masterpiece;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-background-700);
  padding: 0.25rem;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}

.footer .info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>