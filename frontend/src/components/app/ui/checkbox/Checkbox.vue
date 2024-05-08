<template src="@/components/app/ui/checkbox/checkbox.template.html" />

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";

export default class Checkbox extends Vue {
  @Prop({ type: Boolean, required: true })
  private readonly modelValue!: boolean;

  @Prop(String)
  private readonly label?: string;

  private get value(): boolen {
    return this.modelValue;
  }

  private set value(value: boolean) {
    this.$emit("update:modelValue", value);
  }
}
</script>

<style src="@/components/app/ui/checkbox/checkbox.style.scss" lang="scss" scoped />