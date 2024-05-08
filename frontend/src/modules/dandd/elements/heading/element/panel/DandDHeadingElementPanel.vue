<template>
  <heading>{{ $t("panel.DandDHeadingElementPanel.header") }}</heading>
  <div class="wrapper">
    <dropdown v-model="level" :items="levels" />
    <input-field v-model="value" />
  </div>
  <pro-guard>
    <template #secure-slot="{ secureCall }">
      <css-editor
        :modelValue="customCss"
        :hints="customCssHints"
        @update:modelValue="secureCall(setCustomCss)($event)"
      />
    </template>
  </pro-guard>
</template>

<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import { getCurrentInstance } from "vue";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import DandDHeadingElementModel, {
  HeadingLevel,
} from "@/modules/dandd/elements/heading/DandDHeadingElementModel";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import { ChangeElementTextAction } from "@/history/page/element";
import { ChangeDandDHeadingLevelTextAction } from "@/modules/dandd/elements/heading/historyActions";
import { CSSElementHint } from "@/components/app/ui/css-editor/CSSEditor.vue";
import { ChangeCustomCssAction } from "@/history/custom-css";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

@Options({
  inject: [HISTORY_MANAGER],
})
export default class DandDHeadingElementPanel extends Vue {
  private uid = 0;

  private get element(): DandDHeadingElementModel {
    return layoutStore.getters(LayoutStoreGetters.EDIT_PANEL_MODEL);
  }

  private get value(): string {
    return this.element.value;
  }

  private set value(value: string) {
    const action = new ChangeElementTextAction<DandDHeadingElementModel>(
      this.element,
      (element) => element.value,
      (element, value) => (element.value = value || ""),
      this.element.value,
      value,
      "action.element.dandd.heading.text.change"
    );
    this.history.gracefulDo(action, "DandDHeadingElementModel.value-" + this.uid);
  }

  private get level(): HeadingLevel {
    return this.element.level;
  }

  private set level(value: HeadingLevel) {
    const action = new ChangeDandDHeadingLevelTextAction(this.element, this.element.level, value);
    this.history.do(action);
  }

  private get levels(): DropdownItem[] {
    return [
      {
        name: "H1",
        value: 1,
      },
      {
        name: "H2",
        value: 2,
      },
      {
        name: "H3",
        value: 3,
      },
      {
        name: "H4",
        value: 4,
      },
      {
        name: "H5",
        value: 5,
      },
    ];
  }

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get customCss(): string {
    return this.element.customCss || "";
  }

  private set customCss(value: string) {
    const action = new ChangeCustomCssAction(
      this.element,
      this.element.customCss,
      value
    );
    this.history.gracefulDo(action, "DnDHeading.customCss-" + this.uid, 1000);
  }

  private setCustomCss(value: string) {
    this.customCss = value;
  }

  private get customCssHints(): CSSElementHint[] {
    return [
      {
        selector: "h1",
        description: this.$t("panel.DandDHeadingElementPanel.custom-css.hints.h1")
      },
      {
        selector: "h2",
        description: this.$t("panel.DandDHeadingElementPanel.custom-css.hints.h2")
      },
      {
        selector: "h3",
        description: this.$t("panel.DandDHeadingElementPanel.custom-css.hints.h3")
      },
      {
        selector: "h4",
        description: this.$t("panel.DandDHeadingElementPanel.custom-css.hints.h4")
      },
      {
        selector: "h5",
        description: this.$t("panel.DandDHeadingElementPanel.custom-css.hints.h5")
      }
    ];
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;

  .dropdown {
    flex: 0 0 auto;
    margin-right: 0.5rem;
    display: flex;

    &:deep(.dropdown-button) {
      flex: 1 1 auto;
      height: auto;
    }
  }

  .input-wrapper {
    flex: 1 1 auto;
  }
}
</style>
