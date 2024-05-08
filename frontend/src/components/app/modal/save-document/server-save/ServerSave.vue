<script lang="ts">
import { Vue, Options, Prop, Ref } from "vue-property-decorator";
import DocumentModel from "@/models/document";
import { CONFIRM_TAG, DialogUpdateEvent, DIALOG_UPDATE_EVENT_NAME } from "@/events/dialog";
import { ConfirmDialogPayload } from "@/components/app/dialog/confirm/ConfirmDialogContent.vue";
import emitter from "@/emitter";
import { NotificationType, NotificationUpdateEvent, NOTIFICATION_UPDATE_EVENT_NAME } from "@/events/notification";
import ApolloService, { APOLLO_SERVICE } from "@/services/ApolloService";
import docSaveSchema from "@/graphql/document/doc_save.gql";
import docListSchema from "@/graphql/document/doc_list.gql";
import docDeleteSchema from "@/graphql/document/doc_delete.gql";
import { DocSaveMutation, DocListQuery, Document as GQLDocument, DocumentInput, DocDeleteMutation } from "@/graphql/document/models";
import html2canvas from "html2canvas";
import { SelectBarEntry } from "@/components/app/ui/select-bar/SelectBar.vue";
import StringHelper from "@/helper/StringHelper";

const KB_MB_DIVIDE = 512 * 1024; // 0.5 MB
const DOCUMENT_WARNING_PERCENTAGE = 0.9;

@Options({
  emits: ["done"],
  inject: [ APOLLO_SERVICE ]
})
export default class ServerSave extends Vue {

  private get apollo(): ApolloService {
    // @ts-ignore
    return this.apolloService;
  }

  @Prop({ type: Object, required: true })
  readonly document!: DocumentModel;

  private isPrivateDocument = false;

  private listView = true;

  private views: SelectBarEntry<boolean>[] =[
    { icon: "list", data: true },
    { icon: "grip-horizontal", data: false }
  ];

  @Ref()
  private readonly imageCanvas!: HTMLCanvasElement;

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

  private saveToServer() {
    this.saveOrUpdateOnServer();
  }

  private serverSaveReplace(id: string) {
    this.saveOrUpdateOnServer(id);
  }

  private deleteServerSave(id: string) {
    this.openConfirmDialog(
      "save-document.delete.text",
      "save-document.delete.abort",
      "save-document.delete.confirm",
      (confirm: boolean) => {
        if (confirm) {
          this.apollo
            .mutation<DocDeleteMutation>(docDeleteSchema, { id: id }, true)
            .then(data => {
              if (data.doc_delete) {
                this.showMessage("save-document.delete.success", "success", false);
                this.getServerSaves();
              } else {
                this.showMessage("save-document.delete.failure", "failure", false);
              }
            })
            .catch(e => {
              const firstError = e[0] || null;
              let messageKey = firstError?.extensions?.messageKey || "error.unknown";
              this.showMessage(messageKey, "failure", false);
            });
        }
      }
    );
  }

  private openConfirmDialog(message: string, abortButton: string, confirmButton: string, callback: (confirm: boolean) => void) {
    const event: DialogUpdateEvent<ConfirmDialogPayload> = {
      name: DIALOG_UPDATE_EVENT_NAME,
      payload: {
        component: CONFIRM_TAG,
        visible: true,
        payload: {
          message: message,
          abortButton: abortButton,
          confirmButton: confirmButton,
          callback: callback,
        },
      },
    };
    emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
  }

  private saveOrUpdateOnServer(id?: string) {
    this.createThumbnail()
      .then(image => {
        const documentInput: DocumentInput = {
          ...this.document,
          id: id,
          private: this.isPrivateDocument,
          thumb: image
        };
        this.apollo
          .mutation<DocSaveMutation>(docSaveSchema, { input: documentInput }, true)
          .then(data => {
            this.showMessage("save-document.success", "success", false);
            if (!data.doc_save.private) {
              this.openConfirmDialog(
                "save-document.server.share.text",
                "save-document.server.share.no",
                "save-document.server.share.yes",
                (share: boolean) => {
                  if (share) {
                    const baseUrl = document.location.origin;
                    const userName = StringHelper.normalizeForURI(data.doc_save.user.username);
                    const docName = StringHelper.normalizeForURI(data.doc_save.name);
                    const docId = data.doc_save.id;
                    const shareURL = `${baseUrl}/view/${userName}/${docName}?id=${docId}`;
                    const redditSubmitURL = `https://www.reddit.com/r/DnDHomebrew/submit?selflink=true&title=${data.doc_save.name}&url=${encodeURIComponent(shareURL)}`;
                    window.open(redditSubmitURL);
                    this.$emit("done");
                  } else {
                    this.$emit("done");
                  }
                }
              );
            } else {
              this.$emit("done");
            }
          })
          .catch(e => {
            const firstError = e[0] || null;
            let messageKey = firstError?.extensions?.messageKey || "error.unknown";
            this.showMessage(messageKey, "failure");
          });
      })
  }

  private async createThumbnail(): Promise<string | undefined> {
    const elementId = "page-0";
    const element = document.getElementById(elementId);
    if (element) {
      const pageFormat = this.document.format;
      const width = pageFormat.width * pageFormat.unit.pixelPerUnit;
      const height = pageFormat.height * pageFormat.unit.pixelPerUnit;
      return html2canvas(element, {
        scale: 1,
        width: width,
        height: height,
        allowTaint: true,
        useCORS: true,
        ignoreElements: (element: Element): boolean =>
          element.classList.contains("no-image-export"),
      }).then((canvas: HTMLCanvasElement) => {
        const context = this.imageCanvas.getContext("2d");
        const canvasScale = 1 / (width / 200);
        const thumbWidth = Math.floor(canvas.width * canvasScale);
        const thumbHeight = Math.floor(canvas.height * canvasScale);
        this.imageCanvas.width = thumbWidth;
        this.imageCanvas.height = thumbHeight;
        context?.scale(canvasScale, canvasScale);
        context?.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        return this.imageCanvas.toDataURL("image/jpeg");
      });
    } else {
      return Promise.resolve(undefined);
    }
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

<template src="@/components/app/modal/save-document/server-save/server-save.template.html" />
<style src="@/components/app/modal/save-document/server-save/server-save.style.scss" lang="scss" scoped />