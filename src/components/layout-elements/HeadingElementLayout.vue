<template>
  <header
    :class="[
      element.type,
      element.locked ? 'locked' : ''
    ]"
    :contenteditable="!element.locked"
    @input="liveInput"
    v-html="text"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import HeadingElement from '@/models/layout-elements/HeadingElement';
    // @ts-ignore
import * as he from "he";

@Component
export default class HeadingElementLayout extends Vue {
  @Prop(Object)
  readonly element!: HeadingElement;

  private textEdited = false;
  private textCopy = "";
  private lastChange = "";

  private get text(): string {
    return this.textEdited ? this.textCopy : this.elementText;
  }

  private get elementText(): string {
    return this.element.text;
  }

  @Watch("elementText")
  private onElementTextChanged() {
    if (this.lastChange !== this.elementText) {
      this.textEdited = false;
    }
  }

  private liveInput($event: InputEvent) {
    if (!this.textEdited) {
      this.textCopy = this.elementText;
      this.textEdited = true;
    }
    // @ts-ignore
    const htmlText = $event.target.innerHTML;
    this.lastChange = he.decode(htmlText);
    this.element.text = this.lastChange;
  }
}
</script>

<style lang="scss" scoped>
  .locked {
    user-select: none;
  }
</style>
