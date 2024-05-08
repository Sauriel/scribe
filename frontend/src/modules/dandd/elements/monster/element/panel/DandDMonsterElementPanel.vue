<template>
  <heading>{{ $t("panel.DandDMonsterElementPanel.header") }}</heading>
  <div class="dnd-monster-panel">
    <div class="element-settings">
      <input-switch v-model="twoColumns">
        {{ $t("panel.DandDMonsterElementPanel.columns.two") }}
        <template #off-label>
          {{ $t("panel.DandDMonsterElementPanel.columns.one") }}
        </template>
      </input-switch>
      <div class="setting">
        <header>{{ $t("panel.DandDMonsterElementPanel.numbersFix") }}</header>
        <dropdown v-model="font" :items="fonts" />
      </div>
    </div>
    <btn full-width @click="openMonsterDialog">
      {{ $t("panel.DandDMonsterElementPanel.dialog") }}
    </btn>
    <btn outline alert full-width @click="resetMonster">
      {{ $t("panel.DandDMonsterElementPanel.reset") }}
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
import { Vue, Options, Prop } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import DandDMonsterElementModel, { MONSTER_PRESET_DEFAULT } from "@/modules/dandd/elements/monster/DandDMonsterElementModel";
import { DialogUpdateEvent, DIALOG_UPDATE_EVENT_NAME } from "@/events/dialog";
import emitter from "@/emitter";
import {
  DandDMonsterWizardPayload,
  DANDD_MONSTER_WIZARD_TAG,
} from "@/modules/dandd/elements/monster/element/dialog/wizard/DandDMonsterWizardDialogContent.vue";
import DocumentModel from "@/models/document";
import { cloneDeep } from "lodash";
import {
  ChangeDandDMonsterAction,
  ChangeDandDMonsterTwoColumnsAction,
  ChangeDandDMonsterNumbersFixAction,
} from "@/modules/dandd/elements/monster/historyActions";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import { CSSElementHint } from "@/components/app/ui/css-editor/CSSEditor.vue";
import { ChangeCustomCssAction } from "@/history/custom-css";
import { getCurrentInstance } from "vue";

const SCALY_SANS = "Scaly Sans";
const SCALY_SANS_REMAKE = "Scaly Sans Remake";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

@Options({
  inject: [HISTORY_MANAGER],
})
export default class DandDMonsterElementPanel extends Vue {
  private uid = 0;

  @Prop(Object)
  private readonly document!: DocumentModel;

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private get element(): DandDMonsterElementModel {
    return layoutStore.getters(LayoutStoreGetters.EDIT_PANEL_MODEL) as DandDMonsterElementModel;
  }

  private get twoColumns(): boolean {
    return this.element.twoColumns;
  }

  private set twoColumns(value: boolean) {
    const action = new ChangeDandDMonsterTwoColumnsAction(
      this.element,
      this.element.twoColumns,
      value
    );
    this.history.do(action);
  }

  private get fonts(): DropdownItem[] {
    const fonts = [SCALY_SANS, SCALY_SANS_REMAKE];
    return fonts.map((font) => ({ name: font, value: font }));
  }

  private get font(): string {
    return this.element.numbersFix ? SCALY_SANS : SCALY_SANS_REMAKE;
  }

  private set font(value: string) {
    const numbersFix = value === SCALY_SANS;
    if (this.element.numbersFix !== numbersFix) {
      const action = new ChangeDandDMonsterNumbersFixAction(
        this.element,
        this.element.numbersFix,
        numbersFix
      );
      this.history.do(action);
    }
  }

  private openMonsterDialog() {
    const event: DialogUpdateEvent<DandDMonsterWizardPayload> = {
      name: DIALOG_UPDATE_EVENT_NAME,
      payload: {
        component: DANDD_MONSTER_WIZARD_TAG,
        visible: true,
        payload: {
          edit: true,
          document: this.document,
          model: cloneDeep(this.element),
          callback: (element: DandDMonsterElementModel) => {
            const action = new ChangeDandDMonsterAction(
              this.element,
              this.element.value,
              element.value
            );
            this.history.do(action);
          },
        },
      },
    };
    emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
  }

  private resetMonster() {
    const action = new ChangeDandDMonsterAction(
      this.element,
      this.element.value,
      cloneDeep(MONSTER_PRESET_DEFAULT)
    );
    this.history.do(action);
  }private get customCss(): string {
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
        selector: ".monster",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.monster.default"),
        long: true
      },
      {
        selector: ".monster--two-columns",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.monster.two-columns"),
        long: true
      },
      {
        selector: ".monster--numbers-fix",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.monster.numbers-fix"),
        long: true
      },
      {
        selector: ".basics",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.basics"),
        long: true
      },
      {
        selector: ".name",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.name"),
        long: true
      },
      {
        selector: ".arrow-line",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.arrow-line"),
        long: true
      },
      {
        selector: ".combat-stats",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.combat-stats"),
        long: true
      },
      {
        selector: ".stats",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.stats"),
        long: true
      },
      {
        selector: ".special-traits",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.special-traits"),
        long: true
      },
      {
        selector: ".ability",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.ability.default"),
        long: true
      },
      {
        selector: ".ability-name",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.ability.name"),
        long: true
      },
      {
        selector: ".ability-description",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.ability.description"),
        long: true
      },
      {
        selector: ".ability-italic",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.ability.italic"),
        long: true
      },
      {
        selector: ".ability-text",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.ability.text"),
        long: true
      },
      {
        selector: ".actions",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.actions.default"),
        long: true
      },
      {
        selector: ".action-header",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.actions.header"),
        long: true
      },
      {
        selector: ".actions-list",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.actions.list"),
        long: true
      },
      {
        selector: ".action",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.actions.action"),
        long: true
      },
      {
        selector: ".legendary-description",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.legendary-description"),
        long: true
      },
      {
        selector: ".row",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.row"),
        long: true
      },
      {
        selector: ".double-row",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.double-row"),
        long: true
      },
      {
        selector: ".header",
        description: this.$t("panel.DandDMonsterElementPanel.custom-css.hints.header"),
        long: true
      }
    ];
  }
}
</script>

<style lang="scss" scoped>
.element-settings {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.5em;
  margin-bottom: 1rem;

  &:deep(input) {
    margin: 0 0.5em;
  }

  .setting {
    display: flex;
    gap: 1ch;
  }
}
</style>
