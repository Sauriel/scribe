<template>
  <dropdown v-model="selectedFont" :groups="fonts" wide>
    <template #item="{ item }">
      <span :style="'font-family: \'' + item.value + '\';'">
        {{ item.name }}
      </span>
    </template>
  </dropdown>
</template>

<script lang="ts">
import { Prop, Vue } from "vue-property-decorator";
import { DropdownGroup } from "@/components/app/ui/dropdown/Dropdown.vue";
import VuexHelper from "@/helper/VuexHelper";
import DocumentModel from "@/models/document";
import { Setting, SETTINGS } from "@/models/setting";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { GOOGLE_FONTS_CACHE } from "@/google-fonts";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

export default class FontSelector extends Vue {
  // ToDo: Add a search for google fonts
  @Prop({ type: String, required: true })
  private readonly modelValue!: string;

  @Prop(Object)
  private readonly document!: DocumentModel;

  private get selectedFont(): string {
    return this.modelValue;
  }

  private set selectedFont(value: string) {
    this.$emit("update:modelValue", value);
  }

  private get internalDocument(): DocumentModel {
    return this.document || documentStore.getters<DocumentModel>(DocumentStoreGetters.DOCUMENT) as DocumentModel;
  }

  private get fonts(): DropdownGroup[] {
    const googleFonts = Array.from(GOOGLE_FONTS_CACHE.fontList.keys())
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((font) => ({ name: font, value: font }));
    return this.settingFonts.concat({
      label: this.$t("font-selector.google"),
      items: googleFonts,
    });
  }

  private get settingFonts(): DropdownGroup[] {
    const defaultSetting = this.internalDocument.defaults.setting;
    const settings = Object.values(SETTINGS).sort((a: Setting, b: Setting): number => {
      if (a.name == defaultSetting) {
        return -1;
      } else if (b.name == defaultSetting) {
        return 1;
      } else {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      }
    });
    return settings.map((setting) => ({
      label: this.$t("settings." + setting.name),
      items: setting.fonts
        .sort((a: string, b: string) => a.localeCompare(b))
        .map((font) => ({
          name: font,
          value: font,
        })),
    }));
  }
}
</script>
