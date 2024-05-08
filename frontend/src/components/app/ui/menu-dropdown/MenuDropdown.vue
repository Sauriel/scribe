<template>
  <div class="menu-dropdown" @mouseover="show = true" @mouseleave="show = false">
    <slot />
    <div
      class="menu-dropdown-dropdown"
      :class="{
        'menu-dropdown-dropdown--left': position === 'left',
        'menu-dropdown-dropdown--center': position === 'center',
        'menu-dropdown-dropdown--right': position === 'right',
        'menu-dropdown-dropdown--top': top,
      }"
      v-if="show"
    >
      <slot name="dropdown">
        <div
          v-for="(entry, index) of items"
          :key="'mdd-entry-' + index"
          class="menu-dropdown-entry"
          :class="{
            'menu-dropdown-entry--selected': internalValue === entry.value,
          }"
          @click="onClick(entry)"
        >
          <img v-if="entry.prependImg" :src="entry.prependImg" class="prepend-image" />
          {{ entry.label }}
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";

export interface DropdownEntry {
  label: string;
  value: string | number;
  prependImg?: string;
  action?: () => void;
}

export default class MenuDropdown extends Vue {
  @Prop({ type: [String, Number], default: "" })
  private readonly modelValue!: string | number;

  @Prop({ type: String, default: "right" })
  private readonly position!: string;

  @Prop({ type: Array, default: [] })
  private readonly items!: DropdownEntry[];

  @Prop({ type: Boolean, default: false })
  private readonly top!: boolean;

  private show = false;

  private get internalValue(): string | number {
    return this.modelValue;
  }

  private set internalValue(value: string | number) {
    this.show = false;
    this.$emit("update:modelValue", value);
  }

  private onClick(entry: DropdownEntry) {
    this.internalValue = entry.value;
    if (entry.action) {
      entry.action();
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-dropdown {
  position: relative;

  &-dropdown {
    position: absolute;
    background-color: var(--color-background);
    top: 100%;
    border: 1px solid var(--color-background--dark);
    border-top: none;
    z-index: 100;
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);

    &--left {
      right: -1px;
    }

    &--right {
      left: -1px;
    }

    &--center {
      left: 50%;
      transform: translateX(-50%);
    }

    &--top {
      top: auto;
      bottom: 100%;
      border-top: initial;
      border-bottom: none;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-top-left-radius: var(--border-radius);
      border-top-right-radius: var(--border-radius);
    }

    &:deep(.menu-dropdown-entry) {
      display: flex;
      padding: 10px 20px;
      cursor: pointer;
      white-space: nowrap;
      justify-content: space-between;
    }

    &:deep(.menu-dropdown-entry .prepend-image) {
      height: 20px;
      margin-right: 10px;
    }

    &:deep(.menu-dropdown-entry--selected) {
      background-color: var(--color-secondary);
    }

    &:deep(.menu-dropdown-entry--disabled) {
      opacity: 0.5;
      pointer-events: none;
    }

    &:deep(.menu-dropdown-entry:not(.menu-dropdown-entry--disabled):hover) {
      background-color: var(--color-background--light);
    }
  }
}
</style>
