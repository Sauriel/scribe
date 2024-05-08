<template>
  <div>
    <div v-if="!element.locked">
      <vue-slider v-model="element.height" :min="0" :max="pageHeight" />
      <input type="number" v-model="element.height" />
      {{ unit }}
    </div>
    <element-settings-disabled-note v-else />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SpacerElement from '@/models/layout-elements/SpacerElement';
import { PageFormat } from '@/models/AppDocumentSettings';
import VuexHelper from '@/helper/VuexHelper';

const appStore = VuexHelper.createNamespace("appStore");

@Component
export default class SpacerElementLayoutSettings extends Vue {
  @Prop(Object)
  readonly element!: SpacerElement;

  private get pageFormat(): PageFormat {
    return appStore.getters<PageFormat>("documentPageFormat");
  }

  private get unit(): string {
    return this.pageFormat.unit;
  }

  private get pageHeight(): number {
    return this.pageFormat.height;
  }
}
</script>

<style lang="scss" scoped>
</style>
