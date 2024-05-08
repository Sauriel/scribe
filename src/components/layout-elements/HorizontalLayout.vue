<template>
  <div class="row">
    <div
      class="col"
      v-for="(column, index) in element.columns"
      :key="index"
      :style="style(column)"
    >
      <component :is="column.element.component" :element="column.element" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import HorizontalLayoutElement, { Column } from '@/models/layout-elements/HorizontalLayoutElement';
import VerticalLayout from '@/components/layout-elements/VerticalLayout.vue';
import VuexHelper from '@/helper/VuexHelper';

const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { VerticalLayout } })
export default class HorizontalLayout extends Vue {
  @Prop(Object)
  readonly element!: HorizontalLayoutElement;

  private style(column: Column): Record<string, string> {
    return {
      "flex-basis": column.width + "%"
    }
  }
}
</script>

<style lang="scss" scoped>
  .row {
    display: flex;
    min-height: 30px;
    margin: 0 -5mm;

    .col {
      flex: 0 0 auto;
      padding: 0 5mm;
    }
  }
</style>
