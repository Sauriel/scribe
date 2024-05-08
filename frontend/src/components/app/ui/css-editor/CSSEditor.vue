<script lang="ts">
import { Vue, Prop, Options, Watch } from "vue-property-decorator";
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";

import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-solarizedlight.css";

export interface CSSElementHint {
  selector: string;
  description: string;
  long?: boolean;
}

@Options({
  components: {
    PrismEditor
  }
})
export default class CSSEditor extends Vue {
  @Prop(String)
  private readonly modelValue!: string;

  @Prop({ type: Array, default: [] })
  private readonly hints!: CSSElementHint[];

  private value = "";

  @Watch("modelValue")
  private onModelValueChange() {
    this.value = this.modelValue;
  }

  mounted() {
    this.value = this.modelValue;
  }

  private get internalValue(): string {
    return this.value;
  }

  private set internalValue(value: string) {
    this.value = value;
    this.$emit("update:modelValue", value);
  }

  private highlighter(code: string) {
    return highlight(code, languages.css);
  }
}
</script>

<template src="@/components/app/ui/css-editor/css-editor.template.html" />
<style src="@/components/app/ui/css-editor/css-editor.style.scss" lang="scss" scoped />