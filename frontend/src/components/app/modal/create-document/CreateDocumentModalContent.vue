<template>
  <div class="create-document">
    <heading :info="$t('create-document.info')">{{ $t("create-document.header") }}</heading>
    <div class="create-document-content">
      <foldout :open="!showDefaults" @visibility:changed="showDefaults = !$event">
        <template #header>
          <strong>
            {{ $t("create-document.content.basics") }}
          </strong>
        </template>
        <document-basic-settings v-model="document" />
      </foldout>
      <foldout :open="showDefaults" @visibility:changed="showDefaults = $event">
        <template #header>
          <strong>
            {{ $t("create-document.content.defaults") }}
          </strong>
        </template>
        <document-defaults-settings v-model="document" />
      </foldout>
    </div>
    <footer>
      <btn outline @click="$emit('close')">{{ $t("create-document.footer.abort") }}</btn>
      <btn @click="onCreate">{{ $t("create-document.footer.create") }}</btn>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import DocumentModel, { CURRENT_DOCUMENT_VERSION, PageModel } from "@/models/document";
import { SettingName } from "@/models/setting";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";
import { PAGE_FORMATS } from "@/models/document/pageFormat";
import { ROUTE_NAMES } from "@/router";
import DocumentBasicSettings from "@/components/app/modal/create-document/basics/DocumentBasicSettings.vue";
import DocumentDefaultsSettings from "@/components/app/modal/create-document/defaults/DocumentDefaultsSettings.vue";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  emits: ["close"],
  components: {
    DocumentBasicSettings,
    DocumentDefaultsSettings,
  },
})
export default class CreateDocumentModalContent extends Vue {
  private showDefaults = false;

  private document: DocumentModel = {
    version: CURRENT_DOCUMENT_VERSION,
    name: "New document",
    format: PAGE_FORMATS.US_LETTER,
    defaults: {
      setting: SettingName.DUNGEONS_AND_DRAGONS,
      background: SettingName.DUNGEONS_AND_DRAGONS + "-1",
      footer: {
        image: {
          url: "/images/document/backgrounds/dandd/footer-dandd.png",
        },
        text: 'Made with <a href="https://scribe.sauriel.net" target="_blank">Scribe – Tabletop Publisher</a>',
        paging: {
          show: true,
          alternate: true,
          position: "right",
        },
      },
    },
    pages: [],
  };

  private onCreate() {
    this.document.pages = [];
    const page: PageModel = {
      backgroundImages: [],
      elements: [],
    };
    this.document.pages.push(page);
    documentStore.commit(DocumentStoreMutations.SET_SAVED_DOCUMENT_KEY, undefined);
    documentStore.commit(DocumentStoreMutations.SET_DOCUMENT, this.document);
    this.$router.push({ name: ROUTE_NAMES.edit });
    this.$emit("close");
  }
}
</script>

<style lang="scss" scoped>
.create-document {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &-content {
    display: flex;
    flex-direction: column;
    max-width: 560px;
  }

  footer {
    display: flex;
    justify-content: space-between;
    margin: 0 -10px -10px;

    & > button {
      flex-grow: 0;
    }
  }
}
</style>
