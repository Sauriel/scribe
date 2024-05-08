<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import DocumentModel from "@/models/document";
import emitter from "@/emitter";
import { NotificationType, NotificationUpdateEvent, NOTIFICATION_UPDATE_EVENT_NAME } from "@/events/notification";
import VuexHelper from "@/helper/VuexHelper";
import EncryptionHelper from "@/helper/EncryptionHelper";
import DownloadJS from "downloadjs";
import { USER_STORE_NAMESPACE } from "@/store/user/userStoreModule";
import { UserStoreGetters } from "@/store/user/userStoreGetters";
import ServerSave from "./server-save/ServerSave.vue";
import BrowserSave from "./browser-save/BrowserSave.vue";
import { SelectBarEntry } from "../../ui/select-bar/SelectBar.vue";

export interface SaveDocumentPayload {
  document: DocumentModel;
}

declare type SaveDestinationComponent = "server-save" | "browser-save";

const userStore = VuexHelper.createNamespace(USER_STORE_NAMESPACE);

@Options({
  emits: ["close"],
  components: {
    BrowserSave,
    ServerSave
  }
})
export default class SaveDocumentModalContent extends Vue {

  private destination: SaveDestinationComponent = "browser-save";

  private get destinations(): SelectBarEntry<SaveDestinationComponent>[] {
    const destinations: SelectBarEntry<SaveDestinationComponent>[] = [];
    if (this.isLoggedIn) {
      destinations.push({ name: this.$t("save-document.server.header"), data: "server-save" });
    }
    destinations.push({ name: this.$t("save-document.browser.header"), data: "browser-save" });
    return destinations;
  }

  @Prop({ type: Object, required: true })
  private readonly payload!: SaveDocumentPayload;

  private get isLoggedIn(): boolean {
    return !!userStore.getters<boolean>(UserStoreGetters.IS_LOGGED_IN);
  }

  mounted() {
    if (this.isLoggedIn) {
      this.destination = "server-save";
    }
  }

  private get document(): DocumentModel {
    return this.payload.document;
  }

  private download() {
    const encrypted = EncryptionHelper.encrypt<DocumentModel>(this.document);
    const fileName = this.document.name;
    DownloadJS(encrypted, fileName + ".scribe", "text/plain");
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
      this.$emit("close");
    }
  }
}
</script>

<template src="@/components/app/modal/save-document/save-document-modal-content.template.html" />
<style src="@/components/app/modal/save-document/save-document-modal-content.style.scss" lang="scss" scoped />