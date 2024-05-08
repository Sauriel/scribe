<template>
  <span class="marquee">
    <span
      ref="slot"
      class="text"
    >
      <slot />
    </span>
  </span>
</template>

<script setup lang="ts">
type Props = {
  width: number;
  speed?: number;
  delay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  speed: 2,
  delay: 0.5
});

const slot = ref<HTMLSpanElement>();

const moveDistance = computed(() => Math.max(slot.value.getBoundingClientRect().width - props.width, 0));
const moveDuration = computed(() => moveDistance.value / 100 * props.speed);
</script>

<style scoped>
.marquee {
  display: inline-block;
  width: calc(v-bind(width) * 1px);
  overflow: hidden;
}

.text {
  --speed: calc(v-bind(moveDuration) * 1s);
  --delay: calc(v-bind(delay) * 1s);
  --distance: calc(v-bind(moveDistance) * -1px);
  display: inline-block;
  white-space: nowrap;
}

.text:hover {
  animation: marquee var(--speed) var(--delay) ease-in-out infinite;
  animation-direction: alternate;
}

@keyframes marquee {
  0%, 10% {
    transform: translateX(0);
  }
  90%, 100% {
    transform: translateX(var(--distance));
  }
}
</style>