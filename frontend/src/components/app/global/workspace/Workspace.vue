<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import { Going, Waypoint, WaypointState } from "vue-waypoint";
import VueScrollTo, { ScrollOptions } from "vue-scrollto";
import emitter from "@/emitter";
import {
  PageBackgroundImageSelectedEvent,
  PageSelectedEvent,
  PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME,
  PAGE_SELECTED_EVENT_NAME,
} from "@/events/page";
import Page from "@/components/document/page/Page.vue";
import VuexHelper from "@/helper/VuexHelper";
import DocumentModel from "@/models/document";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { AddNewPageAction } from "@/history/page";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";
import EditPanelHelper from "@/helper/EditPanelHelper";
import { COMPONENT_NAME as EDIT_PANEL_DOCUMENT_DEFAULTS } from "@/components/app/edit/document-defaults/DocumentDefaultsEditPanel.vue";
import { HISTORY_CHANGED_EVENT_NAME } from "@/events/history";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  components: {
    Waypoint,
    Page,
  },
  inject: [HISTORY_MANAGER],
})
export default class Workspace extends Vue {
  @Prop({ type: Boolean, default: false })
  private readonly onlyView!: boolean;

  @Prop({ type: Object, required: true })
  private readonly document!: DocumentModel;

  private zoomPresets = [200, 150, 100, 75, 50, 25];

  private scrollToOptions: ScrollOptions = {
    container: "#workspace-pages",
    easing: "ease-in-out",
    cancelable: true,
    onDone: () => {
      this.cancelScrollTo = undefined;
    },
  };
  private cancelScrollTo?: () => void;

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get documentZoom(): number {
    return documentStore.getters<number>(DocumentStoreGetters.DOCUMENT_ZOOM) || 100;
  }

  private set documentZoom(value: number) {
    documentStore.commit(DocumentStoreMutations.SET_DOCUMENT_ZOOM, value);
  }

  private get zoomedPageStyle(): Record<string, string | number> {
    const pageFormat = this.document.format;
    const pHeight = pageFormat.height * pageFormat.unit.pixelPerUnit;
    const pWidth = pageFormat.width * pageFormat.unit.pixelPerUnit;
    return {
      "--page-zoom": this.documentZoom / 100,
      "--page-width": pWidth + "px",
      "--page-height": pHeight + "px",
    };
  }

  private get addNewStyle(): Record<string, string> {
    const pageFormat = this.document.format;
    const pWidth = pageFormat.width * pageFormat.unit.pixelPerUnit;
    return {
      width: pWidth * (this.documentZoom / 100) + "px",
    };
  }

  private historyHash = 0;

  created() {
    emitter.$on(HISTORY_CHANGED_EVENT_NAME, () => this.historyHash++);
    emitter.$on(PAGE_SELECTED_EVENT_NAME, (event: PageSelectedEvent) => {
      if (this.cancelScrollTo) {
        this.cancelScrollTo();
      }
      const pageToScrollTo = document.getElementById("page-" + event.payload);
      this.cancelScrollTo = VueScrollTo.scrollTo(pageToScrollTo, this.scrollToOptions);
    });
  }

  private addPage() {
    const currentPageCount = this.document.pages.length;
    const lastPageIndex = currentPageCount - 1;
    const action = new AddNewPageAction(
      lastPageIndex,
      true,
      currentPageCount,
      currentPageCount + 1
    );
    this.history.do(action);
  }

  private onWaypointChange(state: WaypointState, index: number) {
    if (state.going === Going.In) {
      documentStore.commit(DocumentStoreMutations.SET_SELECTED_PAGE, index);
    }
  }

  private clickedOutside() {
    EditPanelHelper.setElementEditPanel();
    documentStore.commit(DocumentStoreMutations.SET_SELECTED_BACKGROUND_IMAGE, undefined);
    const event: PageBackgroundImageSelectedEvent = {
      name: PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME,
      payload: -1,
    };
    emitter.$emit(PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME, event);
  }

  private openDocumentSettings() {
    EditPanelHelper.setElementEditPanel({ component: EDIT_PANEL_DOCUMENT_DEFAULTS });
  }

  private undo() {
    this.history.undo();
  }

  private redo() {
    this.history.redo();
  }
}
</script>

<template src="@/components/app/global/workspace/workspace.template.html" />
<style src="@/components/app/global/workspace/workspace.style.scss" lang="scss" scoped />
