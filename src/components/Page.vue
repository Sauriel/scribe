<template>
  <div
    class="page page-dnd5e"
    :data-index="index"
    :class="{
      'page--preview': isPreview
    }"
    :style="pageFormat"
  >
    <div class="backgrounds" @click="openBackgroundSettings(page)">
      <img
        v-for="(backgroundImage, index) in page.backgroundImages"
        :key="index"
        :src="backgroundImage.image.src"
        :style="backgroundImageStyle(backgroundImage)"
        class="background-image"
        :class="backgroundImage.mask"
      />
    </div>
    <div class="content">
      <vertical-layout :element="page.layout" />
    </div>
    <div class="page-number">
      {{ pageNumber }}
    </div>
    <div class="footnote">
      Join us in our <a href="https://discord.gg/JDxGbK8f3n" target="_blank">DISCORD community</a> where we discuss future plans.
    </div>
  </div>
</template>

<script lang="ts">
import AppPage from '@/models/AppPage';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PageFormat } from '@/models/AppDocumentSettings';
import VuexHelper from '@/helper/VuexHelper';
import BackgroundImage from '@/models/BackgroundImage';
import VerticalLayout from '@/components/layout-elements/VerticalLayout.vue';

const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { VerticalLayout } })
export default class Page extends Vue {
  @Prop(Boolean)
  readonly isPreview!: boolean;

  @Prop(Number)
  readonly index!: number;

  @Prop(Object)
  readonly page!: AppPage;

  private get pageNumber(): number {
    return this.index + 1;
  }

  private get pageFormat(): Record<string, string> {
    const page: PageFormat = appStore.getters<PageFormat>("documentPageFormat");
    return {
      width: page.width + page.unit,
      height: page.height + page.unit
    };
  }

  private backgroundImageStyle(image: BackgroundImage): Record<string, string> {
    const page: PageFormat = appStore.getters<PageFormat>("documentPageFormat");
    const pageWidth = page.width * page.pixelPerUnit;
    const pageHeight = page.height * page.pixelPerUnit;
    const horizontalPercentile = image.horizontalPosition * 0.01;
    const verticalPercentile = image.verticalPosition * 0.01;
    const horizontalCenterPosition = (pageWidth - image.image.width) / 2;
    const verticalCenterPosition = (pageHeight - image.image.height) / 2;
    const horizontalMargin = 
      pageWidth >= image.image.width
      ? pageWidth + horizontalCenterPosition
      : image.image.width + horizontalCenterPosition;
    const verticalMargin = 
      pageHeight >= image.image.height
      ? pageHeight + verticalCenterPosition
      : image.image.height + verticalCenterPosition;
    const horizontalPosition = horizontalCenterPosition + (horizontalMargin * horizontalPercentile);
    const verticalPosition = verticalCenterPosition + (verticalMargin * verticalPercentile);
    return {
      width: page.width + page.unit,
      height: page.height + page.unit,
      maskSize: (page.width + 2) + page.unit + " " + (page.height + 2) + page.unit,
      objectPosition: horizontalPosition + "px " + verticalPosition + "px"
    };
  }

  private openBackgroundSettings(page: AppPage) {
    appStore.commit("setEditingPage", page);
    appStore.commit("setSelectedTool", "Settings");
    appStore.commit("setSettingsSubTool", "PageSettings");
  }
}
</script>

<style lang="scss">
  @import "@/style/dnd5e.scss";

  .page {
    background-color: #eee5ce;
    background-image: url(../assets/PHB-background.png);
    color: black;
    box-shadow: 5px 5px 10px 2px black;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;

    @media print {
      width: 100% !important;
      box-shadow: none;
    }

    .backgrounds {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;

      >.background-image {
        pointer-events: none;
        position: absolute;
        object-fit: none;
      }

      > .stains {
        mask-position: left top;

        &--top-right {
          mask-image: url(../assets/masks/stains--top-right.png);
        }

        &--top-right2 {
          mask-image: url(../assets/masks/stains--top-right-2.png);
        }

        &--top {
          mask-image: url(../assets/masks/stains--top.png);
        }
      }
    }

    .content {
      position: absolute;
      top: 1cm;
      left: 1.7cm;
      bottom: 1.5cm;
      right: 1.7cm;
      z-index: 2;
    }
    
    .page-number,
    .footnote {
      z-index: 1;
    }
  }
</style>
