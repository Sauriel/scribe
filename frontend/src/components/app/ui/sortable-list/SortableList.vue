<template>
  <draggable
    class="sortable-list"
    tag="transition-group"
    :component-data="{
      tag: 'ul',
      type: 'transition-group',
      name: !drag ? 'flip-list' : null,
    }"
    :model-value="itemsInternal"
    :animation="200"
    :disabled="false"
    ghost-class="ghost"
    @start="drag = true"
    @end="drag = false"
    @change="onChange"
    handle=".mover"
    item-key="index"
  >
    <template #item="{ element, index }">
      <li
        class="sortable-list-entry"
        :key="index"
        @contextmenu.prevent="showContextMenu($event, element.value, index)"
        :style="{
          zIndex: items.length - index,
        }"
      >
        <div class="sortable-list-entry-content">
          <div class="mover">
            <font-awesome-icon icon="bars" />
          </div>
          <slot name="item" :element="element.value" :index="index" />
          <div class="actions">
            <slot name="actions" :element="element.value" :index="index" />
            <btn tile small icon="trash-alt" alert @click="removeElement(element.value, index)" />
          </div>
        </div>
        <foldout v-if="expandable">
          <template #header>
            <slot name="expandHeader" />
          </template>
          <slot name="expand" :element="element.value" :index="index" />
        </foldout>
      </li>
    </template>
  </draggable>
</template>

<script lang="ts">
import emitter from "@/emitter";
import { ContextMenuShowEvent, CONTEXT_MENU_SHOW_EVENT_NAME } from "@/events/contextmenu";
import { DragAndDropEvent, DragAndDropWrapper } from "@/models";
import { Vue, Options, Prop } from "vue-property-decorator";
import draggable from "vuedraggable";
import { ContextMenuConfig } from "@/components/app/ui/context-menu/ContextMenu.vue";

export interface SortableListEvent<T> {
  element: T;
  index: number;
}

@Options({
  components: {
    draggable,
  },
})
export default class SortableList extends Vue {
  @Prop({ type: Array, required: true })
  private readonly items!: any[];

  @Prop({ type: Boolean, default: false })
  private readonly expandable!: boolean;

  private get itemsInternal(): DragAndDropWrapper<any>[] {
    return this.items.map((element: any, index: number) => ({
      value: element,
      index: index,
    }));
  }

  private drag = false;

  private onChange(event: DragAndDropEvent<any>) {
    this.$emit("list:change", event);
  }

  private removeElement(element: DragAndDropWrapper<any>, index: number) {
    const event: SortableListEvent<any> = {
      element: element.value,
      index: index,
    };
    this.$emit("item:delete", event);
  }

  private duplicateElement(element: any, index: number) {
    const event: SortableListEvent<any> = {
      element: element,
      index: index,
    };
    this.$emit("item:duplicate", event);
  }

  private showContextMenu($event: MouseEvent, element: any, index: number) {
    const eventWrapper: SortableListEvent<any> = {
      element: element,
      index: index,
    };
    const payload: ContextMenuConfig = {
      entries: [
        {
          label: "sortable-list.duplicate",
          action: () => this.duplicateElement(element, index),
        },
        {
          label: "sortable-list.delete",
          icon: "trash-alt",
          dangerous: true,
          action: () => this.removeElement(element, index),
        },
      ],
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
.sortable-list {
  list-style: none;
  padding: 0;
  margin: 0;

  .sortable-list-entry {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-foreground);
    border-radius: var(--border-radius);
    position: relative;
    margin-bottom: 0.5rem;

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

    &:deep(.foldout) {
      z-index: 1;
    }

    &:deep(.foldout-header) {
      font-size: 0.7rem;
      text-align: center;
      padding-top: 2px;
      padding-bottom: 2px;
    }

    &:deep(.foldout-header > svg) {
      margin-top: -6px;
    }

    &:deep(.foldout:not(.foldout--open) .foldout-header) {
      border-bottom-left-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }

    > .sortable-list-entry-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 1;

      > .mover {
        flex: 0 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 1rem;
        cursor: move;
      }

      label {
        display: flex;
        align-items: center;
        justify-content: space-between;

        > span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 150px;
          display: inline-block;
          margin-left: 0.5rem;
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
    }
  }
}
</style>
