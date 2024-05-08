<template>
  <li
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
    @contextmenu.prevent.stop="showContextMenu"
  >
    <div class="mover">
      <font-awesome-icon icon="bars" />
    </div>
    <strong>
      {{ $t("panel.HorizontalLayoutElementPanel.columns.number", { number: index + 1 }) }}
    </strong>
    <div class="column-width">
      <label>{{ $t("panel.HorizontalLayoutElementPanel.columns.width") }}</label>
      <input-field v-model="width" type="number" small suffix="%" />
    </div>
    <div class="actions">
      <btn tile small icon="trash-alt" alert @click="onDelete" />
    </div>
  </li>
</template>

<script lang="ts">
import { Vue, Prop, Options } from "vue-property-decorator";
import HorizontalLayoutElementModel, {
  HorizontalLayoutConfig,
  HorizontalLayoutElementColumnModel,
} from "@/modules/default/elements/horizontal/HorizontalLayoutElementModel";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import {
  AddColumnAction,
  RemoveColumn,
  ResizeColumnsAction,
} from "@/modules/default/elements/horizontal/historyActions";
import { cloneDeep } from "lodash";
import VuexHelper from "@/helper/VuexHelper";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreMutations } from "@/store/layout/layoutStoreMutations";
import { ContextMenuConfig, ContextMenuEntry } from "@/components/app/ui/context-menu/ContextMenu.vue";
import { ContextMenuShowEvent, CONTEXT_MENU_SHOW_EVENT_NAME } from "@/events/contextmenu";
import emitter from "@/emitter";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

@Options({
  inject: [HISTORY_MANAGER],
})
export default class HorizontalLayoutElementPanelColumn extends Vue {
  @Prop({ type: Object, required: true })
  private readonly layout!: HorizontalLayoutElementModel;

  @Prop({ type: Object, required: true })
  private readonly column!: HorizontalLayoutElementColumnModel;

  @Prop({ type: Number, required: true })
  private readonly index!: number;

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get width(): number {
    return this.column.width;
  }

  private set width(value: number) {
    const currentWidths: HorizontalLayoutConfig[] = this.layout.elements.map((m) => ({
      width: m.width,
    }));
    const action = new ResizeColumnsAction(
      this.layout,
      currentWidths,
      this.calculateWidths(currentWidths, value)
    );
    this.history.do(action);
  }

  private calculateWidths(
    currentWidths: HorizontalLayoutConfig[],
    newWidth: number
  ): HorizontalLayoutConfig[] {
    const newWidths = cloneDeep(currentWidths);
    newWidths[this.index].width = newWidth;
    const difference = currentWidths[this.index].width - newWidth;
    if (this.index < currentWidths.length - 1) {
      newWidths[this.index + 1].width += difference;
    } else {
      newWidths[this.index - 1].width += difference;
    }
    return newWidths;
  }

  private onMouseOver() {
    layoutStore.commit(LayoutStoreMutations.SET_HIGHLIGHTED_MODEL, this.column);
  }

  private onMouseLeave() {
    layoutStore.commit(LayoutStoreMutations.SET_HIGHLIGHTED_MODEL, undefined);
  }

  private onDelete() {
    const action = new RemoveColumn(
      this.layout,
      this.index,
      this.column,
      this.layout.elements.length,
      this.layout.elements.length - 1
    );
    this.history.do(action);
  }

  private get contextMenuEntries(): ContextMenuEntry[] {
    return [
      {
        label: "document.page.element.default.horizontal.context-menu.column.add.left",
        class: "new-page new-page--before",
        icon: "plus-circle",
        icon2: "chevron-up",
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
        class: "new-page new-page--after",
        icon: "plus-circle",
        icon2: "chevron-down",
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
        action: this.onDelete,
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
}
</script>

<style lang="scss" scoped>
li {
  border: 1px solid var(--color-foreground);
  border-radius: var(--border-radius);
  position: relative;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;

  > * {
    z-index: 1;
  }

  > .mover {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1rem;
    cursor: move;
  }

  > .column-width {
    display: flex;
    align-items: center;

    > .input-wrapper {
      width: 70px;
      margin-left: 0.5em;

      &::after {
        right: 1em;
      }
    }
  }

  > .actions {
    flex: 0 0 auto;
    display: flex;

    > button {
      margin: 0;
      aspect-ratio: 1/1;
      border: none;

      &:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }

      &:hover {
        border: none;
      }
    }
  }

  &:hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-foreground--light);
    opacity: 0.1;
    border-radius: var(--border-radius);
    z-index: 0;
  }

  &.selected {
    border-color: var(--color-primary--light);
  }
}
</style>
