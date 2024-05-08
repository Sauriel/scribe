<template>
  <div class="ruleset-selector">
    <ul>
      <li
        v-for="(item, index) of items"
        :key="index"
        :class="[
          item.shortName,
          isSelected(item) ? 'ruleset--selected' : '',
          selectedGroup === index ? 'ruleset--opened' : '',
          item.disabled ? 'ruleset--disabled' : ''
        ]"
        class="ruleset"
      >
        <div
          class="ruleset-clicker"
          @click.self.stop="select(item, index)"
        />
        <ruleset-selector
          v-if="selectedGroup === index"
          v-model="internalValue"
          :items="item.subRules"
          class="ruleset-subruleset"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Ruleset } from '@/models/AppDocumentSettings';

@Component
export default class RulesetSelector extends Vue {

  @Prop(Object)
  readonly value!: Ruleset;

  @Prop(Array)
  readonly items!: Ruleset[];

  private selectedGroup = -1;

  private get internalValue(): Ruleset {
    return this.value;
  }

  private set internalValue(value: Ruleset) {
    this.selectedGroup = -1;
    this.onChange(value);
  }

  private isSelected(item: Ruleset): boolean {
    if (item == this.value) {
      return true;
    } else if (item.subRules) {
      for (const child of item.subRules) {
        if (this.isSelected(child)) {
          return true;
        }
      }
    }
    return false;
  }

  private select(rule: Ruleset, index: number) {
    if (!rule.disabled) {
      if (rule.subRules && rule.subRules.length > 0) {
        if (this.selectedGroup !== index) {
          this.selectedGroup = index;
        } else {
          this.selectedGroup = -1;
        }
      } else {
        this.selectedGroup = -1;
        this.onChange(rule);
      }
    }
  }

  private onChange(rule: Ruleset) {
    this.$emit("input", rule);
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/colors.scss";

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    list-style: none;
    padding: 0;
    margin: 0;

    li.ruleset {
      flex: 0 0 auto;
      width: calc(50% - 5px);
      height: 80px;
      background-repeat: no-repeat;
      background-position: center;
      margin: 5px;
      position: relative;

      &:nth-child(2n-1) {
        margin-left: 0;
      }

      &:nth-child(2n) {
        margin-right: 0;
      }

      &:first-child, &:nth-child(2) {
        margin-top: 0;
      }

      &:last-child, &:nth-last-child(2) {
        margin-bottom: 0;
      }

      &:hover, &--selected {
        background-color: $backgroundLight;
      }

      &.coc {
        background-image: url(../../../../assets/settings/coc.png);
      }

      &.cp {
        background-image: url(../../../../assets/settings/cp.png);
      }

      &.dnd {
        background-image: url(../../../../assets/settings/dnd.png);
      }

      &.dnd-35 {
        background-image: url(../../../../assets/settings/dnd-35.png);
      }

      &.dnd-4 {
        background-image: url(../../../../assets/settings/dnd-4.png);
      }

      &.dnd-5 {
        background-image: url(../../../../assets/settings/dnd-5.png);
      }

      &.pf {
        background-image: url(../../../../assets/settings/pf.png);
      }

      &.wh40k {
        background-image: url(../../../../assets/settings/wh40k.png);
      }

      &.wod {
        background-image: url(../../../../assets/settings/wod.png);
      }

      > .ruleset-clicker {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        cursor: pointer;
      }

      &--disabled {
        filter: grayscale(100%);
        opacity: .25;

        > .ruleset-clicker {
          cursor: not-allowed;
        }
      }

      &--opened {
        background-color: $backgroundDark !important;
      }

      .ruleset-subruleset {
        position: absolute;
        left: 0;
        top: 80px;
        width: calc(200% + 10px);
        background-color: $backgroundDark;
        z-index: 1;
        border: 4px solid $backgroundDark;

        li.ruleset {
          &:hover, &--selected {
            background-color: $background;
          }
        }
      }
    }
  }
</style>
