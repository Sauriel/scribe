<template>
  <div
    class="tooltip-wrapper"
    @mouseenter="show = true"
    @mouseleave="show = false"
  >
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
        'tooltip--bottom': isBottom
      }"
    >
      <slot name="tooltip" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

export declare type TooltipPosition = "left" | "right" | "top" | "bottom";

@Component
export default class Tooltip extends Vue {
  @Prop({ type: String, default: "top" })
  readonly position!: TooltipPosition;

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

  private show = false;
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

.tooltip-wrapper {
  display: inline-box;
  position: relative;
}

.tooltip {
  position: absolute;
  display: flex;
  opacity: 0;
  background-color: transparentize($backgroundDark, .25);
  padding: 5px 10px;
  border: 2px solid $backgroundDark;
  border-radius: 8px;
  min-height: 30px;
  z-index: 100;
  align-items: center;
  user-select: none;
  pointer-events: none;
  transition: opacity .4s ease-in-out;

  &::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    display: block;
    height: 20px;
    width: 20px;
    border: 10px solid transparent;
  }

  &--show {
    opacity: 1;
  }

  &--left {
    top: 50%;
    right: calc(100% + 10px);
    transform: translateY(-50%);
    justify-content: flex-end;

    &::before {
      right: -20px;
      top: 50%;
      margin-top: -10px;
      border-left-color: $backgroundDark;
    }
  }

  &--right {
    top: 50%;
    left: calc(100% + 10px);
    transform: translateY(-50%);
    justify-content: flex-start;

    &::before {
      left: -20px;
      top: 50%;
      margin-top: -10px;
      border-right-color: $backgroundDark;
    }
  }

  &--top {
    left: 50%;
    bottom: calc(100% + 10px);
    transform: translateX(-50%);
    justify-content: center;

    &::before {
      bottom: -20px;
      left: 50%;
      margin-left: -10px;
      border-top-color: $backgroundDark;
    }
  }

  &--bottom {
    left: 50%;
    top: calc(100% + 10px);
    transform: translateX(-50%);
    justify-content: center;

    &::before {
      top: -20px;
      left: 50%;
      margin-left: -10px;
      border-bottom-color: $backgroundDark;
    }
  }
}
</style>
