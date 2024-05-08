<template>
  <heading>{{ $t("panel.DandDTableElementPanel.header") }}</heading>
  <div class="settings">
    <label>{{ $t("panel.DandDTableElementPanel.headline") }}</label>
    <input-field v-model="headline" />
  </div>
  <div class="settings">
    <dropdown v-model="type" :items="types" />
    <label>
      <span>{{ $t("panel.DandDTableElementPanel.color") }}</span>
      <color-picker v-model="rowBackgroundColor" />
    </label>
  </div>
  <div>
    <btn full-width @click="openSpreadsheetModal">
      {{ $t("panel.DandDTableElementPanel.spreadsheet") }}
    </btn>
  </div>
  <pro-guard>
    <template #secure-slot="{ secureCall }">
      <dand-d-table-border-panel
        :element="element"
        v-if="isClassTable"
      />
      <css-editor
        :modelValue="customCss"
        :hints="customCssHints"
        @update:modelValue="secureCall(setCustomCss)($event)"
      />
    </template>
  </pro-guard>
</template>

<script lang="ts">
import { Options, Vue } from "vue-property-decorator";
import { getCurrentInstance } from "vue";
import VuexHelper from "@/helper/VuexHelper";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import DandDTableElementModel, { DandDTableType } from "@/modules/dandd/elements/table/DandDTableElementModel";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import { ChangeDandDTableTypeAction } from "@/modules/dandd/elements/table/historyAction";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { ChangeElementTextAction } from "@/history/page/element";
import { openDandDTableEditFn } from "@/modules/dandd/elements/table";
import { CSSElementHint } from "@/components/app/ui/css-editor/CSSEditor.vue";
import { ChangeCustomCssAction } from "@/history/custom-css";
import DandDTableBorderPanel from "./pro/DandDTableBorderPanel.vue";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

@Options({
  inject: [HISTORY_MANAGER],
  components: {
    DandDTableBorderPanel
  }
})
export default class DandDTableElementPanel extends Vue {
  private uid = 0;

  private get element(): DandDTableElementModel {
    return layoutStore.getters(LayoutStoreGetters.EDIT_PANEL_MODEL);
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get rowBackgroundColor(): string {
    return this.element.rowBackground;
  }

  private get isClassTable(): boolean {
    return this.type === DandDTableType.CLASS;
  }

  private set rowBackgroundColor(value: string) {
    const action = new ChangeElementTextAction<DandDTableElementModel>(
      this.element,
      (element) => element.rowBackground,
      (element, value) => (element.rowBackground = value || ""),
      this.element.rowBackground,
      value,
      "action.element.dandd.table.color.change"
    );
    this.history.gracefulDo(action, "DandDTableElementModel.color-" + this.uid);
  }

  private get headline(): string {
    return this.element.headline || "";
  }

  private set headline(value: string) {
    const action = new ChangeElementTextAction<DandDTableElementModel>(
      this.element,
      (element) => element.headline,
      (element, value) => (element.headline = value !== "" ? value : undefined),
      this.element.headline,
      value,
      "action.element.dandd.table.headline.change"
    );
    this.history.gracefulDo(action, "DandDTableElementModel.headline-" + this.uid);
  }

  private get type(): string {
    return this.element.type;
  }

  private set type(value: string) {
    const type = DandDTableType[value as keyof typeof DandDTableType];
    const action = new ChangeDandDTableTypeAction(this.element, this.element.type, type);
    this.history.do(action);
  }

  private get types(): DropdownItem[] {
    return Object.values(DandDTableType).map((type) => ({
      name: this.$t("panel.DandDTableElementPanel.type." + type),
      value: type,
    }));
  }

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private openSpreadsheetModal() {
    openDandDTableEditFn(this.element);
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
    this.history.gracefulDo(action, "DnDTable.customCss-" + this.uid, 1000);
  }

  private setCustomCss(value: string) {
    this.customCss = value;
  }

  private get customCssHints(): CSSElementHint[] {
    return [
      {
        selector: ".dnd-table",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.wrapper.default"),
        long: true
      },
      {
        selector: ".dnd-table--simple",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.wrapper.simple"),
        long: true
      },
      {
        selector: ".class-table-border",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.wrapper.class.border.default"),
        long: true
      },
      {
        selector: ".class-table-border-image",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.wrapper.class.border.image.default"),
        long: true
      },
      {
        selector: ".class-table-border-image--topLeft",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.wrapper.class.border.image.top-left"),
        long: true
      },
      {
        selector: ".class-table-border-image--top",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.wrapper.class.border.image.top"),
        long: true
      },
      {
        selector: ".class-table-border-image--topRight",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.wrapper.class.border.image.top-right"),
        long: true
      },
      {
        selector: ".class-table-border-image--right",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.wrapper.class.border.image.right"),
        long: true
      },
      {
        selector: ".class-table-border-image--bottomRight",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.wrapper.class.border.image.bottom-right"),
        long: true
      },
      {
        selector: ".class-table-border-image--bottom",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.wrapper.class.border.image.bottom"),
        long: true
      },
      {
        selector: ".class-table-border-image--bottomLeft",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.wrapper.class.border.image.bottom-left"),
        long: true
      },
      {
        selector: ".class-table-border-image--left",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.wrapper.class.border.image.left"),
        long: true
      },
      {
        selector: ".dnd-table--class",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.wrapper.class.default"),
        long: true
      },
      {
        selector: "header",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.header")
      },
      {
        selector: "table",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.default")
      },
      {
        selector: "thead",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.thead")
      },
      {
        selector: "tbody",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.tbody")
      },
      {
        selector: "tr",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.tr")
      },
      {
        selector: "th",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.th")
      },
      {
        selector: "td",
        description: this.$t("panel.DandDTableElementPanel.custom-css.hints.table.td")
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
      }
    ];
  }
}
</script>

<style lang="scss" scoped>
.settings {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  label {
    display: flex;
    align-items: center;
  }
}
</style>
