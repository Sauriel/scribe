<template>
  <div class="columns-settings">
    <div class="columns" v-if="columns.length > 1">
      <heading :info="$t('panel.HorizontalLayoutElementPanel.info')">{{
        $t("panel.HorizontalLayoutElementPanel.columns.label")
      }}</heading>
      <draggable
        class="column-list"
        tag="transition-group"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null,
        }"
        :model-value="columns"
        :animation="200"
        :disabled="false"
        ghost-class="ghost"
        @start="drag = true"
        @end="drag = false"
        @change="onListChange"
        handle=".mover"
        item-key="index"
      >
        <template #item="{ element, index }">
          <horizontal-layout-element-panel-column
            :layout="model"
            :column="element.value"
            :index="index"
          />
        </template>
      </draggable>
    </div>
    <div class="gutter-setting">
      <label>{{ $t("panel.HorizontalLayoutElementPanel.gutter.label") }}</label>
      <input-field v-model="gutter" type="number" :step="0.01" />
      <span>{{ unit.suffix }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import DocumentModel from "@/models/document";
import { Unit } from "@/models/document/pageFormat";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import HorizontalLayoutElementModel, {
  HorizontalLayoutElementColumnModel,
} from "@/modules/default/elements/horizontal/HorizontalLayoutElementModel";
import HorizontalLayoutElementPanelColumn from "@/modules/default/elements/horizontal/element/panel/column/HorizontalLayoutElementPanelColumn.vue";
import draggable from "vuedraggable";
import { DragAndDropEvent, DragAndDropWrapper } from "@/models";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import {
  ChangeColumnGutterAction,
  ChangeColumnOrderAction,
} from "@/modules/default/elements/horizontal/historyActions";

const documentStorage = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);
const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

@Options({
  components: {
    draggable,
    HorizontalLayoutElementPanelColumn,
  },
  inject: [HISTORY_MANAGER],
})
export default class HorizontalLayoutElementPanel extends Vue {
  private drag = false;

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get columns(): DragAndDropWrapper<HorizontalLayoutElementColumnModel>[] {
    return this.model.elements.map(
      (element: HorizontalLayoutElementColumnModel, index: number) => ({
        index: index,
        value: element,
      })
    );
  }

  private get model(): HorizontalLayoutElementModel {
    return layoutStore.getters(LayoutStoreGetters.EDIT_PANEL_MODEL);
  }

  private get document(): DocumentModel {
    return documentStorage.getters(DocumentStoreGetters.DOCUMENT);
  }

  private get unit(): Unit {
    return this.document.format.unit;
  }

  private get gutter(): number {
    return Math.floor((this.model.gutter / this.unit.pixelPerUnit) * 100) / 100;
  }

  private set gutter(value: number) {
    const action = new ChangeColumnGutterAction(this.model, this.model.gutter, value);
    this.history.do(action);
  }

  private onListChange(
    event: DragAndDropEvent<DragAndDropWrapper<HorizontalLayoutElementColumnModel>>
  ) {
    if (event.moved) {
      const oldIndex = event.moved.oldIndex;
      const newIndex = event.moved.newIndex;
      const action = new ChangeColumnOrderAction(
        this.model,
        oldIndex,
        newIndex,
        event.moved.element.value
      );
      this.history.do(action);
    }
  }
}
</script>

<style lang="scss" scoped>
.columns-settings {
  .gutter-setting {
    display: flex;
    align-items: center;

    .input-wrapper {
      margin-left: 0.5rem;
      width: 100px;
    }
  }

  .column-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}
</style>
