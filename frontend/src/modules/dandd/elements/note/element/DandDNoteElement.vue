<template>
  <div :class="scopedClass">
    <custom-css :style="model.customCss" :prefix="scopedClass" />
    <div class="dnd-note" :class="'dnd-note--' + type.toLowerCase()" :style="noteStyle">
      <div class="decoration decoration--top decoration--left" />
      <div class="decoration decoration--top decoration--right" />
      <tip-tap
        v-model="text"
        inline
        :defaults="defaults"
        :historyConfig="tipTapHistoryConfig"
        :locked="locked"
        :document="document"
        @focus="$emit('element:selected', model)"
      >
        <div class="menu-group">
          <dropdown v-model="type" :items="types" />
          <label class="backgrond-color-picker">
            {{ $t("panel.DandDNoteElementPanel.backgroundColor") }}
            <color-picker v-model="backgroundColor" />
          </label>
        </div>
      </tip-tap>
      <div class="decoration decoration--bottom decoration--left" />
      <div class="decoration decoration--bottom decoration--right" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { LayoutElementModel } from "@/modules/ElementModel";
import DandDNoteElementModel, { DandDNoteType, dndNoteDefaults } from "@/modules/dandd/elements/note/DandDNoteElementModel";
import { TipTapHistoryConfig } from "@/components/app/ui/tiptap/TipTap.vue";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import { ChangeDandDNoteBackgroundColorAction, ChangeDandDNoteTypeAction } from "@/modules/dandd/elements/note/historyActions";
import DocumentModel from "@/models/document";
import { getCurrentInstance } from "vue";

@Options({
  inject: [HISTORY_MANAGER],
})
export default class DandDNoteElement extends Vue {
  private defaults = dndNoteDefaults;

  @Prop({ type: Object, required: true })
  private readonly model!: DandDNoteElementModel;

  @Prop({ type: Number, required: true })
  private readonly index!: number;

  @Prop({ type: Object, required: true })
  private readonly layout!: LayoutElementModel;

  @Prop({ type: Boolean, default: false })
  private readonly locked!: boolean;

  @Prop({ type: Object, required: true })
  private readonly document!: DocumentModel;

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private uid = 0;

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private get tipTapHistoryConfig(): TipTapHistoryConfig<DandDNoteElementModel> {
    return {
      object: this.model,
      set: (object, value) => (object.value = value),
      get: (object) => object.value,
    };
  }

  private get noteStyle(): Record<string, string> {
    return {
      backgroundColor: this.model.backgroundColor,
    };
  }

  private get text(): string {
    return this.model.value;
  }

  private set text(value: string) {
    this.model.value = value;
  }

  private get type(): string {
    return this.model.type;
  }

  private set type(value: string) {
    const type = DandDNoteType[value as keyof typeof DandDNoteType];
    const action = new ChangeDandDNoteTypeAction(this.model, this.model.type, type);
    this.history.do(action);
  }

  private get types(): DropdownItem[] {
    return Object.values(DandDNoteType).map((type) => ({
      name: this.$t("panel.DandDNoteElementPanel.type." + type),
      value: type,
    }));
  }

  private get backgroundColor(): string {
    return this.model.backgroundColor;
  }

  private set backgroundColor(value: string) {
    const action = new ChangeDandDNoteBackgroundColorAction(
      this.model,
      this.model.backgroundColor,
      value
    );
    this.history.do(action);
  }

  private get scopedClass(): string {
    return "dnd-note--" + this.uid;
  }
}
</script>

<style lang="scss" scoped>
@import "@/modules/dandd/fonts.scss";
@import "@/modules/dandd/colors.scss";

.dnd-note {
  background-color: #f2edce;
  padding: 8px;
  margin: 16px 0;
  position: relative;

  .decoration {
    position: absolute;

    &--top {
      top: 0;
    }

    &--bottom {
      bottom: 0;
    }

    &--left {
      left: 0;
    }

    &--right {
      right: 0;
    }
  }

  &--note {
    border-top: 2px solid $black;
    border-bottom: 2px solid $black;

    .decoration {
      border: 6px solid transparent;
      width: 12px;
      height: 12px;

      &--top {
        top: -14px;
        border-bottom-color: $black;
        transform-origin: bottom;
        transform: scaleY(0.5);
      }

      &--bottom {
        bottom: -14px;
        border-top-color: $black;
        transform-origin: top;
        transform: scaleY(0.5);
      }

      &--left {
        left: 0;
        border-right-color: $black;
      }

      &--right {
        right: 0;
        border-left-color: $black;
      }
    }
  }

  &--intro {
    border-left: 1px solid $black;
    border-right: 1px solid $black;

    .decoration {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: $black;

      &--top {
        top: -3px;
      }

      &--bottom {
        bottom: -3px;
      }

      &--left {
        left: -3px;
      }

      &--right {
        right: -3px;
      }
    }
  }

  &:deep(.ProseMirror) {
    text-rendering: optimizeLegibility;
    font-family: "Scaly Sans Remake";
    font-size: 8pt;
    line-height: 1.2;
    letter-spacing: 0.5px;
    color: $black;
    position: relative;
  }

  &:deep(p) {
    margin-block-start: 0;
    margin-block-end: 0;
  }

  &:deep(p + p) {
    text-indent: 1em;
  }

  &:deep(h5) {
    font-family: "Scaly Sans Caps";
    font-weight: bold;
    font-size: 10pt;
    color: $black;
    margin-top: 0;
    margin-bottom: 0.2em;
  }

  .menu-group {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    > * {
      margin: 0 0.5em;
    }

    .backgrond-color-picker {
      display: flex;
    }
  }
}
</style>
