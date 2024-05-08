<template>
  <div class="dropdown" :class="{ 'dropdown--disabled': disabled }">
    <div class="dropdown-button" @click="open = !open">
      {{ internalValue.name }}
      <span class="caret" :class="{ 'open': open }" />
    </div>
    <ul class="dropdown-list" :class="{ 'expanded': open }" v-if="!disabled">
      <slot />
      <li v-for="item of items" :key="item.value" @click="select(item)" :class="{ 'selected': item === internalValue }">
        <span>
          {{ item.name }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

export interface DropdownItem {
  name: string | number;
  value: string | number;
}

@Component
export default class Dropdown extends Vue {
  @Prop()
  readonly value!: string | number;

  @Prop(Array)
  readonly items!: DropdownItem[];

  @Prop(Boolean)
  readonly disabled!: boolean;

  private open = false;

  private get internalValue(): DropdownItem {
    const fromItems = this.items.find(item => item.value === this.value);
    return fromItems ? fromItems : { name: this.value, value: this.value };
  }

  private set internalValue(item: DropdownItem) {
    this.$emit("input", item.value);
  }

  mounted() {
    document.addEventListener('click', this.clickHandler);
  }

  beforeDestroy() {
    document.removeEventListener('click', this.clickHandler);
  }

  private select(item: DropdownItem) {
    this.internalValue = item;
    this.open = false;
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
  @import "@/style/colors.scss";

  .dropdown {
    position: relative;
    display: inline-block;
    min-width: 80px;

    &--disabled {
      cursor: not-allowed;

      .dropdown-button {
        color: $foregroundDark;
        pointer-events: none;

        .caret::before {
          border-top-color: $foregroundDark;
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
      background-color: $backgroundDark;
      height: 25px;
      white-space: nowrap;

      .caret {
        &::before {
          display: block;
          width: 0;
          height: 0;
          margin: 0 2px;
          border-top: 6px solid $foreground;
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
      background-color: $backgroundLight;
      box-shadow: 1px 1px 3px rgba(0,0,0,.2);
      transition: 0.3s;

      &.expanded {
        max-height: 200px;
      }

      > li {
        > span {
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0 10px;
          white-space: nowrap;

          &:hover, &:focus {
            background-color: $foregroundDark;
            color: $backgroundDark;
          }
        }

        &.selected {
          > span {
            background-color: $foregroundDark;
            color: $primary;
          }
        }
      }
    }
  }
</style>
