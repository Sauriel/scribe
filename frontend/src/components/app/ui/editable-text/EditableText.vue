<script lang="ts">
import { Vue, Prop, Watch } from "vue-property-decorator";

export default class EditableText extends Vue {
  @Prop({ type: String, required: true })
  private readonly modelValue!: string;

  @Prop(String)
  private readonly displayValue?: string;

  @Prop({ type: String, default: "text" })
  private readonly type!: string;

  private value = "";
  private editable = false;

  private get internalDisplayValue(): string {
    return this.displayValue || this.value;
  }

  mounted() {
    this.value = this.modelValue;
  }

  @Watch("modelValue")
  private onModelValueChanged() {
    this.value = this.modelValue;
  }

  private save() {
    this.$emit("update:modelValue", this.value);
    this.value = this.modelValue;
    this.editable = false;
  }

  private cancel() {
    this.value = this.modelValue;
    this.editable = false;
  }
}
</script>

<template src="@/components/app/ui/editable-text/editable-text.template.html" />
<style src="@/components/app/ui/editable-text/editable-text.style.scss" lang="scss" scoped />