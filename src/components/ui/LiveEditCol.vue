<template>
  <component
    :is="!header ? 'td' : 'th'"
    :class="cssClass"
    :contenteditable="!locked"
    @input="liveInput"
    v-html="text"
   />
</template>

<script lang="ts">
import { TableElementCol } from '@/models/layout-elements/TableElement';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    // @ts-ignore
import * as he from "he";

@Component
export default class LiveEditCol extends Vue {
  @Prop(Object)
  readonly value!: TableElementCol;

  @Prop({ type: Boolean, default: false})
  readonly locked!: boolean;

  @Prop({ type: Boolean, default: false})
  readonly header!: boolean;

  @Prop(String)
  readonly align?: string;

  private get cssClass(): string {
    if (this.align) {
      return "align-" + this.align.toLowerCase();
    }
    return "";
  }

  private textEdited = false;
  private textCopy = "";
  private lastChange = "";

  private get text(): string {
    return this.textEdited ? this.textCopy : this.elementText;
  }

  private get elementText(): string {
    return this.value.content;
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
    this.value.content = this.lastChange;
  }
}
</script>

<style lang="scss" scoped>
</style>
