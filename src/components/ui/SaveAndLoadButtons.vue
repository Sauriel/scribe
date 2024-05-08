<template>
  <div class="save-and-load single-icon">
    <tooltip position="left">
      <button class="create" @click="create">
        <font-awesome-icon icon="file" />
      </button>
      <template v-slot:tooltip>
        Create a new document.
      </template>
    </tooltip>
    <tooltip position="left">
      <button class="download single-icon" @click="downloadDoc">
        <font-awesome-icon icon="save" />
      </button>
      <template v-slot:tooltip>
        Download the current document to your PC.
      </template>
    </tooltip>
    <tooltip position="left">
      <button class="upload single-icon">
        <label class="hide-input">
          <font-awesome-icon icon="folder-open" />
          <input type="file" accept=".json,application/json" @change="handleUpload" />
        </label>
      </button>
      <template v-slot:tooltip>
        Upload a document from your PC, the current document will we overwritten.
      </template>
    </tooltip>
    <tooltip position="left">
      <button class="save" @click="save">
        <font-awesome-layers class="fa-lg">
          <font-awesome-icon icon="cloud" />
          <font-awesome-icon icon="save" />
        </font-awesome-layers>
      </button>
      <template v-slot:tooltip>
        Save the current document in your browser. You can only save 1 document in this way but you can download &amp; upload as many as you like.
      </template>
    </tooltip>
    <tooltip position="left">
      <button class="open" @click="open">
        <font-awesome-layers class="fa-lg">
          <font-awesome-icon icon="cloud" />
          <font-awesome-icon icon="folder-open" />
        </font-awesome-layers>
      </button>
      <template v-slot:tooltip>
        Open the saved document, the current document will we overwritten.
      </template>
    </tooltip>
    <tooltip position="left">
      <button class="reset" @click="reset">
        <font-awesome-layers class="fa-lg">
          <font-awesome-icon icon="cloud" />
          <font-awesome-icon icon="trash-alt" />
        </font-awesome-layers>
      </button>
      <template v-slot:tooltip>
        Delete your saved document.
      </template>
    </tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VuexHelper from '@/helper/VuexHelper';
import AppDocument from '@/models/AppDocument';
import Tooltip from "@/components/ui/Tooltip.vue";
import { RULES } from '../settings/RuleConfig';
import { PAGE_FORMATS } from '@/models/AppDocumentSettings';
import PageHelper from '@/helper/PageHelper';
import download from "downloadjs";

export const LS_SAVE_SLOT = "norn.doc.save-slot";
const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { Tooltip }})
export default class SaveAndLoadButtons extends Vue {

  private save(event: MouseEvent) {
    const document: AppDocument =  appStore.getters<AppDocument>("document");
    localStorage.setItem(LS_SAVE_SLOT, JSON.stringify(document));
  }

  private open(event: MouseEvent) {
    const document = localStorage.getItem(LS_SAVE_SLOT);
    if (document) {
      const appDocument = this.parseJson<AppDocument>(document);
      appStore.commit("setDocument", appDocument);
    }
  }

  private reset(event: MouseEvent) {
    localStorage.removeItem(LS_SAVE_SLOT);
  }

  private create(event: MouseEvent) {
    const appDocument: AppDocument = {
      settings: {
          setting: RULES.DND_5E,
          pageSize: PAGE_FORMATS.US_LETTER
        },
        pages: [],
        nextElementIndex: 0
    };
    appDocument.pages.push(PageHelper.createEmpty(appDocument.nextElementIndex++));
    appStore.commit("setDocument", appDocument);
  }

  private downloadDoc() {
    const document: AppDocument =  appStore.getters<AppDocument>("document");
    download(JSON.stringify(document), "NornDocument.json", "text/plain")
  }

  private handleUpload(event: Event) {
    // @ts-ignore
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      // @ts-ignore
      const document = e.target.result as string;
      if (document) {
        const appDocument = this.parseJson<AppDocument>(document);
        appStore.commit("setDocument", appDocument);
      }
    };
    reader.readAsText(file);
  }

  private parseJson<T>(json: string): T {
    const fixedJson = json
      .replace(/\x19/g, "'")
      .replace(/[\x00-\x1F\x7F]/g, "#")
      .replace(/[\x11-\x14]/g, "#")
      .replace(/\\\">\"/g, "\\\">");
    const object: T = JSON.parse(fixedJson);
    return object;
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

.save-and-load {
  position: absolute;
  bottom: 10px;
  right: 50px;
  display: flex;
  flex-direction: column;

  @media print {
    display: none;
  }

  button {
    border: none;
    background-color: $primary;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid $primaryDark;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $foreground;
    font-size: 1.2rem;
    margin: 5px;
    cursor: pointer;
    box-shadow: 2px 2px 4px 0 $backgroundDark;
    padding: 0;

    &:hover {
      background-color: $primaryLight;
      border-color: $primary;
    }

    &:not(.single-icon):hover svg:not(.fa-cloud):not(.fa-file) {
        color: $primaryLight;
    }

    &:focus {
      outline: none;
    }

    svg.fa-cloud {
      position: relative;
      left: -4px;
      top: -2px;
    }

    &:not(.single-icon) svg:not(.fa-cloud):not(.fa-file) {
      color: $primary;
      font-size: 0.6em;
    }

    .hide-input {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      input {
        display: none;
      }
    }
  }

  &::v-deep .tooltip {
    min-width: 240px;
  }
}
</style>
