<template>
  <div
    class="vertical-layout-row"
    :class="{
      'vertical-layout-row--selected': isSelected,
      'show-border': showBorder,
    }"
    @contextmenu.prevent.stop="showContextMenu"
  >
    <div
      v-if="showMoveHandle"
      class="vertical-layout-row--handle"
      :class="{ 'vertical-layout-row--handle--permanent': showMoveHandlePermanent }"
    >
      <font-awesome-icon
        v-if="openEditFn"
        icon="edit"
        class="edit-icon"
        @click="openEditFn(element)"
      />
      <font-awesome-icon icon="grip-horizontal" />
      <font-awesome-icon icon="trash-alt" class="alert delete-icon" @click="deleteRow" />
    </div>
    <component
      v-if="element.component"
      ref="componentElement"
      :class="{ 'vertical-layout-row-component--disabled-on-drag': isDragging && isNoLayoutElement }"
      :is="element.component"
      :model="element"
      :index="index"
      :layout="layout"
      :locked="locked"
      :document="document"
      @element:selected="openEditPanel"
    />
    <span v-else style="color: black">
      {{ element }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Options, Ref } from "vue-property-decorator";
import ElementModel, { LayoutElementModel } from "@/modules/ElementModel";
import {
  ContextMenuConfig,
  ContextMenuEntry,
  SEPERATOR,
} from "@/components/app/ui/context-menu/ContextMenu.vue";
import emitter from "@/emitter";
import { CONTEXT_MENU_SHOW_EVENT_NAME, ContextMenuShowEvent } from "@/events/contextmenu";
import VuexHelper from "@/helper/VuexHelper";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import {
  DuplicateElementAction,
  RemoveElementAction,
} from "@/modules/default/elements/vertical/historyActions";
import EditPanelHelper from "@/helper/EditPanelHelper";
import { GLOBAL_STORE_NAMESPACE } from "@/store/global/globalStoreModule";
import { GlobalStoreGetters } from "@/store/global/globalStoreGetters";
import { OpenEditFunctions } from "@/modules";
import html2canvas from "html2canvas";
import DocumentModel from "@/models/document";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);
const globalStore = VuexHelper.createNamespace(GLOBAL_STORE_NAMESPACE);

@Options({
  inject: [HISTORY_MANAGER],
})
export default class VerticalLayoutElementEntry extends Vue {
  @Ref()
  private readonly componentElement!: Vue;

  @Prop({ type: Object, required: true })
  private readonly element!: ElementModel;

  @Prop({ type: Number, required: true })
  private readonly index!: number;

  @Prop({ type: Object, required: true })
  private readonly layout!: LayoutElementModel;

  @Prop(Array)
  private readonly parentContextMenuEntries?: ContextMenuEntry[];

  @Prop({ type: Boolean, default: false })
  private readonly locked!: boolean;

  @Prop({ type: Object, required: true })
  private readonly document!: DocumentModel;

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get isDragging(): boolean {
    return layoutStore.getters(LayoutStoreGetters.DRAGGING_ELEMENT);
  }

  private get isNoLayoutElement(): boolean {
    return !(this.element as LayoutElementModel).elements;
  }

  private get showBorder(): boolean {
    return !this.locked && (
      !!globalStore.getters<boolean>(GlobalStoreGetters.ELEMENT_BORDERS) ||
      !!layoutStore.getters<boolean>(LayoutStoreGetters.DRAGGING_ELEMENT)
    );
  }

  private get isSelected(): boolean {
    return layoutStore.getters(LayoutStoreGetters.EDIT_PANEL_MODEL) === this.element;
  }

  private get showMoveHandle(): boolean {
    return this.showMoveHandlePermanent ? this.isSelected : true;
  }

  private get showMoveHandlePermanent(): boolean {
    return !globalStore.getters(GlobalStoreGetters.MOVE_HANDLER_ON_HOVER);
  }

  private openEditPanel() {
    EditPanelHelper.setElementEditPanel({ element: this.element });
  }

  private get openEditFn(): () => void | undefined {
    // @ts-ignore
    return OpenEditFunctions[this.element.component];
  }

  private deleteRow() {
    const from = this.index;
    const action = new RemoveElementAction(
      this.layout,
      from,
      this.element,
      this.layout.elements.length,
      this.layout.elements.length - 1
    );
    if (EditPanelHelper.editPanelForElementIsShown(this.element)) {
      EditPanelHelper.setElementEditPanel();
    }
    this.history.do(action);
  }

  private get contextMenuEntries(): ContextMenuEntry[] {
    return [
      SEPERATOR("panel." + this.element.component + "Panel.label"),
      {
        label: "document.page.element.default.vertical.context-menu.edit",
        icon: "edit",
        action: this.openEditPanel,
      },
      {
        label: "document.page.element.default.vertical.context-menu.duplicate",
        icon: "copy",
        action: () => {
          const from = this.index;
          const action = new DuplicateElementAction(
            this.layout,
            from,
            this.layout.elements.length,
            this.layout.elements.length + 1
          );
          this.history.do(action);
        },
      },
      {
        label: "document.page.element.default.vertical.context-menu.export",
        icon: "file-download",
        action: () => {
          // ToDo: Make margin and scale configurable
          const element: HTMLElement = this.componentElement.$el;
          const margin = 30;
          const textSize = 10;
          const canvasWidth = element.getBoundingClientRect().width + 2 * margin;
          const canvasHeight = element.getBoundingClientRect().height + 2 * margin + textSize * 2;
          const copyright = element.appendChild(document.createElement("span"));
          copyright.innerHTML = "Created with Scribe (scribe.sauriel.net)";
          copyright.style.position = "absolute";
          copyright.style.bottom = (margin + textSize) * -1 + "px";
          copyright.style.right = "0";
          element.style.position = "relative";
          html2canvas(element, {
            scale: 2,
            x: margin * -1,
            y: margin * -1,
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: null,
            allowTaint: true,
            useCORS: true,
            ignoreElements: (element: Element): boolean =>
              element.classList.contains("no-image-export"),
          }).then((canvas: HTMLCanvasElement) => {
            element.style.position = "";
            copyright.remove();
            const link = document.createElement("a");
            link.download = this.element.component + ".png";
            link.href = canvas.toDataURL("image/png");
            link.click();
          });
        },
      },
      {
        label: "document.page.element.default.vertical.context-menu.delete",
        icon: "trash-alt",
        dangerous: true,
        action: this.deleteRow,
      },
    ];
  }

  private showContextMenu($event: MouseEvent) {
    const payload: ContextMenuConfig = {
      entries: this.parentContextMenuEntries
        ? this.parentContextMenuEntries.concat(this.contextMenuEntries)
        : this.contextMenuEntries,
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
.vertical-layout-row {
  position: relative;
  flex: 0 0 auto;

  &-component--disabled-on-drag {
    pointer-events: none;
  }

  &--handle {
    background-color: #11171a77;
    color: var(--color-foreground);
    position: absolute;
    top: -30px;
    left: 50%;
    margin-left: -90px;
    display: none;
    width: 180px;
    height: 30px;
    z-index: 200;
    font-size: 1.5rem;
    line-height: 0;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    cursor: move;

    @media print {
      display: none;
    }

    &::before,
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 15px;
      width: 15px;
      height: 15px;
      background-color: #11171a77;
    }

    &::before {
      left: -15px;
      mask-image: radial-gradient(circle at top left, transparent 0, transparent 15px, black 16px);
      -webkit-mask-image: radial-gradient(circle at top left, transparent 0, transparent 15px, black 16px);
    }

    &::after {
      right: -15px;
      mask-image: radial-gradient(circle at top right, transparent 0, transparent 15px, black 16px);
      -webkit-mask-image: radial-gradient(circle at top right, transparent 0, transparent 15px, black 16px);
    }

    &--permanent {
      display: flex;

      @media print {
        display: none;
      }
    }

    .edit-icon,
    .delete-icon {
      font-size: 1rem;
      position: absolute;
      top: 0.4rem;
      cursor: pointer;
    }

    .delete-icon {
      right: 1rem;

      &:hover {
        color: var(--color-alert--light);
      }
    }

    .edit-icon {
      left: 1rem;

      &:hover {
        color: var(--color-foreground--light);
      }
    }
  }

  &:hover,
  &.show-border {
    outline: 1px solid #11171a77;

    @media print {
      outline: none;
    }
  }

  &:hover {
    > .vertical-layout-row--handle {
      display: flex;

      @media print {
        display: none;
      }
    }
  }

  &--selected,
  &--selected.show-border {
    outline: 1px solid var(--color-secondary--dark);

    @media print {
      outline: none;
    }
  }

  .element-context-menu {
    color: var(--color-foreground);
  }
}
</style>
