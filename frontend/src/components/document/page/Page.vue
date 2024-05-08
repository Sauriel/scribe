<template src="@/components/document/page/page.template.html" />

<script lang="ts">
import { Vue, Ref, Prop, Options } from "vue-property-decorator";
import emitter from "@/emitter";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import {
  PageBackgroundImageSelectedEvent,
  PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME,
} from "@/events/page";
import DocumentModel, {
  PageDefaults,
  PageFooter,
  PageModel,
  PagingPosition,
} from "@/models/document";
import { PageFormat } from "@/models/document/pageFormat";
import { BACKGROUNDS } from "@/models/document/backgrounds";
import { COMPONENT_NAME as EDIT_PANEL_DOCUMENT_DEFAULTS } from "@/components/app/edit/document-defaults/DocumentDefaultsEditPanel.vue";
import { COMPONENT_NAME as EDIT_PANEL_PAGE_BACKGROUND } from "@/components/app/edit/background/PageBackgroundEditPanel.vue";
import { COMPONENT_NAME as EDIT_PANEL_PAGE_BACKGROUND_IMAGE } from "@/components/app/edit/background/image/PageBackgroundImagesEditPanel.vue";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { AddNewPageAction, DuplicatePageAction, RemovePageAction } from "@/history/page";
import ResizableMaskImage, {
  ResizableMaskImageConfig,
  SimpleDOMRect,
} from "@/components/app/ui/resizable-mask-image/ResizableMaskImage.vue";
import BackgroundImage from "@/models/document/images";
import { cloneDeep, isEqual } from "lodash";
import { ChangePageBackgroundImageAction } from "@/history/page/backgroundImage";
import { DocumentStoreActions } from "@/store/document/documentStoreActions";
import VerticalLayoutElement from "@/modules/default/elements/vertical/element/VerticalLayoutElement.vue";
import VerticalLayoutElementModel, {
  create as createVerticalLayout,
} from "@/modules/default/elements/vertical/VerticalLayoutElementModel";
import {
  ContextMenuConfig,
  ContextMenuEntry,
  SEPERATOR,
} from "@/components/app/ui/context-menu/ContextMenu.vue";
import { CONTEXT_MENU_SHOW_EVENT_NAME, ContextMenuShowEvent } from "@/events/contextmenu";
import EditPanelHelper from "@/helper/EditPanelHelper";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  components: {
    ResizableMaskImage,
    VerticalLayoutElement,
  },
  inject: [HISTORY_MANAGER],
})
export default class Page extends Vue {
  @Prop({ type: Number, required: true })
  private readonly index!: number;

  @Prop({ type: Boolean, default: false })
  private readonly locked!: boolean;

  @Ref()
  private readonly bgWrapper!: HTMLElement;

  @Prop({ type: Number, required: true })
  private readonly zoom!: number;

  @Prop({ type: Object, required: true })
  private readonly document!: DocumentModel;

  private get elements(): VerticalLayoutElementModel {
    return createVerticalLayout(this.document, this.page.elements);
  }

  private editBackgroundImageId = -1;
  private editBackup?: BackgroundImage;

  private backgroundsRect: SimpleDOMRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  private get backgroundImages(): ResizableMaskImageConfig[] {
    const backgroundImages = this.page.backgroundImages || [];
    return backgroundImages.map((image) => ({
      image: image,
      format: this.format,
    }));
  }

  private isSelectedBackgroundImage(index: number): boolean {
    let selectedPageId = documentStore.getters(DocumentStoreGetters.SELECTED_PAGE);
    selectedPageId = selectedPageId ? selectedPageId : 0;
    return selectedPageId === this.index ? index === this.editBackgroundImageId : false;
  }

  private get hasSelectedBackgroundImage(): boolean {
    let selectedPageId = documentStore.getters(DocumentStoreGetters.SELECTED_PAGE);
    selectedPageId = selectedPageId ? selectedPageId : 0;
    const hasEditBackgroundImage = this.editBackgroundImageId >= 0;
    return selectedPageId === this.index ? hasEditBackgroundImage : false;
  }

  mounted() {
    this.backgroundsRect.x = this.bgWrapper.getBoundingClientRect().x;
    this.backgroundsRect.y = this.bgWrapper.getBoundingClientRect().y;
    this.backgroundsRect.width = this.bgWrapper.getBoundingClientRect().width;
    this.backgroundsRect.height = this.bgWrapper.getBoundingClientRect().height;
  }

  private get page(): PageModel {
    return this.document.pages[this.index];
  }

  private get format(): PageFormat {
    return this.document.format;
  }

  private get defaults(): PageDefaults {
    return this.document.defaults;
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get pageStyle(): Record<string, string> {
    return {
      width: this.format.width + this.format.unit.suffix,
      height: this.format.height + this.format.unit.suffix,
      transform: "scale(" + this.zoom / 100 + ")",
    };
  }

  private get backgroundStyle(): Record<string, string> {
    return {
      backgroundImage: "url(" + this.background + ")",
    };
  }

  private get contentStyle(): Record<string, string> {
    return {
      marginTop: "45px",
      marginLeft: "75px",
      marginBottom: "70px",
      marginRight: "75px",
    };
  }

  private get footerStyle(): Record<string, string> {
    return {
      width: this.format.width + this.format.unit.suffix,
    };
  }

  created() {
    emitter.$on(
      PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME,
      (event: PageBackgroundImageSelectedEvent) => {
        this.editBackgroundImageId = event.payload;
        this.editBackup = this.backgroundImages[event.payload]
          ? cloneDeep(this.backgroundImages[event.payload].image)
          : undefined;
      }
    );
  }

  private onModelChange(value: ResizableMaskImageConfig, bgIndex: number) {
    if (this.editBackup && !isEqual(value.image, this.editBackup)) {
      const image = cloneDeep(value.image);
      value.image.position = this.editBackup.position; // Reset Position;
      value.image.width = this.editBackup.width; // Reset Width;
      value.image.height = this.editBackup.height; // Reset height;
      const action = new ChangePageBackgroundImageAction(
        this.index,
        bgIndex,
        this.editBackup,
        image
      );
      this.history.do(action);
      this.editBackup = cloneDeep(image);
    }
  }

  private get background(): string {
    const defaultBackground = BACKGROUNDS.flatMap((bg) => bg.backgrounds).find(
      (bg) => bg.id == this.defaults.background
    );
    if (this.page.background) {
      const pageBackground = BACKGROUNDS.flatMap((bg) => bg.backgrounds).find(
        (bg) => bg.id == this.page.background
      );
      if (pageBackground) {
        return pageBackground.src;
      }
    }
    return defaultBackground ? defaultBackground.src : "";
  }

  private get contextMenuEntries(): ContextMenuEntry[] {
    return [
      {
        label: "document.page.context-menu.new.before",
        class: "new-page new-page--before",
        icon: "plus-circle",
        icon2: "chevron-up",
        action: () => {
          const currentPageCount = this.document.pages.length;
          const action = new AddNewPageAction(
            this.index,
            false,
            currentPageCount,
            currentPageCount + 1
          );
          this.history.do(action);
        },
      },
      {
        label: "document.page.context-menu.new.after",
        class: "new-page new-page--after",
        icon: "plus-circle",
        icon2: "chevron-down",
        action: () => {
          const currentPageCount = this.document.pages.length;
          const action = new AddNewPageAction(
            this.index,
            true,
            currentPageCount,
            currentPageCount + 1
          );
          this.history.do(action);
        },
      },
      {
        label: "document.page.context-menu.duplicate",
        icon: "copy",
        action: () => {
          const currentPageCount = this.document.pages.length;
          const action = new DuplicatePageAction(
            this.index,
            currentPageCount,
            currentPageCount + 1
          );
          this.history.do(action);
        },
      },
      {
        label: "document.page.context-menu.delete",
        icon: "trash-alt",
        dangerous: true,
        disabled: this.document.pages.length === 1,
        action: () => {
          const currentPageCount = this.document.pages.length;
          const action = new RemovePageAction(
            this.index,
            this.page,
            currentPageCount,
            currentPageCount - 1
          );
          this.history.do(action);
        },
      },
      SEPERATOR("document.page.context-menu.settings.label"),
      {
        label: "document.page.context-menu.settings.background",
        action: () => {
          documentStore.dispatch(DocumentStoreActions.SELECT_PAGE, this.index);
          EditPanelHelper.setElementEditPanel({ component: EDIT_PANEL_PAGE_BACKGROUND });
        },
      },
      {
        label: "document.page.context-menu.settings.background_image",
        action: () => {
          documentStore.dispatch(DocumentStoreActions.SELECT_PAGE, this.index);
          EditPanelHelper.setElementEditPanel({ component: EDIT_PANEL_PAGE_BACKGROUND_IMAGE });
        },
      },
      SEPERATOR("document.page.context-menu.defaults.label"),
      {
        label: "document.page.context-menu.defaults.change",
        action: () => {
          EditPanelHelper.setElementEditPanel({ component: EDIT_PANEL_DOCUMENT_DEFAULTS });
        },
      },
    ];
  }

  private showContextMenu($event: MouseEvent) {
    if (!this.locked) {
      const payload: ContextMenuConfig = {
        entries: this.contextMenuEntries,
        noWrap: true,
        alignRight: this.locked,
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

  private get footer(): PageFooter | undefined {
    return this.page.footer || this.defaults.footer || undefined;
  }

  private get footerImage(): string | undefined {
    return this.footer?.image?.url || this.footer?.image?.data || undefined;
  }

  private get pagingPosition(): PagingPosition {
    const position = this.footer?.paging.position || "right";
    const alternate = this.footer?.paging.alternate || false;
    if (alternate) {
      const alternatePosition: PagingPosition = position === "left" ? "right" : "left";
      return this.index % 2 === 0 ? position : alternatePosition;
    }
    return position;
  }
}
</script>

<style src="@/components/document/page/page.style.scss" lang="scss" scoped />
