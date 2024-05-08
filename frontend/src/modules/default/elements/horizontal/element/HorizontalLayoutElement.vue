<template>
  <splitpanes
    :key="splitpanesKey"
    class="horizontal-layout"
    :class="{
      'horizontal-layout--zoomed': isOnAZoomedPage,
    }"
    :style="layoutStyle"
    @ready="updateGutters"
    @pane-add="updateGutters"
    @resized="onResized"
    :dbl-click-splitter="false"
  >
    <horizontal-layout-element-entry
      v-for="(column, index) of columns"
      :key="'hlc-' + index"
      :column="column"
      :index="index"
      :layout="model"
      :gutter="halfGutterWithUnit"
      :locked="locked"
      :document="document"
    />
  </splitpanes>
</template>

<script lang="ts">
import { Vue, Options, Prop, Watch } from "vue-property-decorator";
import { getCurrentInstance } from "vue";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import HorizontalLayoutElementModel, {
  HorizontalLayoutConfig,
  HorizontalLayoutElementColumnModel,
} from "@/modules/default/elements/horizontal/HorizontalLayoutElementModel";
import HorizontalLayoutElementEntry from "@/modules/default/elements/horizontal/element/entry/HorizontalLayoutElementEntry.vue";
import { LayoutElementModel } from "@/modules/ElementModel";
import VerticalLayoutElement from "@/modules/default/elements/vertical/element/VerticalLayoutElement.vue";
import { ResizeColumnsAction } from "@/modules/default/elements/horizontal/historyActions";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import DocumentModel from "@/models/document";
import { Unit } from "@/models/document/pageFormat";
import EditPanelHelper from "@/helper/EditPanelHelper";

const documentStorage = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

interface SplitpanePane {
  min: number;
  max: number;
  size: number;
}

@Options({
  components: {
    VerticalLayoutElement,
    HorizontalLayoutElementEntry,
  },
  inject: [HISTORY_MANAGER],
})
export default class HorizontalLayoutElement extends Vue {
  @Prop({ type: Object, required: true })
  private readonly model!: HorizontalLayoutElementModel;

  @Prop(Number)
  private readonly index?: number;

  @Prop(Object)
  private readonly layout?: LayoutElementModel;

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

  private get columns(): HorizontalLayoutElementColumnModel[] {
    return this.model.elements;
  }

  private get splitpanesKey(): string {
    return this.uid + "-" + this.columns.length;
  }

  private get layoutStyle(): Record<string, string> {
    return {
      margin: "0 -" + this.halfGutterWithUnit,
      width: "calc(100% + " + this.gutter + this.unit.suffix + ")",
    };
  }

  private get unit(): Unit {
    return this.document.format.unit;
  }

  private get gutter(): number {
    return Math.floor((this.model.gutter / this.unit.pixelPerUnit) * 100) / 100;
  }

  private get halfGutterWithUnit(): string {
    return this.gutter / 2 + this.unit.suffix;
  }

  @Watch("gutter")
  onGutterChange() {
    this.updateGutters();
  }

  private get isOnAZoomedPage(): boolean {
    const zoom = documentStorage.getters(DocumentStoreGetters.DOCUMENT_ZOOM);
    return zoom && zoom !== 100;
  }

  private onResized(event: SplitpanePane[]) {
    const action = new ResizeColumnsAction(
      this.model,
      this.model.elements.map((m) => ({ width: m.width })),
      this.normalizeWidth(event)
    );
    this.history.do(action);
  }

  private normalizeWidth(panes: SplitpanePane[]): HorizontalLayoutConfig[] {
    const config: HorizontalLayoutConfig[] = [];
    let remainder = 0;
    let total = 0;
    for (const pane of panes) {
      const width = pane.size;
      const rounded = Math.round(width);
      remainder += width - rounded;
      total += rounded;
      config.push({ width: rounded });
    }
    if (remainder !== 0 && total !== 100) {
      const error = {
        panes: panes,
        config: config,
        remainder: remainder,
        total: total,
      };
      console.error("The width could not be normalized.", error);
    }
    return config;
  }

  private updateGutters() {
    const splitters: HTMLDivElement[] = this.$el.querySelectorAll(".splitpanes__splitter");
    for (const splitter of splitters) {
      splitter.removeEventListener("click", this.openEditPanel);
      splitter.addEventListener("click", this.openEditPanel);
    }
  }

  private openEditPanel() {
    EditPanelHelper.setElementEditPanel({ element: this.model });
  }
}
</script>

<style lang="scss" scoped>
.horizontal-layout {
  &:deep(.splitpanes__splitter) {
    box-sizing: border-box;
    position: relative;
    flex-shrink: 0;
    margin-left: -1px;
    width: 0;
  }

  &:hover {
    &:deep(.splitpanes__splitter::before) {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      background-color: var(--color-primary);
      transition: background-color 0.3s;
      transform: translateY(-50%);
      width: 1px;
      height: 30px;
      margin-left: -2px;

      @media print {
        display: none;
      }
    }

    &:deep(.splitpanes__splitter::after) {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      background-color: var(--color-primary);
      transition: background-color 0.3s;
      transform: translateY(-50%);
      width: 1px;
      height: 30px;
      margin-left: 1px;

      @media print {
        display: none;
      }
    }
  }

  &--zoomed {
    // ToDo: Remove when custom component is build
    &:deep(.splitpanes__splitter) {
      display: none;
      pointer-events: none;
    }
  }
}
</style>
