<template>
  <div class="subtools">
    <tabs v-model="selectedSubTool" :tabs="subToolList" />
    <div class="subtool">
      <component :is="selectedSubTool" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Tabs, { Tab } from "@/components/ui/Tabs.vue";
import GlobalSettings from "@/components/tools/settings/GlobalSettings.vue";
import PageSettings from "@/components/tools/settings/PageSettings.vue";
import ElementSettings from "@/components/tools/settings/ElementSettings.vue";
import { SettingsSubTool } from '@/store/app.store';
import VuexHelper from '@/helper/VuexHelper';
import LayoutElement from '@/models/layout-elements/LayoutElement';

const appStore = VuexHelper.createNamespace("appStore");
const layoutStore = VuexHelper.createNamespace("layoutStore");

@Component({ components: { GlobalSettings, PageSettings, ElementSettings, Tabs }})
export default class Settings extends Vue {

  private subTools: Tab<SettingsSubTool>[] = [
    {
      name: "Global",
      data: "GlobalSettings",
      icon: "pencil-ruler"
    },
    {
      name: "Page",
      data: "PageSettings",
      icon: "file-image"
    }
  ];

  private get editingElement(): LayoutElement | undefined {
    return layoutStore.getters("editingElement");
  }

  private get subToolList(): Tab<SettingsSubTool>[] {
    if (this.editingElement) {
      const elementSettings: Tab<SettingsSubTool> = {
        name: this.editingElement.name,
        data: "ElementSettings",
        icon: this.editingElement.icon
      };
      return this.subTools.concat(elementSettings);
    } else {
      return this.subTools;
    }
  }

  private get selectedSubTool(): SettingsSubTool {
    return appStore.getters<SettingsSubTool>("selectedSettingsSubTool");
  }

  private set selectedSubTool(value: SettingsSubTool) {
    appStore.commit("setSettingsSubTool", value);
  }
}
</script>

<style lang="scss" scoped>
  .subtool {
    padding: 20px;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
  }
</style>
