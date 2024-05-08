<template>
  <div class="defaults-settings">
    <section>
      <header>{{ $t("document.background") }}</header>
      <page-background-selector v-model="document.defaults.background" :format="document.format" />
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
import { Vue, Prop, Options, Watch } from "vue-property-decorator";
import DocumentModel, { PageFooter, PagingPosition } from "@/models/document";
import PageBackgroundSelector from "@/components/app/document/background/PageBackgroundSelector.vue";
import { cloneDeep, isEmpty } from "lodash";
import { TipTapMenuConfig } from "@/components/app/ui/tiptap/menu/TipTapMenu.vue";
import { SelectBarEntry } from "@/components/app/ui/select-bar/SelectBar.vue";

@Options({
  components: {
    PageBackgroundSelector,
  },
})
export default class DocumentDefaultsSettings extends Vue {
  private readonly config: TipTapMenuConfig = [
    "Bold",
    "Italic",
    "Underline",
    "Strike",
    "Color",
    "Link",
    "Align",
  ];

  @Prop({ type: Object, required: true })
  private readonly modelValue!: DocumentModel;

  private get document(): DocumentModel {
    return this.modelValue;
  }

  private set document(value: DocumentModel) {
    this.$emit("update:modelValue", value);
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

  private showFooterInternal = false;

  mounted() {
    this.showFooterInternal = this.document.defaults.footer !== undefined;
  }

  private get showFooter(): boolean {
    return this.showFooterInternal;
  }

  private set showFooter(value: boolean) {
    if (value) {
      if (this.document.defaults.footer === undefined) {
        this.document.defaults.footer = cloneDeep(this.defaultFooter);
      }
    } else {
      this.document.defaults.footer = undefined;
    }
    this.showFooterInternal = value;
  }

  private get footerText(): string {
    return this.footer && this.footer.text ? this.footer.text : "";
  }

  private set footerText(value: string) {
    if (this.footer) {
      this.footer.text = isEmpty(value) ? undefined : value;
    }
  }

  private get showPaging(): boolean {
    return this.footer ? this.footer.paging.show : false;
  }

  private set showPaging(value: boolean) {
    if (this.footer) {
      this.footer.paging.show = value;
    }
  }

  private get pagingPosition(): PagingPosition {
    return this.footer ? this.footer.paging.position : "right";
  }

  private set pagingPosition(value: PagingPosition) {
    if (this.footer) {
      this.footer.paging.position = value;
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
      this.footer.paging.alternate = value;
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  display: flex;
  margin-bottom: 2rem;

  & > *:not(header) {
    flex: 1 1 auto;
  }

  header {
    flex: 0 0 auto;
    width: 120px;
    padding-top: 0.25rem;
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
</style>
