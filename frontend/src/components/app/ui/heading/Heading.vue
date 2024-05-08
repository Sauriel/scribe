<template>
  <header class="header" :class="{ 'header--small': small, 'header--with-info': info }">
    <slot />
    <tooltip v-if="info" position="bottom-left">
      <template #tooltip>
        {{ info }}
      </template>
      <font-awesome-icon icon="info-circle" />
    </tooltip>
  </header>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";

export default class Heading extends Vue {
  @Prop({ type: Boolean, default: false })
  private readonly small!: boolean;

  @Prop(String)
  private readonly info?: string;
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  font-size: 2em;
  font-weight: bold;
  margin: 0 0 10px;
  z-index: 1;
  text-shadow: -4px -4px 0 var(--color-background), 4px -4px 0 var(--color-background),
    -4px 4px 0 var(--color-background), 4px 4px 0 var(--color-background);

  &::before {
    content: "";
    border-bottom: 2px solid var(--color-primary);
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1px;
    z-index: -1;
  }

  &--small {
    font-weight: normal;
    font-size: 1.5em;
    text-align: center;

    &::before {
      bottom: 0.5em;
      border-bottom-color: var(--color-background--light);
    }
  }

  &--with-info {
    padding-right: 2rem;
  }

  & > .tooltip-wrapper {
    position: absolute;
    right: 0;
    font-size: 1rem;
    font-weight: normal;
    text-shadow: none;
    cursor: help;

    &:deep(.tooltip-trigger) {
      font-size: 1.5em;
    }

    &:deep(.tooltip) {
      min-width: 40ch;
    }
  }
}
</style>
