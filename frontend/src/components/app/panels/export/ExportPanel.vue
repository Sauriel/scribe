<template>
  <div class="export-panel">
    <heading>
      {{ $t("panel.export.header") }}
    </heading>
    <div class="print-pdf">
      <div
        class="explanation"
        v-html="
          $t('panel.export.print-pdf.explanation', {
            paperSize: paperSize,
            pageOrientation: pageOrientation,
          })
        "
      />
      <btn full-width @click="printPdf">
        {{ $t("panel.export.print-pdf.button") }}
      </btn>
    </div>
    <div class="export-image">
      <div class="explanation" v-html="$t('panel.export.export-image.explanation')" />
      <btn full-width @click="exportImage">
        {{ $t("panel.export.export-image.button") }}
      </btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import DocumentModel from "@/models/document";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import { PageFormat } from "@/models/document/pageFormat";
import {
  IMAGE_EXPORT_COMPONENT_TAG,
  ModalUpdateEvent,
  MODAL_UPDATE_EVENT_NAME,
} from "@/events/modal";
import emitter from "@/emitter";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

export default class ExportPanel extends Vue {
  private get document(): DocumentModel {
    return this.$route.meta.document as DocumentModel || documentStore.getters<DocumentModel>(DocumentStoreGetters.DOCUMENT) as DocumentModel;
  }

  private get pageFormat(): PageFormat {
    return this.document.format;
  }

  private get paperSize(): string {
    return this.$t(this.pageFormat.label);
  }

  private get pageOrientation(): string {
    if (this.pageFormat.height > this.pageFormat.width) {
      return this.$t("document.page.orientation.portrait");
    } else if (this.pageFormat.height < this.pageFormat.width) {
      return this.$t("document.page.orientation.landscape");
    } else {
      return this.$t("document.page.orientation.square");
    }
  }

  private printPdf() {
    window.print();
  }

  private exportImage() {
    const event: ModalUpdateEvent<undefined> = {
      name: MODAL_UPDATE_EVENT_NAME,
      payload: {
        component: IMAGE_EXPORT_COMPONENT_TAG,
        visible: true,
      },
    };
    emitter.$emit(MODAL_UPDATE_EVENT_NAME, event);
  }
}
</script>

<style lang="scss" scoped>
.export-panel {
  padding: 1rem;
  width: 100%;
}
</style>
