<template>
  <div class="vertical-spacing-edit-panel">
    <heading>{{ $t("panel.VerticalSpacingElementPanel.label") }}</heading>
    <div class="vertical-spacing-width">
      <label>{{ $t("panel.VerticalSpacingElementPanel.height") }}</label>
      <input-field v-model="height" type="number" :step="0.01" />
      <span>{{ unit.suffix }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import DocumentModel from "@/models/document";
import { Unit } from "@/models/document/pageFormat";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import VerticalSpacingElementModel from "@/modules/default/elements/spacing/VerticalSpacingElementModel";
import { ChangeVerticalSpacingHeightAction } from "@/modules/default/elements/spacing/historyActions";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

@Options({
  inject: [HISTORY_MANAGER],
})
export default class VerticalSpacingElementPanel extends Vue {

  @Prop({ type: Object, required: true })
  private readonly document!: DocumentModel;

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get model(): VerticalSpacingElementModel {
    return layoutStore.getters(LayoutStoreGetters.EDIT_PANEL_MODEL);
  }

  private get unit(): Unit {
    return this.document.format.unit;
  }

  private get height(): number {
    return Math.floor((this.model.height / this.unit.pixelPerUnit) * 100) / 100;
  }

  private set height(value: number) {
    const action = new ChangeVerticalSpacingHeightAction(
      this.model,
      this.model.height,
      value * this.unit.pixelPerUnit
    );
    this.history.do(action);
  }
}
</script>
