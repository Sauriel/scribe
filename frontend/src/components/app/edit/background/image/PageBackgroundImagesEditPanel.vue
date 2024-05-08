<template>
  <div class="page-background-image">
    <section v-if="pages.length > 1">
      <header>{{ $t("document.page.select.label") }}</header>
      <dropdown v-model="pageIndex" :items="pages" />
    </section>
    <section>
      <header>{{ $t("document.page.background-image.label") }}</header>
      <sortable-list
        :items="reversedBackgrounds"
        expandable
        @list:change="onListChange"
        @item:delete="onItemDelete"
        @item:duplicate="onItemDuplicate"
      >
        <template #item="{ element, index }">
          <tooltip>
            <label class="change-image" @click="changeImage(element, index)">
              <font-awesome-icon icon="file-image" />
              <span>
                {{ element.name }}
              </span>
            </label>
            <template #tooltip>
              {{ $t("document.page.background-image.tooltip.change") }}
            </template>
          </tooltip>
        </template>
        <template #actions="{ index }">
          <btn
            tile
            small
            icon="arrows-alt"
            class="action-button"
            :disabled="isSelected(index)"
            @click="selectedBackground = index"
          />
        </template>
        <template #expandHeader>
          {{ $t("document.page.background-image.masks") }}
        </template>
        <template #expand="{ element, index }">
          <page-background-mask-selector
            :image="element"
            :format="format"
            :index="backgroundImages.length - 1 - index"
            :page-index="pageIndex"
          />
        </template>
      </sortable-list>
      <btn outline full-width class="file-input-button" @click="openAddImageDialog">
        <font-awesome-icon icon="plus" />
        {{ $t("document.page.background-image.new") }}
      </btn>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Ref } from "vue-property-decorator";
import draggable from "vuedraggable";
import DocumentModel, { PageModel } from "@/models/document";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import BackgroundImage from "@/models/document/images";
import emitter from "@/emitter";
import {
  PageBackgroundImageSelectedEvent,
  PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME,
} from "@/events/page";
import {
  AddPageBackgroundImageAction,
  ChangePageBackgroundImageAction,
  ChangePageBackgroundImageOrderAction,
  DuplicatePageBackgroundImageAction,
  RemovePageBackgroundImageAction,
} from "@/history/page/backgroundImage";
import { SelectedBackground } from "@/models/document/backgrounds";
import { DragAndDropEvent } from "@/models";
import { DocumentStoreActions } from "@/store/document/documentStoreActions";
import { DialogUpdateEvent, DIALOG_UPDATE_EVENT_NAME, IMAGE_INPUT_TAG } from "@/events/dialog";
import { ImageSelectPayload } from "@/components/app/dialog/image/select/ImageSelectDialogContent.vue";
import { ImageInputImage } from "@/components/app/ui/image-input/ImageInput.vue";
import { PageFormat } from "@/models/document/pageFormat";
import PageBackgroundMaskSelector from "@/components/app/document/background/mask/PageBackgroundMaskSelector.vue";
import { cloneDeep } from "lodash";
import { SortableListEvent } from "@/components/app/ui/sortable-list/SortableList.vue";

export const COMPONENT_NAME = "PageBackgroundImagesEditPanel";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  components: {
    draggable,
    PageBackgroundMaskSelector,
  },
  inject: [HISTORY_MANAGER],
})
export default class PageBackgroundImagesEditPanel extends Vue {
  @Ref()
  private readonly fileUpload!: HTMLInputElement;

  private drag = false;

  private get reversedBackgrounds(): BackgroundImage[] {
    return this.selectedPage.backgroundImages.reduce(
      (ary: BackgroundImage[], ele: BackgroundImage) => {
        ary.unshift(ele);
        return ary;
      },
      []
    );
  }

  private get backgrounds(): BackgroundImage[] {
    return this.selectedPage.backgroundImages.reduce(
      (ary: BackgroundImage[], ele: BackgroundImage) => {
        ary.unshift(ele);
        return ary;
      },
      []
    );
  }

  private set backgrounds(value: BackgroundImage[]) {
    this.selectedBackground = -1;
    this.selectedPage.backgroundImages = value.reduce(
      (ary: BackgroundImage[], ele: BackgroundImage) => {
        ary.unshift(ele);
        return ary;
      },
      []
    );
  }

  private isSelected(index: number): boolean {
    return index == this.selectedBackground;
  }

  private get format(): PageFormat {
    return this.document.format;
  }

  private editImagePosition(index: number) {
    if (index >= 0) {
      const invertedIndex = this.backgroundImages.length - 1 - index;
      const event: PageBackgroundImageSelectedEvent = {
        name: PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME,
        payload: invertedIndex,
      };
      emitter.$lateEmit(PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME, event);
    } else {
      const event: PageBackgroundImageSelectedEvent = {
        name: PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME,
        payload: -1,
      };
      emitter.$emit(PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME, event);
    }
  }

  private onListChange(event: DragAndDropEvent<BackgroundImage>) {
    if (event.moved) {
      const oldIndex = this.backgroundImages.length - 1 - event.moved.oldIndex;
      const newIndex = this.backgroundImages.length - 1 - event.moved.newIndex;
      const action = new ChangePageBackgroundImageOrderAction(
        this.pageIndex,
        oldIndex,
        newIndex,
        event.moved.element
      );
      this.history.do(action);
    }
  }

  private get selectedBackground(): number {
    const selected: SelectedBackground | undefined = documentStore.getters(
      DocumentStoreGetters.SELECTED_BACKGROUND_IMAGE
    );
    return selected && selected.page == this.pageIndex
      ? this.backgroundImages.length - 1 - selected.index
      : -1;
  }

  private set selectedBackground(value: number) {
    if (value >= 0) {
      const invertedIndex = this.backgroundImages.length - 1 - value;
      const selected: SelectedBackground = {
        page: this.pageIndex,
        index: invertedIndex,
      };
      documentStore.commit(DocumentStoreMutations.SET_SELECTED_BACKGROUND_IMAGE, selected);
    } else {
      documentStore.commit(DocumentStoreMutations.SET_SELECTED_BACKGROUND_IMAGE, undefined);
    }
    this.editImagePosition(value);
  }

  private get pageIndex(): number {
    const fromStore = documentStore.getters(DocumentStoreGetters.SELECTED_PAGE);
    return fromStore ? fromStore : 0;
  }

  private set pageIndex(value: number) {
    documentStore.dispatch(DocumentStoreActions.SELECT_PAGE, value);
  }

  private get selectedPage(): PageModel {
    return this.document.pages[this.pageIndex];
  }

  private get pages(): DropdownItem[] {
    const pages: DropdownItem[] = [];
    for (let i = 0; i < this.document.pages.length; i++) {
      const page: DropdownItem = {
        name: this.$t("document.page.select.page") + (i + 1),
        value: i,
      };
      pages.push(page);
    }
    return pages;
  }

  private get backgroundImages(): BackgroundImage[] {
    return this.selectedPage.backgroundImages;
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get document(): DocumentModel {
    return documentStore.getters(DocumentStoreGetters.DOCUMENT);
  }

  private addNewImage(image: ImageInputImage) {
    const currentBackgroundCount = this.backgroundImages.length;
    const action = new AddPageBackgroundImageAction(
      this.pageIndex,
      image.name,
      image.src,
      currentBackgroundCount,
      currentBackgroundCount + 1
    );
    this.history.do(action);
  }

  private openAddImageDialog() {
    const event: DialogUpdateEvent<ImageSelectPayload> = {
      name: DIALOG_UPDATE_EVENT_NAME,
      payload: {
        component: IMAGE_INPUT_TAG,
        visible: true,
        payload: {
          image: {
            src: {},
            name: "",
            width: 0,
            height: 0,
          },
          callback: this.addNewImage,
        },
      },
    };
    emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
  }

  private changeImage(image: BackgroundImage, index: number) {
    const invertedIndex = this.backgroundImages.length - 1 - index;
    const originalImage = cloneDeep(image);
    const event: DialogUpdateEvent<ImageSelectPayload> = {
      name: DIALOG_UPDATE_EVENT_NAME,
      payload: {
        component: IMAGE_INPUT_TAG,
        visible: true,
        payload: {
          image: {
            src: image.imageSrc,
            name: image.name,
            width: image.width,
            height: image.height,
          },
          callback: (image: ImageInputImage) => {
            const changedImage: BackgroundImage = {
              maskId: originalImage.maskId,
              name: image.name,
              imageSrc: image.src,
              width: image.width,
              height: image.height,
              position: {
                x: 0,
                y: 0,
              },
            };
            const action = new ChangePageBackgroundImageAction(
              this.pageIndex,
              invertedIndex,
              originalImage,
              changedImage
            );
            this.history.do(action);
            this.selectedBackground = invertedIndex;
          },
        },
      },
    };
    emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
  }

  private onItemDelete(event: SortableListEvent<BackgroundImage>) {
    const invertedIndex = this.backgroundImages.length - 1 - event.index;
    const currentBackgroundCount = this.reversedBackgrounds.length;
    const action = new RemovePageBackgroundImageAction(
      this.pageIndex,
      invertedIndex,
      event.element,
      currentBackgroundCount,
      currentBackgroundCount - 1
    );
    this.history.do(action);
  }

  private onItemDuplicate(event: SortableListEvent<BackgroundImage>) {
    const currentBackgroundCount = this.reversedBackgrounds.length;
    const action = new DuplicatePageBackgroundImageAction(
      this.pageIndex,
      event.element,
      currentBackgroundCount,
      currentBackgroundCount + 1
    );
    this.history.do(action);
  }
}
</script>

<style lang="scss" scoped>
.page-background-image {
  section {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;

    header {
      margin-bottom: 0.25rem;
      font-size: 1.2rem;
      font-weight: bold;
    }
  }

  .background-images {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .file-input-button {
    padding: 10px 20px;
    flex: 1 1 auto;
    width: 100%;
    cursor: pointer;

    &::before {
      z-index: 0;
    }

    svg {
      margin-right: 0.5rem;
    }

    &:deep(strong) {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1 1 auto;
      width: 100%;
      z-index: 1;
    }
  }
}

.change-image {
  cursor: pointer;
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

.action-button {
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
</style>
