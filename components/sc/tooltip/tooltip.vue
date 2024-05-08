<template>
  <Component
    :is="tag"
    class="tooltip-wrapper"
  >
    <slot />
    <div
      class="tooltip"
      :class="{
        'tooltip--top': top,
        'tooltip--bottom': bottom,
        'tooltip--left': left,
        'tooltip--right': right,
        'tooltip--no-wrap': noWrap
      }"
    >
      <slot name="tooltip">
        {{ tooltip }}
      </slot>
    </div>
  </Component>
</template>

<script setup lang="ts">
type Props = {
  tag?: string
  tooltip?: string;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  noWrap?: boolean;
  minWidth?: string;
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'span',
  tooltip: '',
  minWidth: 'auto'
});
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
}

.tooltip-wrapper:hover .tooltip {
  display: flex;
}

.tooltip {
  --sgn: clamp(-1, (var(--j) - var(--i))/.1, 1);
  --dir: calc(var(--sgn)*(var(--j) - 2*var(--i))*180deg); /* bg direction */
  --oxy: calc(var(--i)*100%) calc(var(--j)*100%);
  --x: calc(var(--i) * -100%);
  --y: calc(var(--j) * -100%);
  --left: calc(100% - (100% * var(--i)));
  --top: calc(100% - (100% * var(--j)));
  display: none;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  border: solid 0.75em transparent;
  padding: 0.5em 1em;
  background: linear-gradient(var(--color-foreground-500) 0 0) padding-box, conic-gradient(from calc(var(--dir) - .5*90deg) at var(--oxy), var(--color-foreground-500) 90deg, transparent 0%) var(--oxy)/50% 50% no-repeat border-box;
  color: var(--color-background-500);
  filter: drop-shadow(2px 2px 5px #363636);
  transition: 0.35s filter;
  border-radius: calc(0.75em + 7px);
  position: absolute;
  transform: translate(var(--x), var(--y));
  left: calc(var(--left) + (1em * (0.5 - var(--i))));
  top: calc(var(--top) + (1em * (0.5 - var(--j))));
  z-index: 999999;
  min-width: v-bind(minWidth);
}

.tooltip--top {
  --i: 0.5;
  --j: 1;
}

.tooltip--bottom {
  --i: 0.5;
  --j: 0;
}

.tooltip--left {
  --i: 1;
  --j: 0.5;
}

.tooltip--right {
  --i: 0;
  --j: 0.5;
}

.tooltip--no-wrap {
  white-space: nowrap;
}
</style>