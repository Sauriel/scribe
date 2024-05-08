<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import LocalForageHelper, { LocalForageEntry } from "@/helper/LocalForageHelper";
import { CONFIRM_TAG, DialogUpdateEvent, DIALOG_UPDATE_EVENT_NAME } from "@/events/dialog";
import { ConfirmDialogPayload } from "@/components/app/dialog/confirm/ConfirmDialogContent.vue";
import emitter from "@/emitter";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";
import DocumentStoreHelper from "@/helper/DocumentStoreHelper";
import { ROUTE_NAMES } from "@/router";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  emits: ["done"],
})
export default class BrowserOpen extends Vue {

  private saves: LocalForageEntry<string>[] = [];

  mounted() {
    LocalForageHelper.getAllSavedDocumentNames().then((saves) => {
      this.saves = saves;
    });
  }

  private deleteSave(key: string) {
    const event: DialogUpdateEvent<ConfirmDialogPayload> = {
      name: DIALOG_UPDATE_EVENT_NAME,
      payload: {
        component: CONFIRM_TAG,
        visible: true,
        payload: {
          message: "open-document.delete.text",
          abortButton: "open-document.delete.abort",
          confirmButton: "open-document.delete.confirm",
          callback: (confirm: boolean) => {
            if (confirm) {
              LocalForageHelper.delete(key).then((saves) => {
                this.saves = saves;
              });
            }
          },
        },
      },
    };
    emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
  }

  private open(key: string) {
    LocalForageHelper.load(key).then((document) => {
      DocumentStoreHelper.resetDocumentStore();
      documentStore.commit(DocumentStoreMutations.SET_DOCUMENT, document);
      documentStore.commit(DocumentStoreMutations.SET_SAVED_DOCUMENT_KEY, key);
      this.$router.push({ name: ROUTE_NAMES.edit });
      this.$emit("done");
    });
  }
}
</script>

<template src="@/components/app/modal/open-document/browser-open/browser-open.template.html" />
<style src="@/components/app/modal/open-document/browser-open/browser-open.style.scss" lang="scss" scoped />
