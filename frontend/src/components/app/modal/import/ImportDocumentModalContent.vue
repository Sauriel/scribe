<template>
  <div class="document-import">
    <heading>{{ $t("document-import.header") }}</heading>
    <div class="norn-import">
      <heading small>{{ $t("document-import.norn.header") }}</heading>
      <p v-html="$t('document-import.norn.info')" />
      <btn outline full-width class="upload-btn">
        <label class="hide-input">
          <strong>
            {{ $t("document-import.norn.upload") }}
          </strong>
          <input type="file" accept=".json" @change="uploadNorn" />
        </label>
      </btn>
    </div>
    <footer>
      <btn outline @click="$emit('close')">{{ $t("document-import.footer.close") }}</btn>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import ImportHelper from "@/helper/ImportHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import DocumentStoreHelper from "@/helper/DocumentStoreHelper";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";
import { ROUTE_NAMES } from "@/router";
import emitter from "@/emitter";
import {
  NotificationType,
  NotificationUpdateEvent,
  NOTIFICATION_UPDATE_EVENT_NAME,
} from "@/events/notification";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  emits: ["close"],
})
export default class ImportDocumentModalContent extends Vue {
  private uploadNorn(event: Event) {
    // @ts-ignore
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      // @ts-ignore
      const fileContent = e.target.result as string;
      const document = ImportHelper.importNornDocument(fileContent);
      let notificationType: NotificationType = "failure";
      if (document) {
        DocumentStoreHelper.resetDocumentStore();
        documentStore.commit(DocumentStoreMutations.SET_DOCUMENT, document);
        documentStore.commit(DocumentStoreMutations.SET_SAVED_DOCUMENT_KEY, undefined);
        this.$router.push({ name: ROUTE_NAMES.edit });
        notificationType = "success";
      }
      const event: NotificationUpdateEvent = {
        name: NOTIFICATION_UPDATE_EVENT_NAME,
        payload: {
          type: notificationType,
          content: this.$t("document-import.notification." + notificationType),
          visible: true,
        },
      };
      emitter.$emit(NOTIFICATION_UPDATE_EVENT_NAME, event);
      this.$emit("close");
    };
    reader.readAsText(file);
  }
}
</script>

<style lang="scss" scoped>
.document-import {
  max-width: calc((100vw / 3) - 4rem);
}

.upload-btn {
  padding: 0;
  margin: 0;

  &:deep(.btn-strong) {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hide-input {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 20px;
    z-index: 99;
    cursor: pointer;

    > input {
      display: none;
    }
  }
}

footer {
  display: flex;
  justify-content: space-between;
  margin: 0 -10px -10px;

  & > button {
    flex-grow: 0;
  }
}
</style>
