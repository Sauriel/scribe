<template>
  <ul
    v-if="visible"
    class="context-menu"
    :class="{
      'context-menu--right': right,
      'context-menu--no-wrap': noWrap,
    }"
    :style="style"
    v-click-outside="onClickOutside"
  >
    <li
      v-for="(entry, index) of items"
      :key="'cm-' + index"
      :class="[
        {
          seperator: entry.seperator,
          disabled: entry.disabled,
          dangerous: entry.dangerous,
        },
        entry.class,
      ]"
      @click="onClick(entry)"
    >
      <font-awesome-icon v-if="entry.icon && !entry.icon2" :icon="entry.icon" />
      <font-awesome-layers v-if="entry.icon && entry.icon2">
        <font-awesome-icon :icon="entry.icon" />
        <font-awesome-icon :icon="entry.icon2" />
      </font-awesome-layers>
      <span v-if="entry.label.length > 0">
        {{ $t(entry.label) }}
      </span>
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
// @ts-ignore
import vClickOutside from "click-outside-vue3";
import emitter from "@/emitter";
import { CONTEXT_MENU_SHOW_EVENT_NAME, ContextMenuShowEvent } from "@/events/contextmenu";

export interface ContextMenuConfig {
  entries: ContextMenuEntry[];
  alignRight?: boolean;
  width?: string | number;
  noWrap?: boolean;
  mousePosition: Position;
}

export interface Position {
  x: number;
  y: number;
}

export function SEPERATOR(label?: string): ContextMenuEntry {
  return {
    label: label ? label : "",
    seperator: true,
  };
}

export interface ContextMenuEntry {
  label: string;
  icon?: string | string[];
  icon2?: string | string[];
  class?: string;
  seperator?: boolean;
  disabled?: boolean;
  dangerous?: boolean;
  action?: () => void;
}

@Options({
  directives: {
    clickOutside: vClickOutside.directive,
  },
})
export default class ContextMenu extends Vue {
  private items: ContextMenuEntry[] = [];
  private right = false;
  private width: string | number = "auto";
  private noWrap = false;
  private visible = false;
  private position: Position = {
    x: 0,
    y: 0,
  };

  created() {
    emitter.$on(CONTEXT_MENU_SHOW_EVENT_NAME, (event: ContextMenuShowEvent) => {
      this.hide();
      this.items = event.payload.entries;
      this.right = !!event.payload.alignRight;
      this.width = event.payload.width ? event.payload.width : "auto";
      this.noWrap = !!event.payload.noWrap;
      this.position.x = event.payload.mousePosition.x;
      this.position.y = event.payload.mousePosition.y;
      this.show();
    });
  }

  private get style(): Record<string, string> {
    return {
      left: this.position.x + "px",
      top: this.position.y + "px",
      width: typeof this.width === "number" ? this.width + "px" : this.width,
    };
  }

  public show() {
    this.visible = true;
  }

  public hide() {
    this.visible = false;
  }

  private onClickOutside() {
    this.hide();
  }

  private onClick(entry: ContextMenuEntry) {
    if (entry.action) {
      this.hide();
      entry.action();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.context-menu {
  position: fixed;
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: 2px 2px 4px 0 var(--color-background--light);
  padding: 0.5rem 0;
  z-index: 99999;
  border: 1px solid var(--color-background--dark);

  @media print {
    display: none;
  }

  &--right {
    transform: translateX(-100%);
  }

  &--no-wrap > li {
    white-space: nowrap;
  }

  > li {
    padding: 0.25rem 1rem 0.25rem 1.6rem;
    cursor: pointer;
    position: relative;

    & > svg,
    & > div.fa-layers {
      position: absolute;
      left: 0.5rem;
    }

    &:not(.seperator):hover {
      background-color: var(--color-background--light);
    }

    &.seperator {
      height: 1rem;

      &::before {
        content: "";
        display: block;
        width: calc(100% - 0.5rem);
        position: absolute;
        left: 0.25rem;
        top: 0.5rem;
        border-top: 1px solid var(--color-foreground);
      }

      > span {
        font-size: 0.75rem;
        position: absolute;
        top: 1px;
        left: 50%;
        transform: translateX(-50%);
        color: var(--color-foreground--dark);
        @include stroke(2, var(--color-background));
      }
    }

    &.dangerous {
      color: var(--color-alert);

      &:hover {
        background-color: var(--color-alert);
        color: var(--color-foreground);
      }
    }

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &:deep(.new-page > .fa-layers) {
    font-size: 0.75rem;
  }

  &:deep(.new-page--before > .fa-layers > .fa-plus-circle) {
    transform: translateY(5px);
  }

  &:deep(.new-page--before > .fa-layers > .fa-chevron-up) {
    transform: translateY(-5px);
  }

  &:deep(.new-page--after > .fa-layers > .fa-chevron-down) {
    transform: translateY(10px);
  }

  &:deep(.new-column > .fa-layers) {
    font-size: 0.6rem;
  }

  &:deep(.new-column--left > .fa-layers > .fa-plus-circle) {
    transform: translate(4px, 4px);
  }

  &:deep(.new-column--left > .fa-layers > .fa-chevron-left) {
    transform: translate(-4px, 4px);
  }

  &:deep(.new-column--right > .fa-layers > .fa-plus-circle) {
    transform: translate(-2px, 4px);
  }

  &:deep(.new-column--right > .fa-layers > .fa-chevron-right) {
    transform: translate(6px, 4px);
  }
}
</style>
