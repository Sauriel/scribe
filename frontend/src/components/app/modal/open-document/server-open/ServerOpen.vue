<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import DocumentModel from "@/models/document";
import { CONFIRM_TAG, DialogUpdateEvent, DIALOG_UPDATE_EVENT_NAME } from "@/events/dialog";
import { ConfirmDialogPayload } from "@/components/app/dialog/confirm/ConfirmDialogContent.vue";
import emitter from "@/emitter";
import { NotificationType, NotificationUpdateEvent, NOTIFICATION_UPDATE_EVENT_NAME } from "@/events/notification";
import ApolloService, { APOLLO_SERVICE } from "@/services/ApolloService";
import docFindSchema from "@/graphql/document/doc_find.gql";
import docListSchema from "@/graphql/document/doc_list.gql";
import docDeleteSchema from "@/graphql/document/doc_delete.gql";
import { DocFindQuery, DocListQuery, Document as GQLDocument, DocDeleteMutation } from "@/graphql/document/models";
import { SelectBarEntry } from "@/components/app/ui/select-bar/SelectBar.vue";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";
import DocumentStoreHelper from "@/helper/DocumentStoreHelper";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { ROUTE_NAMES } from "@/router";

const KB_MB_DIVIDE = 512 * 1024; // 0.5 MB
const DOCUMENT_WARNING_PERCENTAGE = 0.9;

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  emits: ["done"],
  inject: [ APOLLO_SERVICE ]
})
export default class ServerOpen extends Vue {

  private get apollo(): ApolloService {
    // @ts-ignore
    return this.apolloService;
  }

  private listView = true;

  private views: SelectBarEntry<boolean>[] =[
    { icon: "list", data: true },
    { icon: "grip-horizontal", data: false }
  ];

  private serverSaves: GQLDocument[] = [];
  private allowPrivate = false;
  private serverDocumentCount = 0;
  private serverMaxDocuments = 0;
  private serverTotalSize = 0;
  private serverMaxSize = 0;

  private get serverTotalSizeMB(): number {
    return this.toMB(this.serverTotalSize);
  }

  private get serverMaxSizeMB(): number {
    return this.toMB(this.serverMaxSize);
  }

  private fileSize(byte: number): string {
    if (byte < KB_MB_DIVIDE) {
      return this.$t("global.file-size.kb", { size: this.toKB(byte) });
    } else {
      return this.$t("global.file-size.mb", { size: this.toMB(byte) });
    }
  }

  private toKB(byte: number): number {
    return Math.floor(byte / 1024 * 100) / 100;
  }


  private toMB(byte: number): number {
    return Math.floor(byte / 1024 / 1024 * 100) / 100;
  }

  private get serverQuota(): Record<string, string> {
    return {
      "width": 100 / this.serverMaxSize * this.serverTotalSize + "%"
    };
  }

  private get notMuchDocumentsLeft(): boolean {
    return this.serverDocumentCount >= Math.floor(this.serverMaxDocuments * DOCUMENT_WARNING_PERCENTAGE);
  }

  private get noDocumentsLeft(): boolean {
    return this.serverDocumentCount >= this.serverMaxDocuments;
  }

  mounted() {
    this.getServerSaves();
  }

  private getServerSaves() {
    this.apollo
      .query<DocListQuery>(docListSchema, {}, true)
      .then(data => {
        this.serverSaves = data.doc_list.documents;
        this.allowPrivate = data.doc_list.allowPrivate;
        this.serverDocumentCount = data.doc_list.documentCount;
        this.serverMaxDocuments = data.doc_list.maxDocuments;
        this.serverTotalSize = data.doc_list.totalSize;
        this.serverMaxSize = data.doc_list.maxSize;
      })
      .catch(e => {
        const firstError = e[0] || null;
        let messageKey = firstError?.extensions?.messageKey || "error.unknown";
        this.showMessage(messageKey, "failure");
      });
  }

  private deleteServerSave(id: string) {
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
              this.apollo
                .mutation<DocDeleteMutation>(docDeleteSchema, { id: id }, true)
                .then(data => {
                  if (data.doc_delete) {
                    this.showMessage("open-document.delete.success", "success", false);
                    this.getServerSaves();
                  } else {
                    this.showMessage("open-document.delete.failure", "failure", false);
                  }
                })
                .catch(e => {
                  const firstError = e[0] || null;
                  let messageKey = firstError?.extensions?.messageKey || "error.unknown";
                  this.showMessage(messageKey, "failure", false);
                });
            }
          },
        },
      },
    };
    emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
  }

  private openDocument(id: string) {
    this.apollo
      .query<DocFindQuery>(docFindSchema, { id: id }, true)
      .then(data => {
        const document: DocumentModel = {
          version: data.doc_find.version,
          name: data.doc_find.name,
          format: data.doc_find.format,
          pages: data.doc_find.pages,
          defaults: data.doc_find.defaults
        };
        DocumentStoreHelper.resetDocumentStore();
        documentStore.commit(DocumentStoreMutations.SET_DOCUMENT, document);
        this.$router.push({ name: ROUTE_NAMES.edit });
        this.$emit("done");
      })
      .catch(e => {
        const firstError = e[0] || null;
        let messageKey = firstError?.extensions?.messageKey || "error.unknown";
        this.showMessage(messageKey, "failure", false);
      });
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

<template src="@/components/app/modal/open-document/server-open/server-open.template.html" />
<style src="@/components/app/modal/open-document/server-open/server-open.style.scss" lang="scss" scoped />
