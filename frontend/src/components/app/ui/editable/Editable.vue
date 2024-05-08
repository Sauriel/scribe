<template>
  <div
    class="editable-wrapper"
    :class="wrapperCssClass"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <component
      :is="tag"
      :key="internalValue"
      v-html="internalValue"
      contenteditable
      @input="onInput"
      :class="cssClass"
      :style="componentStyle"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
    <div class="editable-tools" v-if="$slots.default && showTools">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Watch } from "vue-property-decorator";
import * as he from "he";

export default class Editable extends Vue {
  @Prop({ type: String, required: true })
  private readonly modelValue!: string;

  @Prop({ type: String, required: true })
  private readonly tag!: string;

  @Prop(String)
  private readonly class!: string;

  @Prop(String)
  private readonly wrapperClass!: string;

  @Prop(Object)
  private readonly style!: Record<string, string>;

  private edited = false;
  private workCopy = "";
  private lastChange = "";
  private showTools = false;

  private get cssClass(): string {
    return this.class;
  }

  private get wrapperCssClass(): string {
    return this.wrapperClass;
  }

  private get componentStyle(): Record<string, string> {
    return this.style;
  }

  private get value(): string {
    return this.modelValue;
  }

  private get internalValue(): string {
    return this.edited ? this.workCopy : this.value;
  }

  private set internalValue(value: string) {
    this.$emit("update:modelValue", value);
  }

  @Watch("value")
  private onValueChanged() {
    if (this.lastChange !== this.value) {
      this.lastChange = this.value;
      this.workCopy = this.value;
      this.edited = false;
    }
  }

  private onInput(event: InputEvent) {
    if (!this.edited) {
      this.workCopy = this.value;
      this.edited = true;
    }
    const htmlText = (event.target as HTMLElement).innerHTML;
    this.lastChange = he.decode(htmlText);
    this.internalValue = this.lastChange;
  }

  private onMouseEnter(event: MouseEvent) {
    this.showTools = true;
  }

  private onMouseLeave(event: MouseEvent) {
    this.showTools = false;
  }
}
</script>

<style lang="scss" scoped>
.editable-wrapper {
  position: relative;

  .editable-tools {
    position: absolute;
    left: -1px;
    bottom: 100%;

    @media print {
      display: none;
    }
  }
}
</style>
