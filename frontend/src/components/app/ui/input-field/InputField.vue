<template src="@/components/app/ui/input-field/input-field.template.html" />

<script lang="ts">
import { Vue, Prop, Ref } from "vue-property-decorator";

export default class InputField extends Vue {
  @Ref()
  private readonly input!: HTMLInputElement;

  @Prop({ required: true })
  private readonly modelValue!: string | number | undefined;

  @Prop({ type: Boolean, default: false })
  private readonly disabled!: boolean;

  @Prop({ type: String, default: "text" })
  private readonly type!: string;

  @Prop({ type: Boolean, default: false })
  private readonly small!: boolean;

  @Prop(String)
  private readonly placeholder?: string;

  @Prop(String)
  private readonly suffix?: string;

  @Prop(Number)
  private readonly step?: number;

  @Prop(String)
  private readonly hint?: string;

  @Prop(Boolean)
  private readonly hideHintIfEmpty?: boolean;

  private get internalValue(): string | number | undefined {
    return this.modelValue;
  }

  private set internalValue(value: string | number | undefined) {
    if (!this.disabled) {
      this.$emit("update:modelValue", this.type == "number" && value ? +value : value);
    }
  }

  private get showHint(): boolean {
    if (this.hint) {
      return this.hideHintIfEmpty ? !!this.modelValue : true;
    }
    return false;
  }

  private get style(): Record<string, string> {
    return this.suffix
      ? {
          "--suffix": "'" + this.suffix + "'",
        }
      : {};
  }

  public focus() {
    this.input.focus();
  }
}
</script>

<style src="@/components/app/ui/input-field/input-field.style.scss" lang="scss" scoped />