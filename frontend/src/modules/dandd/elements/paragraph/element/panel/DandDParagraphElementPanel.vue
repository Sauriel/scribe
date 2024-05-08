<template>
  <heading>{{ $t("panel.DandDParagraphElementPanel.header") }}</heading>
  <div class="dnd-paragraph-panel">
    <tip-tap v-model="text" :defaults="defaults" :historyConfig="tipTapHistoryConfig">
      <input-switch v-model="initial">
        {{ $t("panel.DandDParagraphElementPanel.initial") }}
      </input-switch>
      <input-switch v-model="firstLineUppercase">
        {{ $t("panel.DandDParagraphElementPanel.firstLineUppercase") }}
      </input-switch>
    </tip-tap>
  </div>
  <div>
    <btn full-width @click="openFullscreenModal">
      {{ $t("panel.DandDParagraphElementPanel.fullscreen") }}
    </btn>
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
import { getCurrentInstance } from "vue";
import VuexHelper from "@/helper/VuexHelper";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import DandDParagraphElementModel, { dndParagraphDefaults } from "@/modules/dandd/elements/paragraph/DandDParagraphElementModel";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { TipTapHistoryConfig } from "@/components/app/ui/tiptap/TipTap.vue";
import {
  ChangeDandDParagraphInitialAction,
  ChangeDandDParagraphUppercaseAction,
} from "@/modules/dandd/elements/paragraph/historyActions";
import { openDandDParagraphEditFn } from "@/modules/dandd/elements/paragraph";
import { isEmpty } from "lodash";
import { CSSElementHint } from "@/components/app/ui/css-editor/CSSEditor.vue";
import { ChangeCustomCssAction } from "@/history/custom-css";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

@Options({
  inject: [HISTORY_MANAGER],
})
export default class DandDParagraphElementPanel extends Vue {
  private defaults = dndParagraphDefaults;

  private uid = 0;

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private get tipTapHistoryConfig(): TipTapHistoryConfig<DandDParagraphElementModel> {
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

  private get element(): DandDParagraphElementModel {
    return layoutStore.getters(LayoutStoreGetters.EDIT_PANEL_MODEL);
  }

  private get text(): string {
    return this.element.value;
  }

  private set text(value: string) {
    this.element.value = value;
  }

  private get initial(): boolean {
    return this.element.initial;
  }

  private set initial(value: boolean) {
    const action = new ChangeDandDParagraphInitialAction(this.element, this.element.initial, value);
    this.history.do(action);
  }

  private get firstLineUppercase(): boolean {
    return this.element.firstLineUppercase;
  }

  private set firstLineUppercase(value: boolean) {
    const action = new ChangeDandDParagraphUppercaseAction(
      this.element,
      this.element.firstLineUppercase,
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
    this.history.gracefulDo(action, "DnDParagraph.customCss-" + this.uid, 1000);
  }

  private setCustomCss(value: string) {
    this.customCss = value;
  }

  private get customCssHints(): CSSElementHint[] {
    return [
      {
        selector: ".dnd-paragraph--initial .text-content > p:first-of-type:first-letter",
        description: this.$t("panel.DandDParagraphElementPanel.custom-css.hints.initial"),
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

  private openFullscreenModal() {
    openDandDParagraphEditFn(this.element);
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
}

.tip-tap:deep(.tip-tap-menu) {
  padding: 0.5rem 0 0;

  .menu-group {
    margin-bottom: 0.5rem;
  }
}
</style>
