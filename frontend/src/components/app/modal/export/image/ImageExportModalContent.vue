<template>
  <div class="export-image">
    <heading :info="$t('export-image.info')">{{ $t("export-image.header") }}</heading>
    <div class="export-image-content">
      <div class="generated">
        <canvas ref="imageCanvas" class="generated-image" />
      </div>
      <div class="settings">
        <section v-if="pages.length > 1">
          <header>{{ $t("export-image.settings.page") }}</header>
          <dropdown v-model="pageIndex" :items="pages" />
        </section>
        <section>
          <header>{{ $t("export-image.settings.scale") }}</header>
          <dropdown v-model="quality" :items="qualities" />
        </section>
      </div>
    </div>
    <footer>
      <btn outline @click="$emit('close')">{{ $t("export-image.footer.close") }}</btn>
      <div class="action-buttons">
        <btn @click="getImage">
          {{ $t("export-image.settings.generate") }}
        </btn>
        <btn @click="downloadImage" :disabled="!imageIsGenerated">
          {{ $t("export-image.settings.download") }}
        </btn>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Ref } from "vue-property-decorator";
import html2canvas from "html2canvas";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import DocumentModel from "@/models/document";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import { DocumentStoreActions } from "@/store/document/documentStoreActions";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  emits: ["close"],
})
export default class ImageExportModalContent extends Vue {
  @Ref()
  private readonly imageCanvas!: HTMLCanvasElement;

  private imageIsGenerated = false;

  private get document(): DocumentModel {
    return documentStore.getters(DocumentStoreGetters.DOCUMENT);
  }

  private get pageIndex(): number {
    const fromStore = documentStore.getters(DocumentStoreGetters.SELECTED_PAGE);
    return fromStore ? fromStore : 0;
  }

  private set pageIndex(value: number) {
    documentStore.dispatch(DocumentStoreActions.SELECT_PAGE, value);
  }

  private get pages(): DropdownItem[] {
    const pages: DropdownItem[] = [];
    for (let i = 0; i < this.document.pages.length; i++) {
      const page: DropdownItem = {
        name: this.$t("document.page.select.page") + (i + 1),
        value: i,
      };
      pages.push(page);
    }
    return pages;
  }

  private quality = 1;

  private get qualities(): DropdownItem[] {
    const pageFormat = this.document.format;
    const width = pageFormat.width * pageFormat.unit.pixelPerUnit;
    const height = pageFormat.height * pageFormat.unit.pixelPerUnit;
    const scales = [1, 1.5, 2];
    return scales.map((scale) => ({
      name: width * scale + "px × " + height * scale + "px",
      value: scale,
    }));
  }

  private getImage() {
    const elementId = "page-" + this.pageIndex;
    const element = document.getElementById(elementId);
    if (element) {
      const pageFormat = this.document.format;
      const width = pageFormat.width * pageFormat.unit.pixelPerUnit;
      const height = pageFormat.height * pageFormat.unit.pixelPerUnit;
      html2canvas(element, {
        scale: this.quality,
        width: width,
        height: height,
        allowTaint: true,
        useCORS: true,
        ignoreElements: (element: Element): boolean =>
          element.classList.contains("no-image-export"),
      }).then((canvas: HTMLCanvasElement) => {
        const context = this.imageCanvas.getContext("2d");
        this.imageCanvas.width = canvas.width;
        this.imageCanvas.height = canvas.height;
        context?.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        this.imageIsGenerated = true;
      });
    }
  }

  private downloadImage() {
    const link = document.createElement("a");
    link.download = this.document.name.replaceAll(/\s/g, "_") + "-" + (this.pageIndex + 1) + ".png";
    link.href = this.imageCanvas.toDataURL("image/png");
    link.click();
  }
}
</script>

<style lang="scss" scoped>
.export-image {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &-content {
    display: flex;
    gap: 1rem;

    .generated {
      width: 400px;

      &-image {
        width: 100%;
      }
    }

    .settings {
      display: flex;
      flex-direction: column;
      gap: 0.5em;

      section {
        display: flex;

        header {
          flex: 0 0 auto;
          width: 12ch;
        }
      }
    }
  }

  footer {
    display: flex;
    justify-content: space-between;
    margin: 0 -10px -10px;

    .action-buttons {
      display: flex;
      flex-wrap: nowrap;
      gap: 1rem;
    }

    & > button {
      flex-grow: 0;
    }
  }
}
</style>
