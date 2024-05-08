<template>
  <div class="tooltip-wrapper" @mouseenter="show = true" @mouseleave="show = false">
    <div class="tooltip-trigger">
      <slot />
    </div>
    <div
      class="tooltip"
      :class="{
        'tooltip--show': show,
        'tooltip--left': isLeft,
        'tooltip--right': isRight,
        'tooltip--top': isTop,
        'tooltip--bottom': isBottom,
        'tooltip--bottom-left': isBottomLeft,
      }"
    >
      <slot name="tooltip" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";

export declare type TooltipPosition = "left" | "right" | "top" | "bottom" | "bottom-left";

export default class Tooltip extends Vue {
  @Prop({ type: String, default: "top" })
  private readonly position!: TooltipPosition;

  private get isLeft(): boolean {
    return this.position === "left";
  }

  private get isRight(): boolean {
    return this.position === "right";
  }

  private get isTop(): boolean {
    return this.position === "top";
  }

  private get isBottom(): boolean {
    return this.position === "bottom";
  }

  private get isBottomLeft(): boolean {
    return this.position === "bottom-left";
  }

  private show = false;
}
</script>

<style lang="scss" scoped>
.tooltip-wrapper {
  display: inline-block;
  position: relative;
}

.tooltip {
  position: absolute;
  display: flex;
  opacity: 0;
  padding: 5px 10px;
  border: 2px solid var(--color-background--dark);
  border-radius: 8px;
  min-height: 30px;
  z-index: 100;
  align-items: center;
  user-select: none;
  pointer-events: none;
  transition: opacity 0.4s ease-in-out;

  &::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    display: block;
    height: 20px;
    width: 20px;
    border: 10px solid transparent;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: var(--color-background--dark);
    opacity: 0.75;
    z-index: -1;
  }

  &--show {
    opacity: 1;
  }

  &--left {
    top: 50%;
    right: calc(100% + 10px);
    transform: translateY(-50%);
    justify-content: flex-end;

    &::after {
      right: -20px;
      top: 50%;
      margin-top: -10px;
      border-left-color: var(--color-background--dark);
    }
  }

  &--right {
    top: 50%;
    left: calc(100% + 10px);
    transform: translateY(-50%);
    justify-content: flex-start;

    &::after {
      left: -20px;
      top: 50%;
      margin-top: -10px;
      border-right-color: var(--color-background--dark);
    }
  }

  &--top {
    left: 50%;
    bottom: calc(100% + 10px);
    transform: translateX(-50%);
    justify-content: center;

    &::after {
      bottom: -20px;
      left: 50%;
      margin-left: -10px;
      border-top-color: var(--color-background--dark);
    }
  }

  &--bottom {
    left: 50%;
    top: calc(100% + 10px);
    transform: translateX(-50%);
    justify-content: center;

    &::after {
      top: -20px;
      left: 50%;
      margin-left: -10px;
      border-bottom-color: var(--color-background--dark);
    }
  }

  &--bottom-left {
    top: 0;
    right: calc(100% + 10px);
    justify-content: flex-end;

    &::after {
      right: -20px;
      top: var(--border-radius);
      border-left-color: var(--color-background--dark);
    }
  }
}
</style>
