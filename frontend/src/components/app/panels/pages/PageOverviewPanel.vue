<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import draggable from "vuedraggable";
import Page from "@/components/document/page/Page.vue";
import VuexHelper from "@/helper/VuexHelper";
import DocumentModel, { PageModel } from "@/models/document";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import { DragAndDropEvent, DragAndDropWrapper } from "@/models";
import { DocumentStoreActions } from "@/store/document/documentStoreActions";
import { ChangePageOrderAction } from "@/history/page";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  components: {
    draggable,
    Page,
  },
  inject: [HISTORY_MANAGER],
})
export default class PageOverviewPanel extends Vue {
  @Prop({ type: Boolean, default: false })
  private readonly onlyView!: boolean;

  @Prop(Object)
  private readonly viewDocument?: DocumentModel;

  private pageHeight = 200;

  private drag = false;

  private get document(): DocumentModel {
    return this.viewDocument || documentStore.getters<DocumentModel>(DocumentStoreGetters.DOCUMENT) as DocumentModel;
  }

  private get pages(): DragAndDropWrapper<PageModel>[] {
    return this.document.pages.map((page: PageModel, index: number) => ({
      value: page,
      index: index,
    }));
  }

  private get selectedPage(): number {
    const selectedPage = documentStore.getters<number>(DocumentStoreGetters.SELECTED_PAGE);
    return selectedPage || 0;
  }

  private set selectedPage(value: number) {
    documentStore.dispatch(DocumentStoreActions.SELECT_PAGE, value);
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private onListChange(event: DragAndDropEvent<DragAndDropWrapper<PageModel>>) {
    if (event.moved) {
      const oldIndex = event.moved.oldIndex;
      const newIndex = event.moved.newIndex;
      const action = new ChangePageOrderAction(oldIndex, newIndex, event.moved.element.value);
      this.history.do(action);
    }
  }

  private get zoom(): number {
    const pageFormat = this.document.format;
    const pixelHeight = pageFormat.height * pageFormat.unit.pixelPerUnit;
    return (100 / pixelHeight) * this.pageHeight;
  }

  private get pagePreviewStyle(): Record<string, string> {
    const pageFormat = this.document.format;
    const pWidth = (this.pageHeight / pageFormat.height) * pageFormat.width;
    return {
      width: pWidth + "px",
      height: this.pageHeight + "px",
    };
  }
}
</script>

<template src="@/components/app/panels/pages/pages.template.html" />
<style src="@/components/app/panels/pages/pages.style.scss" lang="scss" scoped />
