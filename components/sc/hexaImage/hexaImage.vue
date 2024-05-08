<template>
  <div class="hexa-image" />
</template>

<script setup lang="ts">
type Props = {
  src: string;
  alt: string;
}

const props = defineProps<Props>();

const srcUrl = computed<string>(() => `url(${props.src})`);
</script>

<style scoped>
.hexa-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  aspect-ratio: 88.22/100;
  mask-image: url(@/assets/images/hexa-mask.svg);
  background-image: url(@/assets/images/hexa-border-for-mask.svg), v-bind(srcUrl);
  background-repeat: no-repeat, no-repeat;
  background-size: cover, cover;
  background-position: center, center;
}
</style>