<template>
  <button
    class="btn"
    :class="{
      secondary: secondary,
      outlined: outline,
      block: fullWidth,
      alert: alert,
      tile: tile,
      small: small,
    }"
    :disabled="disabled"
  >
    <font-awesome-icon v-if="icon" :icon="icon" />
    <strong v-if="$slots.default" class="btn-strong">
      <slot />
    </strong>
  </button>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";

export default class Btn extends Vue {
  @Prop(String)
  private readonly icon?: string;

  @Prop({ type: Boolean, default: false })
  private readonly disabled!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly outline!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly secondary!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly fullWidth!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly alert!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly tile!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly small!: boolean;
}
</script>

<style lang="scss" scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 auto;
  margin: 10px;
  min-height: 30px;
  min-width: 30px;
  background-color: var(--color-primary);
  border: 1px solid var(--color-primary--dark);
  color: var(--color-foreground);
  border-radius: var(--border-radius);
  padding: 10px 20px;
  cursor: pointer;
  background-position: center;
  transition: background 0.8s;

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-primary--light)
      radial-gradient(circle, transparent 1%, var(--color-primary--light) 1%) center/15000%;
  }

  &:active {
    background-color: var(--color-primary);
    background-size: 100%;
    transition: background 0s;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: var(--color-background--light);
    border-color: var(--color-background--dark);

    &:hover {
      background-color: var(--color-background--light);
      border-color: var(--color-background--dark);
    }
  }

  &.secondary {
    background-color: var(--color-secondary);
    border-color: var(--color-secondary--dark);

    &:hover {
      border-color: var(--color-secondary--dark);
      background: var(--color-secondary--light)
        radial-gradient(circle, transparent 1%, var(--color-secondary--light) 1%) center/15000%;
    }

    &:active {
      background-color: var(--color-secondary);
      background-size: 100%;
      transition: background 0s;
    }
  }

  &.outlined {
    position: relative;
    background: transparent;
    border-color: var(--color-foreground);
    transition: none;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      opacity: 0;
    }

    &:hover {
      border-color: var(--color-foreground--dark);
      background-color: transparent;

      &::before {
        opacity: 0.1;
        border-radius: var(--border-radius);
        background-color: var(--color-foreground--light);
      }
    }

    &:active {
      background-color: transparent;

      &::before {
        opacity: 0.2;
      }
    }
  }

  &.block {
    width: 100%;
    margin: 10px 0;
  }

  &.small {
    font-size: 0.8rem;
    padding: 0px;
  }

  &.alert {
    background-color: var(--color-alert);
    border-color: var(--color-alert--dark);

    &:hover {
      background-color: var(--color-alert--light);
      border-color: var(--color-alert);
    }

    &.outlined {
      background: transparent;
      border-color: var(--color-alert);
      color: var(--color-alert--dark);

      &::before {
        background-color: var(--color-alert--light);
      }
    }
  }

  &.tile {
    border-radius: 0;
  }

  &:focus,
  &:active {
    outline: none;
  }

  > svg:not(:last-child) {
    margin-right: 5px;
  }
}
</style>
