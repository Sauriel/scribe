<template>
  <heading>{{ $t("panel.DandDNoteElementPanel.header") }}</heading>
  <div class="dnd-note-panel">
    <tip-tap v-model="text" :defaults="defaults" :historyConfig="tipTapHistoryConfig">
      <div class="menu-group">
        <dropdown v-model="type" :items="types" />
        <label class="backgrond-color-picker">
          {{ $t("panel.DandDNoteElementPanel.backgroundColor") }}
          <color-picker v-model="backgroundColor" />
        </label>
      </div>
    </tip-tap>
  </div>
  <pro-guard>
    <template #secure-slot="{ secureCall }">
      <css-editor
        :modelValue="customCss"
        :hints="customCssHints"
        @update:modelValue="secureCall(setCustomCss)($event)"
      />
    </template>
  </pro-guard>
</template>

<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import DandDNoteElementModel, { DandDNoteType, dndNoteDefaults } from "@/modules/dandd/elements/note/DandDNoteElementModel";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { TipTapHistoryConfig } from "@/components/app/ui/tiptap/TipTap.vue";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import { ChangeDandDNoteBackgroundColorAction, ChangeDandDNoteTypeAction } from "@/modules/dandd/elements/note/historyActions";
import { getCurrentInstance } from "vue";
import { CSSElementHint } from "@/components/app/ui/css-editor/CSSEditor.vue";
import { ChangeCustomCssAction } from "@/history/custom-css";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

@Options({
  inject: [HISTORY_MANAGER],
})
export default class DandDNoteElementPanel extends Vue {
  private uid = 0;

  private defaults = dndNoteDefaults;

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private get tipTapHistoryConfig(): TipTapHistoryConfig<DandDNoteElementModel> {
    return {
      object: this.element,
      set: (object, value) => (object.value = value),
      get: (object) => object.value,
    };
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get element(): DandDNoteElementModel {
    return layoutStore.getters(LayoutStoreGetters.EDIT_PANEL_MODEL);
  }

  private get text(): string {
    return this.element.value;
  }

  private set text(value: string) {
    this.element.value = value;
  }

  private get type(): string {
    return this.element.type;
  }

  private set type(value: string) {
    const type = DandDNoteType[value as keyof typeof DandDNoteType];
    const action = new ChangeDandDNoteTypeAction(this.element, this.element.type, type);
    this.history.do(action);
  }

  private get types(): DropdownItem[] {
    return Object.values(DandDNoteType).map((type) => ({
      name: this.$t("panel.DandDNoteElementPanel.type." + type),
      value: type,
    }));
  }

  private get backgroundColor(): string {
    return this.element.backgroundColor;
  }

  private set backgroundColor(value: string) {
    const action = new ChangeDandDNoteBackgroundColorAction(
      this.element,
      this.element.backgroundColor,
      value
    );
    this.history.do(action);
  }

  private get customCss(): string {
    return this.element.customCss || "";
  }

  private set customCss(value: string) {
    const action = new ChangeCustomCssAction(
      this.element,
      this.element.customCss,
      value
    );
    this.history.gracefulDo(action, "DnDNote.customCss-" + this.uid, 1000);
  }

  private setCustomCss(value: string) {
    this.customCss = value;
  }

  private get customCssHints(): CSSElementHint[] {
    return [

      {
        selector: ".dnd-note",
        description: this.$t("panel.DandDNoteElementPanel.custom-css.hints.note.default"),
        long: true
      },
      {
        selector: ".dnd-note--note",
        description: this.$t("panel.DandDNoteElementPanel.custom-css.hints.note.note"),
        long: true
      },
      {
        selector: ".dnd-note--intro",
        description: this.$t("panel.DandDNoteElementPanel.custom-css.hints.note.intro"),
        long: true
      },
      {
        selector: ".decoration",
        description: this.$t("panel.DandDNoteElementPanel.custom-css.hints.decoration.default"),
        long: true
      },
      {
        selector: ".decoration--top",
        description: this.$t("panel.DandDNoteElementPanel.custom-css.hints.decoration.top"),
        long: true
      },
      {
        selector: ".decoration--bottom",
        description: this.$t("panel.DandDNoteElementPanel.custom-css.hints.decoration.bottom"),
        long: true
      },
      {
        selector: ".decoration--left",
        description: this.$t("panel.DandDNoteElementPanel.custom-css.hints.decoration.left"),
        long: true
      },
      {
        selector: ".decoration--right",
        description: this.$t("panel.DandDNoteElementPanel.custom-css.hints.decoration.right"),
        long: true
      },
      {
        selector: "p",
        description: this.$t("panel.DandDParagraphElementPanel.custom-css.hints.p")
      },
      {
        selector: "strong",
        description: this.$t("panel.DandDParagraphElementPanel.custom-css.hints.strong")
      },
      {
        selector: "em",
        description: this.$t("panel.DandDParagraphElementPanel.custom-css.hints.em")
      },
      {
        selector: "u",
        description: this.$t("panel.DandDParagraphElementPanel.custom-css.hints.u")
      },
      {
        selector: "s",
        description: this.$t("panel.DandDParagraphElementPanel.custom-css.hints.s")
      },
      {
        selector: "a",
        description: this.$t("panel.DandDParagraphElementPanel.custom-css.hints.a")
      },
      {
        selector: "ul",
        description: this.$t("panel.DandDParagraphElementPanel.custom-css.hints.ul")
      },
      {
        selector: "ol",
        description: this.$t("panel.DandDParagraphElementPanel.custom-css.hints.ol")
      },
      {
        selector: "li",
        description: this.$t("panel.DandDParagraphElementPanel.custom-css.hints.li")
      },
      {
        selector: "img",
        description: this.$t("panel.DandDParagraphElementPanel.custom-css.hints.img")
      }
    ];
  }
}
</script>

<style lang="scss" scoped>
@import "@/modules/dandd/fonts.scss";

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
</style>
