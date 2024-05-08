<script lang="ts">
import { Vue, Prop, Options } from "vue-property-decorator";
import DocumentModel from "@/models/document";
import LocalForageHelper, { LocalForageEntry } from "@/helper/LocalForageHelper";
import { CONFIRM_TAG, DialogUpdateEvent, DIALOG_UPDATE_EVENT_NAME } from "@/events/dialog";
import { ConfirmDialogPayload } from "@/components/app/dialog/confirm/ConfirmDialogContent.vue";
import emitter from "@/emitter";
import { NotificationType, NotificationUpdateEvent, NOTIFICATION_UPDATE_EVENT_NAME } from "@/events/notification";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  emits: ["done"]
})
export default class BrowserSave extends Vue {

  @Prop({ type: Object, required: true })
  readonly document!: DocumentModel;

  private saves: LocalForageEntry<string>[] = [];

  mounted() {
    LocalForageHelper.getAllSavedDocumentNames().then((saves) => {
      this.saves = saves;
    });
  }

  private saveReplace(key: string) {
    const event: DialogUpdateEvent<ConfirmDialogPayload> = {
      name: DIALOG_UPDATE_EVENT_NAME,
      payload: {
        component: CONFIRM_TAG,
        visible: true,
        payload: {
          message: "save-document.replace.text",
          abortButton: "save-document.replace.abort",
          confirmButton: "save-document.replace.confirm",
          callback: (confirm: boolean) => {
            if (confirm) {
              LocalForageHelper.save(this.document, key).then(this.saved);
            }
          },
        },
      },
    };
    emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
  }

  private deleteSave(key: string) {
    const event: DialogUpdateEvent<ConfirmDialogPayload> = {
      name: DIALOG_UPDATE_EVENT_NAME,
      payload: {
        component: CONFIRM_TAG,
        visible: true,
        payload: {
          message: "save-document.delete.text",
          abortButton: "save-document.delete.abort",
          confirmButton: "save-document.delete.confirm",
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

  private save() {
    LocalForageHelper.save(this.document).then(this.saved);
  }

  private saved(saveKey?: string) {
    documentStore.commit(DocumentStoreMutations.SET_SAVED_DOCUMENT_KEY, saveKey);
    this.showMessage("save-document.success", "success");
    this.$emit("close");
  }

  private showMessage(messageKey: string, type: NotificationType, closeModal = true) {
    const event: NotificationUpdateEvent = {
      name: NOTIFICATION_UPDATE_EVENT_NAME,
      payload: {
        type: type,
        content: this.$t(messageKey),
        visible: true,
      },
    };
    emitter.$emit(NOTIFICATION_UPDATE_EVENT_NAME, event);
    if (closeModal) {
      this.$emit("done");
    }
  }
}
</script>

<template src="@/components/app/modal/save-document/browser-save/browser-save.template.html" />
<style src="@/components/app/modal/save-document/browser-save/browser-save.style.scss" lang="scss" scoped />