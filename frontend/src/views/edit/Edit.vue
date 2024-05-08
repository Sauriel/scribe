<template src="@/views/edit/edit.template.html" />

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import LeftSidebar from "@/components/app/global/sidebar/left/LeftSidebar.vue";
import RightSidebar from "@/components/app/global/sidebar/right/RightSidebar.vue";
import Workspace from "@/components/app/global/workspace/Workspace.vue";
import VuexHelper from "@/helper/VuexHelper";
import DocumentModel from "@/models/document";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  components: {
    LeftSidebar,
    RightSidebar,
    Workspace,
  },
})
export default class Edit extends Vue {
  private get document(): DocumentModel {
    return documentStore.getters<DocumentModel>(DocumentStoreGetters.DOCUMENT) as DocumentModel;
  }
}
</script>

<style src="@/views/edit/edit.style.scss" lang="scss" scoped />
