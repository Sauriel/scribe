<template>
  <ul
    class="tabs"
      :class="{
        'tabs--round': round,
        'tabs--border': border,
        'tabs--shadow-border': shadowBorder,
        'tabs--alternate': alternateColors
      }"
  >
    <li
      v-for="(tab, index) in tabs"
      :key="index"
      class="tab"
      :class="{
        'tab--selected': tab.data == value,
        'tab--disabled': tab.disabled === true
      }"
      @click="$emit('input', tab.data)"
    >
      <span>
        <font-awesome-icon v-if="tab.icon" :icon="tab.icon" />
        {{ tab.name }}
      </span>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

export interface Tab<V> {
  name?: string;
  icon?: string;
  disabled?: boolean;
  data: V;
}

@Component
export default class Tabs extends Vue {

  @Prop(Array)
  readonly tabs!: Tab<any>[];

  @Prop()
  readonly value!: any;

  @Prop({ type: Boolean, default: false})
  readonly round!: boolean;

  @Prop({ type: Boolean, default: false})
  readonly border!: boolean;

  @Prop({ type: Boolean, default: false})
  readonly shadowBorder!: boolean;

  @Prop({ type: Boolean, default: false})
  readonly alternateColors!: boolean;
}
</script>

<style lang="scss" scoped>
  @import "@/style/colors.scss";

  .tabs {
    flex: 0 0 auto;
    min-height: 30px;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;

    > .tab {
      flex: 1 1 auto;
      padding: 5px 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $backgroundDark;
      cursor: pointer;
      white-space: nowrap;

      &:hover, &--selected {
        background-color: $background;
      }

      &--disabled {
        background-color: $foreground;
        color: $foregroundDark;
        cursor: not-allowed;

        &:hover {
          background-color: $foregroundLight;
        }
      }
    }

    &--alternate {
      > .tab {
        background-color: transparent;

        &:hover, &--selected {
          background-color: $primaryLight;
        }
      }
    }

    &--round {
      border-radius: 15px;

      > .tab:first-child {
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
      }

      > .tab:last-child {
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
      }
    }

    &--border {
      border: 2px solid $backgroundDark;
    }

    &--shadow-border {
      box-shadow: 0 .15em .25em rgba(0,0,0,0.5) inset, 0 -.5px 0 rgba(255,255,255,0.2) inset;

      > .tab {
        &:hover, &--selected {
          box-shadow: 0 .15em .25em rgba(0,0,0,0.5) inset, 0 -.5px 0 rgba(255,255,255,0.2) inset;
        }
      }
    }
  }
</style>
