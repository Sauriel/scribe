<template>
  <div class="image-input">
    <btn icon="globe-americas" @click="isFile = false" :class="{ 'selected': !isFile }" />
    <btn icon="file-image" @click="isFile = true" :class="{ 'selected': isFile }" />
    <input v-if="!isFile" type="text" placeholder="Web URL" class="text-input" v-model="image" />
    <btn v-if="isFile" class="file-input">
      <label class="hide-input">
        <strong>Select File</strong>
        <input type="file" accept="image/*" @change="handleImage" />
      </label>
    </btn>
    <btn icon="times" @click="image = null" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

export interface Img {
  src: string;
  width: number;
  height: number;
}

@Component
export default class ImageInput extends Vue {
  @Prop(Object)
  readonly value!: Img;

  private isFile = true;

  private get image(): string {
    return this.value.src;
  }

  private set image(value: string) {
      const img: Img = {
        src: value,
        width: 0,
        height: 0
      };
      const htmlImage = new Image();
      htmlImage.onload = () => {
        img.width = htmlImage.width;
        img.height = htmlImage.height;
      }
      // @ts-ignore
      htmlImage.src = value;
    this.$emit("input", img);
  }

  private handleImage(event: Event) {
    // @ts-ignore
    const selectedImage = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
    // @ts-ignore
      this.image = e.target.result;
    };
    reader.readAsDataURL(selectedImage);
  }
}
</script>

<style lang="scss" scoped>
  @import "@/style/colors.scss";

  .image-input {
    display: flex;
    width: 100%;

    &::v-deep {
      button {
        flex: 0 0 auto;
        margin: 0;

        &.selected {
          background-color: $background;
          color: $foreground;
          border-color: $foreground;;
        }
      }
    }

    .text-input, .file-input {
      flex: 1 1 auto;
    }

    .file-input {
      padding: 0;
    }

    .text-input {
      height: 30px;
    }

    .hide-input {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      > input {
        display: none;
      }
    }
  }
</style>
