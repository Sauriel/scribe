<template>
  <div class="page-background">
    <section v-if="pages.length > 1">
      <header>{{ $t("document.page.select.label") }}</header>
      <dropdown v-model="pageIndex" :items="pages" />
    </section>
    <section>
      <header>{{ $t("document.page.background.label") }}</header>
      <page-background-selector v-model="background" :format="document.format" />
      <btn outline full-width @click="clearBackground">
        {{ $t("document.page.background.clear") }}
      </btn>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import DocumentModel, { PageModel } from "@/models/document";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import PageBackgroundSelector from "@/components/app/document/background/PageBackgroundSelector.vue";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import { ChangePageBackgroundAction } from "@/history/page";
import { DocumentStoreActions } from "@/store/document/documentStoreActions";

export const COMPONENT_NAME = "PageBackgroundEditPanel";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  components: {
    PageBackgroundSelector,
  },
  inject: [HISTORY_MANAGER],
})
export default class PageBackgroundEditPanel extends Vue {
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

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get document(): DocumentModel {
    return documentStore.getters(DocumentStoreGetters.DOCUMENT);
  }

  private get background(): string {
    return this.selectedPage.background ? this.selectedPage.background : "";
  }

  private set background(value: string) {
    const currentValue = this.selectedPage.background;
    const action = new ChangePageBackgroundAction(this.pageIndex, currentValue, value);
    this.history.do(action);
  }

  private clearBackground() {
    const currentValue = this.selectedPage.background;
    const action = new ChangePageBackgroundAction(this.pageIndex, currentValue, undefined);
    this.history.do(action);
  }
}
</script>

<style lang="scss" scoped>
.page-background {
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
}
</style>
