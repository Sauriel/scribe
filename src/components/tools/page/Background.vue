<template>
  <div class="background" v-if="page">
    <label>Background Images</label>
    <btn icon="plus" text="Add Image" @click="addImage" />
    <div v-for="(image, index) in page.backgroundImages" :key="index">
      <label>Image mask</label>
      <div class="image-masks">
        <div
          v-for="(mask, index) in masks"
          :key="index"
          class="image-mask"
          :class="[
            { 'image-mask--selected': image.mask === mask },
            mask
          ]"
          @click="image.mask = mask"
          />
      </div>
      <label>Image</label>
      <image-input v-model="image.image" />
      <br />
      <label>Horizontal Position</label>
      <vue-slider v-model="image.horizontalPosition" :min="horizontalPositionMin" :max="horizontalPositionMax" />
      <br />
      <label>Vertical Position</label>
      <vue-slider v-model="image.verticalPosition" :min="verticalPositionMin" :max="verticalPositionMax" />
      <btn alert icon="trash-alt" text="Remove" @click="removeImage(index)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VuexHelper from '@/helper/VuexHelper';
import AppPage from '@/models/AppPage';
import BackgroundImage, { Mask } from '@/models/BackgroundImage';
import ImageInput from "@/components/ui/ImageInput.vue";
import AppDocument from '@/models/AppDocument';
import { PageFormat } from '@/models/AppDocumentSettings';

const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { ImageInput }})
export default class PageSettings extends Vue {

  private horizontalPositionMin = -100;
  private horizontalPositionMax = 100;
  private verticalPositionMin = -100;
  private verticalPositionMax = 100;

  private masks: string[] = [
    Mask.None,
    Mask.Stains.Top,
    Mask.Stains.TopRight,
    Mask.Stains.TopRight2
  ];

  private get page(): AppPage | undefined {
    return appStore.getters<AppPage>("editingPage");
  }

  private get pageFormat(): PageFormat {
    return appStore.getters<PageFormat>("documentPageFormat");
  }

  private addImage() {
    const backgroundImage: BackgroundImage = {
      image: {
        src: "",
        width: 0,
        height: 0
      },
      src: "",
      mask: Mask.None,
      horizontalPosition: 0,
      verticalPosition: 0
    };
    this.page?.backgroundImages.push(backgroundImage);
  }

  private removeImage(index: number) {
    this.page?.backgroundImages.splice(index, 1);
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/colors.scss";

  .image-masks {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .image-mask {
      flex: 0 0 auto;
      height: 135px;
      width: 100px;
      background-position: left top, left top;
      background-repeat: no-repeat, no-repeat;
      background-size: 100px 135px, 100px 135px;
      margin: 5px;
      cursor: pointer;

      &.none {
        background-color: #000;
      }

      &.stains--top {
        background-image: url(../../../assets/masks/stains--top.png), url(../../../assets/PHB-background.png);
      }

      &.stains--top-right {
        background-image: url(../../../assets/masks/stains--top-right.png), url(../../../assets/PHB-background.png);
      }

      &.stains--top-right2 {
        background-image: url(../../../assets/masks/stains--top-right-2.png), url(../../../assets/PHB-background.png);
      }

      &--selected {
        border: 2px solid $alert;
      }
    } 
  }
</style>
