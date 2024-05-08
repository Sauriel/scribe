<template>
  <div class="settings">
    <accordion>
      <template v-slot:header>
        <h1>Current Document</h1>
      </template>
      <h3>Design</h3>
      <ruleset-selector v-model="ruleset" :items="rules" />
      <h3>Page Format</h3>
      <tabs round shadow-border alternate-colors v-model="pageSize" :tabs="pageFormatsTabs" />
    </accordion>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppDocument from '@/models/AppDocument';
import AppDocumentSettings, { Ruleset, PageFormat, PAGE_FORMATS } from '@/models/AppDocumentSettings';
import VuexHelper from '@/helper/VuexHelper';
import Tabs, { Tab } from "@/components/ui/Tabs.vue";
import Accordion from "@/components/ui/Accordion.vue";
import { RULES_GROUPS } from "@/components/settings/RuleConfig";
import RulesetSelector from "@/components/tools/settings/document/RulesetSelector.vue";

const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { Tabs, RulesetSelector, Accordion }})
export default class DocumentSettings extends Vue {

  private set ruleset(value: Ruleset) {
    this.documentSettings.setting = value;
  }

  private get ruleset(): Ruleset {
    const ruleset = this.documentSettings.setting;
    for (const rule of this.rules) {
      if (rule.name == ruleset.name) {
        this.documentSettings.setting = rule;
        break;
      } else {
        for (const subrule of rule.subRules) {
          if (subrule.name == ruleset.name) {
            this.documentSettings.setting = subrule;
            break;
          }
        }
      }
    }
    return this.documentSettings.setting;
  }

  private get pageSize(): PageFormat {
    const pageSize = this.documentSettings.pageSize;
    const fromAvailablePageSizes = this.pageFormatsTabs.find(tab => tab.name == pageSize.name);
    if (fromAvailablePageSizes) {
      this.documentSettings.pageSize = fromAvailablePageSizes.data;
    }
    return this.documentSettings.pageSize;
  }

  private set pageSize(value: PageFormat) {
    this.documentSettings.pageSize = value;
  }

  private rules: Ruleset[] = [
    RULES_GROUPS.DND,
    RULES_GROUPS.PATHFINDER,
    RULES_GROUPS.CTHULHU,
    RULES_GROUPS.CYBERPUNK,
    RULES_GROUPS.WARHAMMER_40K,
    RULES_GROUPS.WORLD_OF_DARKNESS
  ];

  private pageFormatsTabs: Tab<PageFormat>[] = [
    {
      name: PAGE_FORMATS.DIN_A4.name,
      data: PAGE_FORMATS.DIN_A4
    },
    {
      name: PAGE_FORMATS.US_LETTER.name,
      data: PAGE_FORMATS.US_LETTER
    }
  ];

  private get documentSettings(): AppDocumentSettings {
    const document: AppDocument =  appStore.getters<AppDocument>("document");
    return document.settings;
  }
}
</script>

<style lang="scss" scoped>
</style>
