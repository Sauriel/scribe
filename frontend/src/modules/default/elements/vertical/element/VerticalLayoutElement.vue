<template>
  <div class="vertical-layout">
    <draggable
      class="vertical-layout-rows"
      tag="transition-group"
      group="elements"
      ghost-class="ghost"
      item-key="index"
      handle=".vertical-layout-row--handle"
      :component-data="{
        tag: 'div',
        type: 'transition-group',
        name: !drag ? 'flip-list' : null,
      }"
      :model-value="elements"
      :animation="200"
      :disabled="false"
      @start="drag = true"
      @end="drag = false"
      @change="onListChange"
    >
      <template #item="{ element, index }">
        <vertical-layout-element-entry
          :element="element.value"
          :key="index"
          :index="index"
          :layout="model"
          :parent-context-menu-entries="contextMenuEntries"
          :locked="locked"
          :document="document"
        />
      </template>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import draggable from "vuedraggable";
import { DragAndDropEvent, DragAndDropWrapper, DragAndDropWrapperWithContext } from "@/models";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import VerticalLayoutElementModel from "@/modules/default/elements/vertical/VerticalLayoutElementModel";
import VerticalLayoutElementEntry from "@/modules/default/elements/vertical/element/entry/VerticalLayoutElementEntry.vue";
import ElementModel, { LayoutElementModel } from "@/modules/ElementModel";
import DesignBlock from "@/models/setting/elements";
import {
  AddElementAction,
  MoveElementAction,
  MoveElementBetweenLayoutsAction,
  RemoveElementAction,
} from "@/modules/default/elements/vertical/historyActions";
import VuexHelper from "@/helper/VuexHelper";
import DocumentModel from "@/models/document";
import { ContextMenuEntry } from "@/components/app/ui/context-menu/ContextMenu.vue";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import { LayoutStoreMutations } from "@/store/layout/layoutStoreMutations";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

@Options({
  components: {
    draggable,
    VerticalLayoutElementEntry,
  },
  inject: [HISTORY_MANAGER],
})
export default class VerticalLayoutElement extends Vue {
  @Prop({ type: Object, required: true })
  private readonly model!: VerticalLayoutElementModel;

  @Prop(Number)
  private readonly index?: number;

  @Prop(Object)
  private readonly layout?: LayoutElementModel;

  @Prop(Array)
  private readonly contextMenuEntries?: ContextMenuEntry[];

  @Prop({ type: Boolean, default: false })
  private readonly locked!: boolean;

  @Prop({ type: Object, required: true })
  private readonly document!: DocumentModel;

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get drag(): boolean {
    return layoutStore.getters(LayoutStoreGetters.DRAGGING_ELEMENT);
  }

  private set drag(value: boolean) {
    layoutStore.commit(LayoutStoreMutations.SET_DRAGGING_ELEMENT, value);
  }

  private get elements(): DragAndDropWrapperWithContext<
    ElementModel,
    VerticalLayoutElementModel
  >[] {
    return this.model.elements.map((element: ElementModel, index: number) => ({
      value: element,
      index: index,
      context: this.model,
    }));
  }

  private onListChange(
    event: DragAndDropEvent<
      DragAndDropWrapperWithContext<
        ElementModel,
        VerticalLayoutElementModel | DragAndDropWrapper<DesignBlock>
      >
    >
  ) {
    if (event.added) {
      const value = event.added.element.value;
      // @ts-ignore
      if (value.callbackCreate) {
        // @ts-ignore
        (value as DesignBlock).callbackCreate(
          this.document,
          (element: ElementModel) => {
            this.addElement(element, event.added);
          },
          this.model
        );
        // @ts-ignore
      } else if (value.create) {
        // @ts-ignore
        const element = (value as DesignBlock).create(this.document, this.model);
        this.addElement(element, event.added);
      } else {
        const element = value as ElementModel;
        this.addElement(element, event.added);
      }
    }
    if (event.removed) {
      const element = event.removed.element.value as ElementModel;
      if (event.removed.element.context) {
        // If it has a context it is moved between layouts, the remove will be handled in the other layout
      } else {
        const from = event.removed.oldIndex;
        const action = new RemoveElementAction(
          this.model,
          from,
          element,
          this.model.elements.length,
          this.model.elements.length - 1
        );
        this.history.do(action);
      }
    }
    if (event.moved) {
      const element = event.moved.element.value as ElementModel;
      const from = event.moved.oldIndex;
      const to = event.moved.newIndex;
      const action = new MoveElementAction(this.model, element, from, to);
      this.history.do(action);
    }
  }

  private addElement(element: ElementModel, added: any) {
    if (added.element.context) {
      // If it has a context it is moved between layouts
      const context = added.element.context as VerticalLayoutElementModel;
      const from = context.elements.indexOf(element);
      const to = added.newIndex;
      const action = new MoveElementBetweenLayoutsAction(context, this.model, element, from, to);
      this.history.do(action);
    } else {
      const to = added.newIndex;
      const action = new AddElementAction(
        this.model,
        to,
        element,
        this.model.elements.length,
        this.model.elements.length + 1
      );
      this.history.do(action);
    }
  }
}
</script>

<style lang="scss" scoped>
.vertical-layout {
  display: flex;
  width: 100%;
  min-height: 20px;

  &-rows {
    width: 100%;

    &:deep(li.sortable-chosen.ghost) {
      display: flex;
      justify-content: center;
      align-items: center;
      list-style: none;
      padding: 5px;
      width: 100%;
      color: var(--color-foreground);
      border-radius: var(--border-radius);
      border: 1px solid var(--color-background--dark);
      background-color: var(--color-background--light);
      position: relative;
    }
  }
}
</style>
