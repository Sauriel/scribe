<template>
  <heading>{{ $t("panel.DandDSpellElementPanel.header") }}</heading>
  <div class="wrapper">
    CONTENT
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
import { getCurrentInstance } from "vue";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { CSSElementHint } from "@/components/app/ui/css-editor/CSSEditor.vue";
import { ChangeCustomCssAction } from "@/history/custom-css";
import DandDSpellElementModel from "../../DandDSpellElementModel";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

@Options({
  inject: [HISTORY_MANAGER],
})
export default class DandDSpellElementPanel extends Vue {
  private uid = 0;

  private get element(): DandDSpellElementModel {
    return layoutStore.getters(LayoutStoreGetters.EDIT_PANEL_MODEL) as DandDSpellElementModel;
  }

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
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
    this.history.gracefulDo(action, "DnDSpell.customCss-" + this.uid, 1000);
  }

  private setCustomCss(value: string) {
    this.customCss = value;
  }

  private get customCssHints(): CSSElementHint[] {
    return [
      {
        selector: "TEXT",
        description: this.$t("panel.DandDSpellElementPanel.custom-css.hints.TEXT")
      }
    ];
  }
}
</script>

<style lang="scss" scoped>
</style>
