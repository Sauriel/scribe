<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Workspace from "@/components/app/global/workspace/Workspace.vue";
import PageOverviewPanel from "@/components/app/panels/pages/PageOverviewPanel.vue";
import DocumentModel from "@/models/document";
import ExportPanel from "@/components/app/panels/export/ExportPanel.vue";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import DocumentStoreHelper from "@/helper/DocumentStoreHelper";
import { ROUTE_NAMES } from "@/router";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";


const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  components: {
    Workspace,
    PageOverviewPanel,
    ExportPanel
  },
})
export default class View extends Vue {
  private get document(): DocumentModel {
    return this.$route.meta.document as DocumentModel;
  }

  private get author(): string {
    return this.$route.meta.author as string;
  }

  private cloneDocument() {
    DocumentStoreHelper.resetDocumentStore();
    documentStore.commit(DocumentStoreMutations.SET_DOCUMENT, this.document);
    this.$router.push({ name: ROUTE_NAMES.edit });
  }
}
</script>

<template src="@/views/view/view.template.html" />
<style src="@/views/view/view.style.scss" lang="scss" scoped />
