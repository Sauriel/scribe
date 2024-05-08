<template>
  <div class="tools">
    <div class="tool">
      <component :is="selectedTool" />
    </div>
    <tabs v-model="selectedTool" :tabs="tools" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Settings from "@/components/tools/Settings.vue";
import { Tool } from '@/store/app.store';
import VuexHelper from '@/helper/VuexHelper';
import PagesOverview from "@/components/PagesOverview.vue";
import Tabs, { Tab } from "@/components/ui/Tabs.vue";
import Elements from "@/components/tools/page/Elements.vue";
import { PageFormat } from '@/models/AppDocumentSettings';

const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { Settings, PagesOverview, Elements, Tabs }})
export default class Tools extends Vue {

  private tools: Tab<Tool>[] = [
    {
      icon: "tools",
      name: "Settings",
      data: "Settings"
    },
    {
      icon: "bars",
      name: "Pages",
      data: "PagesOverview"
    },
    {
      icon: "grip-vertical",
      name: "Elements",
      data: "Elements"
    }
  ];

  private get selectedTool(): Tool {
    return appStore.getters<Tool>("selectedTool");
  }

  private set selectedTool(value: Tool) {
    appStore.commit("setSelectedTool", value);
  }

  private get maxToolWidth(): Record<string, string> {
    const page: PageFormat = appStore.getters<PageFormat>("documentPageFormat");
    const pageWidth = page.width + page.unit;
    const showPageOverview: boolean = appStore.getters("showOverview");
    const pageOverviewWidth = showPageOverview ? "400px" : "200px";
    return {
      width: "calc(100vw - " + pageWidth + " - " + pageOverviewWidth + ")"
    };
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/colors.scss";

  .tools {
    width: 400px;
    height: 100vh;
    flex: 0 0 auto;
    background-color: $background;
    border-right: 3px solid $backgroundLight;
    display: flex;
    flex-direction: column;

    @media print {
      display: none;
    }

    > .tool {
      flex: 1 0 auto;
      max-height: calc(100vh - 30px);
      max-width: 100%;

      &::v-deep > .pages-overview {
        background-color: transparent;
        width: auto;

        > .pages-overview-list {
          height: calc(100vh - 80px);
        }
      }
    }
  }
</style>
