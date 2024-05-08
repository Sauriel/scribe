<template>
  <div class="combobox">
    <div v-for="(chip, index) of items" :key="'cp-' + index" class="chip" @click="showEdit(index)">
      <slot name="item" :item="chip" :index="index" />
      <font-awesome-icon icon="times" class="remove" @click="emitRemoveEvent(chip, index)" />
      <div class="chip-edit" v-if="selectedChip === index" v-click-outside="onClickOutsideEdit">
        <slot name="item-edit" :item="chip" :index="index" :save="editChip" />
        <span class="save-button" @click.stop="editChip(chip, index)">
          <font-awesome-icon icon="check" />
        </span>
        <span class="remove-button" @click.stop="emitRemoveEvent(chip, index)">
          <font-awesome-icon icon="times" />
        </span>
      </div>
    </div>
    <div class="chip add-chip" @click="showAddInputs" v-click-outside="onClickOutsideAdd">
      <font-awesome-icon icon="plus" />
      <div class="chip-edit" v-if="showAdd">
        <slot name="item-add" :save="addToList" />
        <span class="save-button" @click.stop="addToList">
          <font-awesome-icon icon="check" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";

export interface ComboboxEvent<T> {
  item: T;
  index: number;
}

export default class Combobox extends Vue {
  @Prop({ type: Array, required: true })
  private readonly items!: any[];

  private selectedChip = -1;
  private showAdd = false;

  private emitRemoveEvent(chip: any, index: number) {
    const event: ComboboxEvent<any> = {
      item: chip,
      index: index,
    };
    this.$emit("chip:delete", event);
  }

  private showEdit(index: number) {
    this.showAdd = false;
    this.selectedChip = index;
  }

  private onClickOutsideEdit() {
    this.selectedChip = -1;
  }

  private onClickOutsideAdd() {
    this.showAdd = false;
  }

  private showAddInputs() {
    this.selectedChip = -1;
    this.showAdd = true;
  }

  private addToList() {
    this.showAdd = false;
    this.$emit("chip:add");
  }

  private editChip(chip: any, index: number) {
    this.selectedChip = -1;
    const event: ComboboxEvent<any> = {
      item: chip,
      index: index,
    };
    this.$emit("chip:edit", event);
  }
}
</script>

<style lang="scss" scoped>
.combobox {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;

  .chip {
    display: flex;
    align-items: center;
    background-color: var(--color-primary);
    padding: 0.2em 0.5em;
    border-radius: var(--border-radius);
    position: relative;
    cursor: pointer;
    white-space: nowrap;

    .remove {
      margin-left: 0.5em;
      cursor: pointer;
      color: var(--color-primary--light);

      &:hover {
        color: var(--color-foreground);
      }
    }

    .chip-edit {
      position: absolute;
      top: 2em;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: 0.5em;
      background-color: var(--color-background--light);
      padding: 0.2em 0.5em;
      border-radius: var(--border-radius);
      color: var(--color-foreground);
      animation-name: zoomIn;
      animation-duration: 0.25s;
      transition-timing-function: cubic-bezier(1, 0, 0.5, 1.5);
      animation-iteration-count: 1;
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
      left: 50%;
      transform: translateX(-50%);
      z-index: 99;

      &::before {
        content: "";
        position: absolute;
        top: -2em;
        left: 50%;
        margin-left: -1em;
        border: 1em solid transparent;
        border-bottom-color: var(--color-background--light);
      }

      .save-button,
      .remove-button {
        cursor: pointer;
      }

      .remove-button {
        padding-right: 0.25em;
      }
    }

    &.add-chip {
      justify-content: center;
      color: var(--color-primary--light);

      &:hover {
        color: var(--color-foreground);
      }
    }
  }
}

@keyframes zoomIn {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(100%);
  }
}
</style>
