<template>
  <div class="sidebar sidebar--right">
    <component class="sidebar-component" :is="rightPanelComponent" />
    <div class="sidebar-selector" v-if="showPanelSelection">
      <div
        v-for="(panel, index) of panels"
        :key="'pan-' + index"
        class="sidebar-selector-entry"
        :class="{
          'sidebar-selector-entry--selected': panel.component === rightPanelComponent,
        }"
        @click="setPanel(panel)"
      >
        <font-awesome-icon :icon="panel.icon" />
        {{ panel.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import EditPanel from "@/components/app/panels/edit/EditPanel.vue";
import PageOverviewPanel from "@/components/app/panels/pages/PageOverviewPanel.vue";
import ExportPanel from "@/components/app/panels/export/ExportPanel.vue";
import VuexHelper from "@/helper/VuexHelper";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import { LayoutStoreMutations } from "@/store/layout/layoutStoreMutations";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);

interface PanelEntry {
  icon: string;
  label: string;
  component: string;
}

@Options({
  components: {
    EditPanel,
    PageOverviewPanel,
    ExportPanel,
  },
})
export default class RightSidebar extends Vue {
  private get panels(): PanelEntry[] {
    const panels = [
      {
        icon: "book",
        label: this.$t("panel.PageOverviewPanel.label"),
        component: "PageOverviewPanel",
      },
    ];
    if (this.showExport) {
      panels.push({
        icon: "file-pdf",
        label: this.$t("panel.export.label"),
        component: "ExportPanel",
      });
    } else if (this.selectedSubComponent) {
      panels.push({
        icon: "edit",
        label: this.$t("panel." + this.selectedSubComponent + ".label"),
        component: "EditPanel",
      });
    }
    return panels;
  }

  private get rightPanelComponent(): string {
    const component = layoutStore.getters(LayoutStoreGetters.RIGHT_PANEL_COMPONENT);
    return component ? component : "PageOverviewPanel";
  }

  private set rightPanelComponent(value: string) {
    layoutStore.commit(LayoutStoreMutations.SET_RIGHT_PANEL_COMPONENT, value);
  }

  private get selectedSubComponent(): string | undefined {
    return layoutStore.getters(LayoutStoreGetters.EDIT_PANEL_COMPONENT);
  }

  private get showExport(): boolean {
    return layoutStore.getters(LayoutStoreGetters.EXPORT_DOCUMENT);
  }

  private get showPanelSelection(): boolean {
    return !!this.selectedSubComponent || this.showExport;
  }

  private setPanel(panel: PanelEntry) {
    this.rightPanelComponent = panel.component;
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 20vw;
  background-color: var(--color-background);
  border-left: 1px solid var(--color-background--dark);

  &-component {
    height: calc(100vh - 50px - 30px);
    overflow-x: auto;
  }

  &-selector {
    height: 30px;
    display: flex;
    justify-content: space-evenly;

    &-entry {
      flex: 1 1 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--color-background--dark);
      cursor: pointer;

      > svg {
        margin-right: 0.25rem;
      }

      &--selected {
        background-color: initial;
      }

      &:hover {
        background-color: initial;
      }
    }
  }

  &:deep(.header--with-info) {
    z-index: 10;

    .tooltip {
      width: 28ch;
      min-width: auto;
    }
  }
}
</style>
