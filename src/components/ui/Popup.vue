<template>
  <div class="popup-wrapper">
    <div class="popup-trigger" @click.stop="togglePopup">
      <slot />
    </div>
    <div
      class="popup"
      :class="{
        'popup--show': showPopup,
        'popup--left': isLeft,
        'popup--right': isRight,
        'popup--top': isTop,
        'popup--bottom': isBottom
      }"
      ref="popup"
    >
      <div class="popup-header" v-if="hasHeaderSlot">
        <slot name="header" />
      </div>
      <slot name="popup" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

export declare type PopupPosition = "left" | "right" | "top" | "bottom";

@Component
export default class Popup extends Vue {
  @Prop({ type: String, default: "top" })
  readonly position!: PopupPosition;

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

  private get hasHeaderSlot() {
    return !!this.$slots.header
  }

  private showPopup = false;

  mounted() {
    this.repositionPopover();
  }

  updated() {
    this.repositionPopover();
  }

  private repositionPopover() {
    const popup = this.$refs.popup as Element;
    if (popup) {
      const page = popup.closest(".page");
      if (page) {
        const pageRect = page.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        if (popupRect.width > 0 && popupRect.height > 0) {
          if (popup.classList.contains("popup--top") && popupRect.top < pageRect.top) {
            popup.classList.remove("popup--top");
            popup.classList.add("popup--bottom");
            this.repositionPopoverHorizontal(popup, popupRect, pageRect);
          } else if (popup.classList.contains("popup--bottom") && popupRect.bottom > pageRect.bottom) {
            popup.classList.remove("popup--bottom");
            popup.classList.add("popup--top");
            this.repositionPopoverHorizontal(popup, popupRect, pageRect);
          } else if (popup.classList.contains("popup--left") && popupRect.left < pageRect.left) {
            popup.classList.remove("popup--left");
            popup.classList.add("popup--right");
            this.repositionPopoverVertical(popup, popupRect, pageRect);
          } else if (popup.classList.contains("popup--right") && popupRect.right > pageRect.right) {
            popup.classList.remove("popup--right");
            popup.classList.add("popup--left");
            this.repositionPopoverVertical(popup, popupRect, pageRect);
          } else {
            this.repositionPopoverHorizontal(popup, popupRect, pageRect);
            this.repositionPopoverVertical(popup, popupRect, pageRect);
          }
        }
      }
    }
  }

  private repositionPopoverHorizontal(popup: Element, popupRect: DOMRect, pageRect: DOMRect) {
    if (popupRect.left < pageRect.left) {
      const difference = Math.ceil(pageRect.left - popupRect.left);
      const computedStyle = window.getComputedStyle(popup);
      const left = computedStyle.left;
      if (left) {
      // @ts-ignore
        popup.style.left = "calc(" + left + " + " + difference + "px + 20px)"
      }
    } else if (popupRect.right > pageRect.right) {
      const difference = Math.ceil(popupRect.right - pageRect.right);
      const computedStyle = window.getComputedStyle(popup);
      const left = computedStyle.left;
      if (left) {
      // @ts-ignore
        popup.style.left = "calc(" + left + " - " + difference + "px - 20px)"
      }
    }
  }

  private repositionPopoverVertical(popup: Element, popupRect: DOMRect, pageRect: DOMRect) {
    if (popupRect.top < pageRect.top) {
      const difference = Math.ceil(pageRect.top - popupRect.top);
      const computedStyle = window.getComputedStyle(popup);
      const top = computedStyle.top;
      if (top) {
      // @ts-ignore
        popup.style.top = "calc(" + top + " + " + difference + "px + 20px)"
      }
    } else if (popupRect.bottom > pageRect.bottom) {
      const difference = Math.ceil(popupRect.bottom - pageRect.bottom);
      const computedStyle = window.getComputedStyle(popup);
      const top = computedStyle.top;
      if (top) {
      // @ts-ignore
        popup.style.top = "calc(" + top + " - " + difference + "px - 20px)"
      }
    }
  }

  public togglePopup() {
    if (this.showPopup) {
      this.hide();
    } else {
      this.show();
    }
  }

  public show() {
    this.showPopup = true;
    const div = document.createElement("div");
    div.id = "popup-backdrop";
    document.body.appendChild(div);
    div.addEventListener("click", this.togglePopup);
  }

  public hide() {
    this.showPopup = false;
    const div = document.getElementById("popup-backdrop");
    if (div) {
      div.remove();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

.popup-wrapper {
  display: inline-block;
  position: relative;
}

.popup {
  display: none;
  font-family: 'Fira Sans', sans-serif;
  color: $foreground;
  font-size: initial;
  position: absolute;
  opacity: 0;
  background-color: $background;
  padding: 5px 10px;
  border: 1px solid $backgroundDark;
  border-radius: 8px;
  min-height: 30px;
  z-index: 300;
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
    display: block;
    opacity: 1;
  }

  &--left {
    top: 50%;
    right: calc(100% + 10px);
    transform: translateY(-50%);

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

    &::before {
      top: -20px;
      left: 50%;
      margin-left: -10px;
      border-bottom-color: $backgroundDark;
    }
  }

  &-trigger {
    z-index: 100;
  }

  &-header {
    margin: -6px -11px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $foreground;
    padding: 5px 10px;
    border: 1px solid $backgroundDark;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    color: $background;
    font-size: .7rem;
    text-transform: uppercase;
    user-select: none;
    pointer-events: none;
  }
}
</style>
