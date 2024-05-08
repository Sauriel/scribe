<template>
  <div class="document-defaults">
    <section>
      <header>{{ $t("document.name") }}</header>
      <input-field v-model="name" />
    </section>
    <section>
      <header>{{ $t("document.design") }}</header>
      <setting-selector v-model="setting" />
    </section>
    <section>
      <header>{{ $t("document.pageSize") }}</header>
      <page-size-selector v-model="format" />
    </section>
    <section>
      <header>{{ $t("document.background") }}</header>
      <page-background-selector v-model="background" :format="document.format" />
    </section>
    <section>
      <header>
        <span class="no-wrap">
          {{ $t("document.footer.label") }}
          <input-switch class="switch" v-model="showFooter" />
        </span>
      </header>
      <tip-tap v-model="footerText" :config="config" v-if="showFooter" />
    </section>
    <section v-if="showFooter">
      <header>
        <span class="no-wrap">
          {{ $t("document.footer.paging.label") }}
          <input-switch class="switch" v-model="showPaging" />
        </span>
      </header>
      <div class="paging-settings" v-if="showPaging">
        <select-bar
          round
          shadow-border
          alternate-colors
          v-model="pagingPosition"
          :items="pagingPositions"
        />
        <input-switch class="switch" v-model="alternatePagingPosition">
          {{ $t("document.footer.paging.position.alternate") }}
        </input-switch>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import { getCurrentInstance } from "vue";
import DocumentModel, { PageFooter, PagingPosition } from "@/models/document";
import { SettingName } from "@/models/setting";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import SettingSelector from "@/components/app/document/setting/SettingSelector.vue";
import PageSizeSelector from "@/components/app/document/page-size/PageSizeSelector.vue";
import PageBackgroundSelector from "@/components/app/document/background/PageBackgroundSelector.vue";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { PageFormat } from "@/models/document/pageFormat";
import {
  ChangeDocumentNameAction,
  ChangeDocumentSettingAction,
  ChangeDocumentPageSizeAction,
  ChangeDocumentBackgroundAction,
  ChangeDocumentFooterAction,
} from "@/history/document";
import { TipTapMenuConfig } from "@/components/app/ui/tiptap/menu/TipTapMenu.vue";
import { cloneDeep, isEmpty } from "lodash";
import { SelectBarEntry } from "@/components/app/ui/select-bar/SelectBar.vue";

export const COMPONENT_NAME = "DocumentDefaultsEditPanel";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  components: {
    SettingSelector,
    PageSizeSelector,
    PageBackgroundSelector,
  },
  inject: [HISTORY_MANAGER],
})
export default class DocumentDefaultsEditPanel extends Vue {
  private readonly config: TipTapMenuConfig = [
    "Bold",
    "Italic",
    "Underline",
    "Strike",
    "Color",
    "Link",
    "Align",
  ];

  private uid = 0;

  private showFooterInternal = false;

  mounted() {
    this.showFooterInternal = this.document.defaults.footer !== undefined;
  }

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get document(): DocumentModel {
    return documentStore.getters(DocumentStoreGetters.DOCUMENT);
  }

  private get name(): string {
    return this.document.name;
  }

  private set name(value: string) {
    const currentValue = this.document.name;
    const action = new ChangeDocumentNameAction(currentValue, value);
    this.history.gracefulDo(action, "DocumentModel.name-" + this.uid);
  }

  private get setting(): SettingName {
    return this.document.defaults.setting;
  }

  private set setting(value: SettingName) {
    const currentValue = this.document.defaults.setting;
    const action = new ChangeDocumentSettingAction(currentValue, value);
    this.history.do(action);
  }

  private get format(): PageFormat {
    return this.document.format;
  }

  private set format(value: PageFormat) {
    const currentValue = this.document.format;
    const action = new ChangeDocumentPageSizeAction(currentValue, value);
    this.history.do(action);
  }

  private get background(): string {
    return this.document.defaults.background;
  }

  private set background(value: string) {
    const currentValue = this.document.defaults.background;
    const action = new ChangeDocumentBackgroundAction(currentValue, value);
    this.history.do(action);
  }

  private get defaultFooter(): PageFooter {
    return {
      image: {
        url: "/images/document/backgrounds/dandd/footer-dandd.png",
      },
      text: 'Made with <a href="https://scribe.sauriel.net" target="_blank">Scribe – Tabletop Publisher</a>',
      paging: {
        show: true,
        alternate: true,
        position: "right",
      },
    };
  }

  private get footer(): PageFooter | undefined {
    return this.document.defaults.footer;
  }

  private get showFooter(): boolean {
    return this.showFooterInternal;
  }

  private set showFooter(value: boolean) {
    if (value) {
      if (this.document.defaults.footer === undefined) {
        this.changeFooter(cloneDeep(this.defaultFooter));
      }
    } else {
      this.changeFooter(undefined);
    }
    this.showFooterInternal = value;
  }

  private get footerText(): string {
    return this.footer && this.footer.text ? this.footer.text : "";
  }

  private set footerText(value: string) {
    if (this.footer) {
      const currentValue = this.document.defaults.footer;
      const updatedFooter = cloneDeep(this.footer);
      updatedFooter.text = isEmpty(value) ? undefined : value;
      const action = new ChangeDocumentFooterAction(currentValue, updatedFooter);
      this.history.gracefulDo(action, "DocumentModel.footer-text-" + this.uid);
    }
  }

  private get showPaging(): boolean {
    return this.footer ? this.footer.paging.show : false;
  }

  private set showPaging(value: boolean) {
    if (this.footer) {
      const updatedFooter = cloneDeep(this.footer);
      updatedFooter.paging.show = value;
      this.changeFooter(updatedFooter);
    }
  }

  private get pagingPosition(): PagingPosition {
    return this.footer ? this.footer.paging.position : "right";
  }

  private set pagingPosition(value: PagingPosition) {
    if (this.footer) {
      const updatedFooter = cloneDeep(this.footer);
      updatedFooter.paging.position = value;
      this.changeFooter(updatedFooter);
    }
  }

  private get pagingPositions(): SelectBarEntry<PagingPosition>[] {
    return [
      {
        name: this.$t("document.footer.paging.position.left"),
        data: "left",
      },
      {
        name: this.$t("document.footer.paging.position.right"),
        data: "right",
      },
    ];
  }

  private get alternatePagingPosition(): boolean {
    return this.footer ? this.footer.paging.alternate : false;
  }

  private set alternatePagingPosition(value: boolean) {
    if (this.footer) {
      const updatedFooter = cloneDeep(this.footer);
      updatedFooter.paging.alternate = value;
      this.changeFooter(updatedFooter);
    }
  }

  private changeFooter(footer: PageFooter | undefined) {
    const currentValue = this.document.defaults.footer;
    const action = new ChangeDocumentFooterAction(currentValue, footer);
    this.history.do(action);
  }
}
</script>

<style lang="scss" scoped>
.document-defaults {
  section {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;

    header {
      margin-bottom: 0.25rem;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .switch:deep(input[type="checkbox"]) {
      margin-right: 0.5em;
    }

    .paging-settings {
      display: flex;
      flex-direction: column;
      gap: 1em;
    }
  }

  .no-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > .switch {
      font-size: 0.8em;
      margin-right: 0.5em;
    }
  }
}
</style>
