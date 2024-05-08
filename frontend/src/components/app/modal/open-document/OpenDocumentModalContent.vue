<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";
import DocumentStoreHelper from "@/helper/DocumentStoreHelper";
import EncryptionHelper from "@/helper/EncryptionHelper";
import DocumentModel from "@/models/document";
import { ROUTE_NAMES } from "@/router";
import ServerOpen from "./server-open/ServerOpen.vue";
import BrowserOpen from "./browser-open/BrowserOpen.vue";
import { USER_STORE_NAMESPACE } from "@/store/user/userStoreModule";
import { SelectBarEntry } from "../../ui/select-bar/SelectBar.vue";
import { UserStoreGetters } from "@/store/user/userStoreGetters";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);
const userStore = VuexHelper.createNamespace(USER_STORE_NAMESPACE);

declare type OpenDestinationComponent = "server-open" | "browser-open";

@Options({
  emits: ["close"],
  components: {
    ServerOpen,
    BrowserOpen
  }
})
export default class OpenDocumentModalContent extends Vue {

  private destination: OpenDestinationComponent = "browser-open";

  private get destinations(): SelectBarEntry<OpenDestinationComponent>[] {
    const destinations: SelectBarEntry<OpenDestinationComponent>[] = [];
    if (this.isLoggedIn) {
      destinations.push({ name: this.$t("open-document.server.header"), data: "server-open" });
    }
    destinations.push({ name: this.$t("open-document.browser.header"), data: "browser-open" });
    return destinations;
  }

  mounted() {
    if (this.isLoggedIn) {
      this.destination = "server-open";
    }
  }

  private get isLoggedIn(): boolean {
    return !!userStore.getters<boolean>(UserStoreGetters.IS_LOGGED_IN);
  }

  private upload(event: Event) {
    // @ts-ignore
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      // @ts-ignore
      const fileContent = e.target.result as string;
      const document = EncryptionHelper.decrypt<DocumentModel>(fileContent);
      DocumentStoreHelper.resetDocumentStore();
      documentStore.commit(DocumentStoreMutations.SET_DOCUMENT, document);
      documentStore.commit(DocumentStoreMutations.SET_SAVED_DOCUMENT_KEY, undefined);
      this.$router.push({ name: ROUTE_NAMES.edit });
      this.$emit("close");
    };
    reader.readAsText(file);
  }
}
</script>

<template src="@/components/app/modal/open-document/open-document-modal-content.template.html" />
<style src="@/components/app/modal/open-document/open-document-modal-content.style.scss" lang="scss" scoped />
