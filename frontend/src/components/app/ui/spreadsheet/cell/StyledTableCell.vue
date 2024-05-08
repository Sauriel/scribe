<template>
  <component :is="tag">
    <editable tag="div" v-model="value" :style="cellStyle" @blur="onBlur" />
  </component>
</template>

<script lang="ts">
import { TableCell } from "@/models/document/table";
import { cloneDeep } from "lodash";
import { Vue, Prop } from "vue-property-decorator";

declare type TableCellTag = "td" | "th";

export default class StyledTableCell extends Vue {
  @Prop({ type: Object, required: true })
  private readonly modelValue!: TableCell;

  @Prop({ type: String, default: "td" })
  private readonly tag!: TableCellTag;

  @Prop({ type: Boolean, default: false })
  private readonly updateOnBlur!: boolean;

  private internalValue = "";

  mounted() {
    this.internalValue = this.value;
  }

  private get cell(): TableCell {
    return this.modelValue;
  }

  private get value(): string {
    return this.cell.value;
  }

  private set value(value: string) {
    this.internalValue = value;
    if (!this.updateOnBlur) {
      const cell = cloneDeep(this.modelValue);
      cell.value = value;
      this.$emit("update:modelValue", cell);
    }
  }

  private onBlur() {
    if (this.updateOnBlur) {
      const cell = cloneDeep(this.modelValue);
      cell.value = this.internalValue;
      this.$emit("update:modelValue", cell);
    }
  }

  private get cellStyle(): Record<string, string | undefined> {
    if (this.cell.style) {
      let textDecoration = undefined;
      if (this.cell.style.underline) {
        if (this.cell.style.strike) {
          textDecoration = "underline line-through";
        } else {
          textDecoration = "underline";
        }
      } else if (this.cell.style.strike) {
        textDecoration = "line-through";
      }
      return {
        fontFamily: this.cell.style.font ? this.cell.style.font : "",
        fontSize: this.cell.style.size,
        fontWeight: this.cell.style.bold ? "bold" : undefined,
        fontStyle: this.cell.style.italic ? "italic" : undefined,
        textDecoration: textDecoration,
        color: this.cell.style.color,
        textAlign: this.cell.style.align,
      };
    } else { // FIXME: Why can this.cell.style be undefined?
      return {};
    }
  }
}
</script>
