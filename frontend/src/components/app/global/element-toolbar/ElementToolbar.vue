<template>
  <div class="element-toolbar" :class="{ 'element-toolbar--small': isSmall }">
    <ul class="groups">
      <li v-for="(group, index) of elementGroups" :key="'element-grpup-' + index">
        <foldout :open="index <= 1">
          <template #header>
            {{ $t("elements.groups." + group.name + ".title") }}
          </template>
          <draggable
            tag="transition-group"
            ghost-class="ghost"
            item-key="index"
            :component-data="{
              tag: 'ul',
              type: 'transition-group',
              name: !drag ? 'flip-list' : null,
            }"
            :group="{ name: 'elements', pull: 'clone', put: false }"
            :model-value="elements(group.blocks)"
            :animation="200"
            @start="drag = true"
            @end="drag = false"
          >
            <template #item="{ element }">
              <li :class="{ disabled: !element.value.create && !element.value.callbackCreate }">
                <tooltip position="right">
                  <template #tooltip>
                    {{ $t("elements.groups." + group.name + "." + element.value.label) }}
                  </template>
                  <font-awesome-icon :icon="element.value.icon" />
                </tooltip>
              </li>
            </template>
          </draggable>
        </foldout>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import draggable from "vuedraggable";
import { DragAndDropWrapper } from "@/models";
import VuexHelper from "@/helper/VuexHelper";
import DocumentModel from "@/models/document";
import { BASE_SETTING, Setting, SETTINGS } from "@/models/setting";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import DesignBlock, { BASE_BLOCKS } from "@/models/setting/elements";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import { LayoutStoreMutations } from "@/store/layout/layoutStoreMutations";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);
const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

@Options({
  components: {
    draggable,
  },
})
export default class ElementToolbar extends Vue {
  @Prop({ type: Boolean, default: false })
  private readonly small!: boolean;

  private get document(): DocumentModel {
    return documentStore.getters(DocumentStoreGetters.DOCUMENT);
  }

  private get elementGroups(): Setting[] {
    const defaultSetting = this.document.defaults.setting;
    const settings = Object.values(SETTINGS).sort((a: Setting, b: Setting): number => {
      if (a.name == defaultSetting) {
        return -1;
      } else if (b.name == defaultSetting) {
        return 1;
      } else {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      }
    });
    return [BASE_SETTING, ...settings];
  }

  private get isSmall(): boolean {
    return this.small;
  }

  private get drag(): boolean {
    return layoutStore.getters(LayoutStoreGetters.DRAGGING_ELEMENT);
  }

  private set drag(value: boolean) {
    layoutStore.commit(LayoutStoreMutations.SET_DRAGGING_ELEMENT, value);
  }

  private elements(value: DesignBlock[]): DragAndDropWrapper<DesignBlock>[] {
    return value.map((element: DesignBlock, index: number) => ({
      value: element,
      index: index,
    }));
  }
}
</script>

<style lang="scss" scoped>
.element-toolbar {
  &--small {
    width: 130px;

    .foldout:deep(.foldout-header) {
      text-align: center;
      font-size: 0.8em;
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    > li {
      display: flex;
      justify-content: center;
      align-items: center;

      .foldout {
        width: 100%;
      }
    }

    &.groups {
      li {
        border-radius: var(--border-radius);
      }
    }

    &:not(.groups) {
      display: flex;
      flex-wrap: wrap;

      > li {
        flex: 0 1 auto;
        width: calc(50% - 4px);
        aspect-ratio: 1 / 1;
        padding: 5px;
        margin: 2px;
        cursor: grab;

        &.disabled {
          cursor: not-allowed;

          &:deep(.tooltip-trigger) {
            opacity: 0.25;
          }
        }

        &:hover {
          background-color: var(--color-background--light);
          border: 1px solid var(--color-background--dark);
        }

        svg {
          font-size: 2.5rem;
        }

        .tooltip-wrapper {
          width: 100%;

          &:deep(.tooltip-trigger) {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          &:deep(.tooltip) {
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
