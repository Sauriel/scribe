<template>
  <div
    class="element"
    :style="height(element)"
  >
    <div class="arrow">
      <span>
        {{ element.height + unit }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SpacerElement from '@/models/layout-elements/SpacerElement';
import { PageFormat } from '@/models/AppDocumentSettings';
import VuexHelper from '@/helper/VuexHelper';

const appStore = VuexHelper.createNamespace("appStore");

@Component
export default class SpacerElementLayout extends Vue {
  @Prop(Object)
  readonly element!: SpacerElement;

  private get unit(): string {
    const page: PageFormat = appStore.getters<PageFormat>("documentPageFormat");
    return page.unit;
  }

  private height(element: SpacerElement): Record<string, string> {
    const page: PageFormat = appStore.getters<PageFormat>("documentPageFormat");
    return {
      height: element.height + this.unit
    };
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/colors.scss";

  .element {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 8px;

    .arrow {
      opacity: 0;
      width: calc(100% - 10px);
      height: calc(100% - 10px);
      border: 0 solid $backgroundLight;
      border-top-width: 2px;
      border-bottom-width: 2px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      @media print {
        opacity: 0 !important;
      }

      &::before, &::after {
        content: "";
        display: block;
        position: absolute;
        left: calc(50% - 15px);
        width: 30px;
        height: 30px;
        border: 0 solid $backgroundLight;
        border-top-width: 2px;
        border-left-width: 2px;
        transform-origin: center;
      }

      &::before {
        top: 5px;
        transform: rotate(45deg);
      }

      &::after {
        bottom: 5px;
        transform: rotate(-135deg);
      }

      > span {
        color: $backgroundLight;
      }

      &:hover {
        opacity: 1;
      }
    }
  }
</style>
