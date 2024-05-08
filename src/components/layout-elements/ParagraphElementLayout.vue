<template>
  <div
    :contenteditable="!element.locked"
    @input="liveInput"
    v-html="text"
    :class="{
      'initial': element.initial,
      'locked': element.locked
      }"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ParagraphElement from '@/models/layout-elements/ParagraphElement';
    // @ts-ignore
import * as he from "he";

@Component
export default class ParagraphElementLayout extends Vue {
  @Prop(Object)
  readonly element!: ParagraphElement;

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

<style lang="scss">
  .block {
    display: block;

    &.text-left {
      text-align: left;
    }

    &.text-center {
      text-align: center;
    }

    &.text-right {
      text-align: right;
    }

    &.text-justify {
      text-align: justify;
    }
  }

  .locked {
    user-select: none;
  }
</style>
