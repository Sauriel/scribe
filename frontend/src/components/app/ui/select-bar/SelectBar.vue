<template>
  <ul
    class="select-bar"
    :class="{
      'select-bar--round': round,
      'select-bar--border': border,
      'select-bar--shadow-border': shadowBorder,
      'select-bar--alternate': alternateColors,
    }"
  >
    <li
      v-for="(entry, index) in items"
      :key="'sb-entry-' + index"
      class="entry"
      :class="[
        {
          'entry--selected': entry.data == modelValue,
          'entry--disabled': entry.disabled === true,
        },
        entry.cssClass,
      ]"
      @click="$emit('update:modelValue', entry.data)"
    >
      <span class="entry-content">
        <font-awesome-icon v-if="entry.icon" :icon="entry.icon" />
        <span class="entry-text">
          {{ entry.name }}
        </span>
      </span>
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";

export interface SelectBarEntry<V> {
  name?: string;
  icon?: string;
  disabled?: boolean;
  data: V;
  cssClass?: string;
}

export default class SelectBar extends Vue {
  @Prop({ required: true })
  private readonly modelValue!: any;

  @Prop(Array)
  private readonly items!: SelectBarEntry<any>[];

  @Prop({ type: Boolean, default: false })
  private readonly round!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly border!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly shadowBorder!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly alternateColors!: boolean;
}
</script>

<style lang="scss" scoped>
.select-bar {
  flex: 0 0 auto;
  min-height: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;

  > .entry {
    flex: 1 1 auto;
    padding: 5px 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-background--dark);
    cursor: pointer;
    white-space: nowrap;

    &:hover,
    &--selected {
      background-color: var(--color-background);
    }

    &--disabled {
      background-color: var(--color-foreground);
      color: var(--color-foreground--dark);
      cursor: not-allowed;

      &:hover {
        background-color: var(--color-foreground--dark);
      }
    }
  }

  &--alternate {
    > .entry {
      background-color: transparent;

      &:hover,
      &--selected {
        background-color: var(--color-primary);
      }
    }
  }

  &--round {
    border-radius: 15px;

    > .entry:first-child {
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
    }

    > .entry:last-child {
      border-top-right-radius: 15px;
      border-bottom-right-radius: 15px;
    }
  }

  &--border {
    border: 2px solid var(--color-background--dark);
  }

  &--shadow-border {
    box-shadow: 0 0.15em 0.25em rgba(0, 0, 0, 0.5) inset, 0 -0.5px 0 rgba(255, 255, 255, 0.2) inset;

    > .entry {
      &:hover,
      &--selected {
        box-shadow: 0 0.15em 0.25em rgba(0, 0, 0, 0.5) inset,
          0 -0.5px 0 rgba(255, 255, 255, 0.2) inset;
      }
    }
  }
}
</style>
