<template>
  <div class="basic-settings">
    <section>
      <header>{{ $t("document.name") }}</header>
      <input-field v-model="document.name" />
    </section>
    <section>
      <header>{{ $t("document.design") }}</header>
      <setting-selector :model-value="document.defaults.setting" @update:modelValue="setSetting" />
    </section>
    <section>
      <header>{{ $t("document.pageSize") }}</header>
      <page-size-selector v-model="document.format" />
    </section>
  </div>
</template>

<script lang="ts">
import DocumentModel from "@/models/document";
import { Vue, Prop, Options } from "vue-property-decorator";
import { SettingName } from "@/models/setting";
import SettingSelector from "@/components/app/document/setting/SettingSelector.vue";
import PageSizeSelector from "@/components/app/document/page-size/PageSizeSelector.vue";

@Options({
  components: {
    SettingSelector,
    PageSizeSelector,
  },
})
export default class DocumentBasicSettings extends Vue {
  @Prop({ type: Object, required: true })
  private readonly modelValue!: DocumentModel;

  private get document(): DocumentModel {
    return this.modelValue;
  }

  private set document(value: DocumentModel) {
    this.$emit("update:modelValue", value);
  }

  private setSetting(settingName: SettingName) {
    this.document.defaults.setting = settingName;
    this.document.defaults.background = settingName + "-1";
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
}
</style>
