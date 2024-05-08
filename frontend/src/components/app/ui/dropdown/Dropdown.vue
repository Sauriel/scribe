<template>
  <div class="dropdown" :class="{ 'dropdown--disabled': disabled }">
    <div class="dropdown-button" @click="open = !open">
      {{ selected.name }}
      <span class="caret" :class="{ open: open }" />
    </div>
    <ul
      class="dropdown-list"
      :class="{
        'dropdown-list--expanded': open,
        'dropdown-list--wide': wide,
        'dropdown-list--expanded-top': open && top,
      }"
      v-if="!disabled"
    >
      <slot />
      <li
        v-for="(entry, index) of entries"
        :key="'dd-entry-' + index"
        @click="select(entry)"
        :class="{
          selected: entry === selected,
          group: entry.group,
        }"
      >
        <slot name="item" v-bind:item="entry">
          <span>
            {{ entry.name }}
          </span>
        </slot>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";

export interface DropdownItem {
  name: string | number;
  value: string | number;
}

export interface DropdownGroup {
  label: string;
  items: DropdownItem[];
}

interface Item {
  name: string | number;
  value: string | number;
  group?: boolean;
}

export default class Dropdown extends Vue {
  @Prop({ type: [String, Number], required: true })
  private readonly modelValue!: string | number;

  @Prop({ type: Array, default: [] })
  private readonly items!: DropdownItem[];

  @Prop({ type: Array, default: [] })
  private readonly groups!: DropdownGroup[];

  @Prop({ type: Boolean, default: false })
  private readonly disabled!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly wide!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly top!: boolean;

  private open = false;

  private get entries(): Item[] {
    const entries: Item[] = [...this.items];
    for (const group of this.groups) {
      entries.push({
        name: group.label,
        value: -1,
        group: true,
      });
      entries.push(...group.items);
    }
    return entries;
  }

  private get selected(): Item {
    const fromEntries = this.entries.find((item) => item.value === this.modelValue);
    return fromEntries ? fromEntries : { name: this.modelValue, value: this.modelValue };
  }

  private set selected(item: Item) {
    this.$emit("update:modelValue", item.value);
  }

  mounted() {
    document.addEventListener("click", this.clickHandler);
  }

  beforeDestroy() {
    document.removeEventListener("click", this.clickHandler);
  }

  private select(item: Item) {
    if (!item.group) {
      this.selected = item;
      this.open = false;
    }
  }

  private clickHandler(event: MouseEvent) {
    const { target } = event;
    const { $el } = this;
    // @ts-ignore
    if (!$el.contains(target)) {
      this.open = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  display: inline-block;
  min-width: 80px;

  &--disabled {
    cursor: not-allowed;

    .dropdown-button {
      color: var(--color-foreground--dark);
      pointer-events: none;

      .caret::before {
        border-top-color: var(--color-foreground--dark);
        transition: none;
        transform: none !important;
      }
    }
  }

  &-button {
    color: inherit;
    font-size: inherit;
    background: none;
    border: 0;
    outline: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 10px;
    background-color: var(--color-background--dark);
    height: 25px;
    white-space: nowrap;

    .caret {
      &::before {
        display: block;
        width: 0;
        height: 0;
        margin: 0 2px;
        border-top: 6px solid var(--color-foreground);
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
        transition: transform 0.3s;
        content: "";
      }

      &.open {
        &::before {
          transform: rotate(-180deg);
        }
      }
    }
  }

  &-list {
    position: absolute;
    z-index: 1;
    width: 100%;
    max-height: 0;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--color-background--light);
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    transition: 0.3s;

    &--expanded {
      max-height: 200px;
      z-index: 99;

      &-top {
        bottom: 25px;
      }
    }

    &--wide {
      min-width: 100%;
      width: auto;
    }

    > li {
      &:deep(span) {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0 0.5em;
        white-space: nowrap;

        &:hover,
        &:focus {
          background-color: var(--color-foreground--dark);
          color: var(--color-background--dark);
        }
      }

      &.selected {
        &:deep(span) {
          background-color: var(--color-foreground--dark);
          color: var(--color-primary);
        }
      }

      &.group {
        pointer-events: none;
        background-color: var(--color-background);
        border-bottom: 2px solid var(--color-primary);
        padding: 2px 0;
        margin-bottom: 2px;

        & ~ li:not(.group) {
          &:deep(span) {
            padding-left: 1em;
          }
        }
      }
    }
  }
}
</style>
