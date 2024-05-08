<template>
  <pane
    class="horizontal-layout-column"
    :class="{
      'show-border': showBorder,
    }"
    :style="columnStyle"
    :size="width"
    @contextmenu.prevent.stop="showContextMenu"
  >
    <vertical-layout-element
      :model="column"
      :context-menu-entries="contextMenuEntries"
      :class="{ highlighted: isHighlighted }"
      :locked="locked"
      :document="document"
    />
  </pane>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import VerticalLayoutElement from "@/modules/default/elements/vertical/element/VerticalLayoutElement.vue";
import HorizontalLayoutElementModel, {
  HorizontalLayoutElementColumnModel,
} from "@/modules/default/elements/horizontal/HorizontalLayoutElementModel";
import VuexHelper from "@/helper/VuexHelper";
import emitter from "@/emitter";
import { GLOBAL_STORE_NAMESPACE } from "@/store/global/globalStoreModule";
import { GlobalStoreGetters } from "@/store/global/globalStoreGetters";
import {
  ContextMenuConfig,
  ContextMenuEntry,
  SEPERATOR,
} from "@/components/app/ui/context-menu/ContextMenu.vue";
import { ContextMenuShowEvent, CONTEXT_MENU_SHOW_EVENT_NAME } from "@/events/contextmenu";
import {
  AddColumnAction,
  RemoveColumn,
} from "@/modules/default/elements/horizontal/historyActions";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import DocumentModel from "@/models/document";

const globalStore = VuexHelper.createNamespace(GLOBAL_STORE_NAMESPACE);
const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

@Options({
  components: {
    VerticalLayoutElement,
  },
  inject: [HISTORY_MANAGER],
})
export default class HorizontalLayoutElementEntry extends Vue {
  @Prop({ type: Object, required: true })
  private readonly column!: HorizontalLayoutElementColumnModel;

  @Prop({ type: Number, required: true })
  private readonly index!: number;

  @Prop({ type: Object, required: true })
  private readonly layout!: HorizontalLayoutElementModel;

  @Prop({ type: String, required: true })
  private readonly gutter!: string;

  @Prop({ type: Boolean, default: false })
  private readonly locked!: boolean;

  @Prop({ type: Object, required: true })
  private readonly document!: DocumentModel;

  private get columnStyle(): Record<string, string> {
    return {
      padding: "0 " + this.gutter,
    };
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get showBorder(): boolean {
    return !this.locked && !globalStore.getters<boolean>(GlobalStoreGetters.ELEMENT_BORDERS);
  }

  private get width(): number {
    return this.column.width;
  }

  private get contextMenuEntries(): ContextMenuEntry[] {
    return [
      SEPERATOR("document.page.element.default.horizontal.context-menu.column.label"),
      {
        label: "document.page.element.default.horizontal.context-menu.column.add.left",
        class: "new-column new-column--left",
        icon: "plus-circle",
        icon2: "chevron-left",
        action: () => {
          const action = new AddColumnAction(
            this.layout,
            this.index,
            false,
            this.layout.elements.length,
            this.layout.elements.length + 1
          );
          this.history.do(action);
        },
      },
      {
        label: "document.page.element.default.horizontal.context-menu.column.add.right",
        class: "new-column new-column--right",
        icon: "plus-circle",
        icon2: "chevron-right",
        action: () => {
          const action = new AddColumnAction(
            this.layout,
            this.index,
            true,
            this.layout.elements.length,
            this.layout.elements.length + 1
          );
          this.history.do(action);
        },
      },
      {
        label: "document.page.element.default.horizontal.context-menu.column.delete",
        icon: "trash-alt",
        dangerous: true,
        action: () => {
          const action = new RemoveColumn(
            this.layout,
            this.index,
            this.column,
            this.layout.elements.length,
            this.layout.elements.length - 1
          );
          this.history.do(action);
        },
      },
    ];
  }

  private showContextMenu($event: MouseEvent) {
    const payload: ContextMenuConfig = {
      entries: this.contextMenuEntries,
      noWrap: true,
      mousePosition: {
        x: $event.x,
        y: $event.y,
      },
    };
    const event: ContextMenuShowEvent = {
      name: CONTEXT_MENU_SHOW_EVENT_NAME,
      payload: payload,
    };
    emitter.$emit(CONTEXT_MENU_SHOW_EVENT_NAME, event);
  }

  private get isHighlighted(): boolean {
    return layoutStore.getters(LayoutStoreGetters.HIGHLIGHTED_MODEL) === this.column;
  }
}
</script>

<style lang="scss" scoped>
.horizontal-layout-column {
  overflow: visible;

  &:hover,
  &.show-border {
    &:deep(> .vertical-layout) {
      outline: 1px solid #11171a77;

      @media print {
        outline: none;
      }
    }
  }

  > .highlighted {
    outline: 2px solid var(--color-primary);

    @media print {
      outline: none;
    }
  }
}
</style>
