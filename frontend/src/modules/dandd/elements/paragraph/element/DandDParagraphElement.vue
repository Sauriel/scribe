<template>
  <div :class="scopedClass">
    <custom-css :style="model.customCss" :prefix="scopedClass" />
    <tip-tap
      v-model="text"
      inline
      class="dnd-paragraph"
      :class="{
        'dnd-paragraph--initial': initial,
        'dnd-paragraph--first-line-uppercase': firstLineUppercase,
      }"
      :defaults="defaults"
      :historyConfig="tipTapHistoryConfig"
      :locked="locked"
      :document="document"
      @focus="$emit('element:selected', model)"
    >
      <input-switch v-model="initial">
        {{ $t("panel.DandDParagraphElementPanel.initial") }}
      </input-switch>
      <input-switch v-model="firstLineUppercase">
        {{ $t("panel.DandDParagraphElementPanel.firstLineUppercase") }}
      </input-switch>
    </tip-tap>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import { getCurrentInstance } from "vue";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { LayoutElementModel } from "@/modules/ElementModel";
import DandDParagraphElementModel, { dndParagraphDefaults } from "@/modules/dandd/elements/paragraph/DandDParagraphElementModel";
import { TipTapHistoryConfig } from "@/components/app/ui/tiptap/TipTap.vue";
import {
  ChangeDandDParagraphInitialAction,
  ChangeDandDParagraphUppercaseAction,
} from "@/modules/dandd/elements/paragraph/historyActions";
import DocumentModel from "@/models/document";
import CSSHelper from "@/helper/CSSHelper";

@Options({
  inject: [HISTORY_MANAGER],
})
export default class DandDParagraphElement extends Vue {
  private defaults = dndParagraphDefaults;

  @Prop({ type: Object, required: true })
  private readonly model!: DandDParagraphElementModel;

  @Prop({ type: Number, required: true })
  private readonly index!: number;

  @Prop({ type: Object, required: true })
  private readonly layout!: LayoutElementModel;

  @Prop({ type: Boolean, default: false })
  private readonly locked!: boolean;

  @Prop({ type: Object, required: true })
  private readonly document!: DocumentModel;

  private uid = 0;

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get tipTapHistoryConfig(): TipTapHistoryConfig<DandDParagraphElementModel> {
    return {
      object: this.model,
      set: (object, value) => (object.value = value),
      get: (object) => object.value,
    };
  }

  private get text(): string {
    return this.model.value;
  }

  private set text(value: string) {
    this.model.value = value;
  }

  private get initial(): boolean {
    return this.model.initial;
  }

  private set initial(value: boolean) {
    const action = new ChangeDandDParagraphInitialAction(this.model, this.model.initial, value);
    this.history.do(action);
  }

  private get firstLineUppercase(): boolean {
    return this.model.firstLineUppercase;
  }

  private set firstLineUppercase(value: boolean) {
    const action = new ChangeDandDParagraphUppercaseAction(
      this.model,
      this.model.firstLineUppercase,
      value
    );
    this.history.do(action);
  }

  private get scopedClass(): string {
    return "dnd-paragraph--" + this.uid;
  }
}
</script>

<style lang="scss" scoped>
@import "@/modules/dandd/fonts.scss";
@import "@/modules/dandd/colors.scss";

.dnd-paragraph {
  &:deep(.ProseMirror) {
    text-rendering: optimizeLegibility;
    font-family: "Book Insanity";
    font-size: 9pt;
    line-height: 1.2;
    letter-spacing: 0.5px;
    color: $black;
  }

  &:deep(p) {
    margin-block-start: 0;
    margin-block-end: 0;
  }

  &:deep(p + p) {
    text-indent: 1em;
  }

  &--initial {
    &:deep(.text-content > p:first-of-type:first-letter) {
      font-family: "Solbera Imitation";
      float: left;
      font-size: 10em;
      line-height: 0.8em;
      margin-bottom: 0.1em;
      margin-right: 2px;
    }
  }

  &--first-line-uppercase {
    &:deep(p:first-of-type::first-line) {
      text-transform: uppercase;
      font-size: 0.9em;
    }
  }

  .menu-group {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    > * {
      margin: 0 0.5em;
    }
  }
}
</style>
