<template>
  <div class="image-input">
    <button :class="{ selected: !isFile }" @click="isFile = false">
      <font-awesome-icon icon="globe-americas" />
    </button>
    <button v-if="allowFileUpload" :class="{ selected: isFile }" @click="isFile = true">
      <font-awesome-icon icon="file-image" />
    </button>
    <input
      v-if="!isFile"
      type="text"
      :placeholder="$t('image-input.web.placeholder')"
      class="text-input"
      v-model="imageUrl"
    />
    <button v-if="allowFileUpload && isFile" class="file-input">
      <label class="hide-input">
        <strong>
          {{ fileName ? fileName : $t("image-input.file.select") }}
        </strong>
        <input type="file" accept="image/*" @change="handleImage" />
      </label>
    </button>
    <button @click="image = null" class="clear-button">
      <font-awesome-icon icon="times" />
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Watch } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import { GLOBAL_STORE_NAMESPACE } from "@/store/global/globalStoreModule";
import { GlobalStoreGetters } from "@/store/global/globalStoreGetters";
import { ImageSource } from "@/models/";

export interface ImageInputImage {
  src: ImageSource;
  name: string;
  width: number;
  height: number;
}

const globalStore = VuexHelper.createNamespace(GLOBAL_STORE_NAMESPACE);

export default class ImageInput extends Vue {
  @Prop({ type: Object, required: true })
  readonly modelValue!: ImageInputImage;

  private isFile = true;
  private fileName = "";

  private get allowFileUpload(): boolean {
    return globalStore.getters(GlobalStoreGetters.ALLOW_FILE_UPLOAD) || false;
  }

  created() {
    this.isFile = this.allowFileUpload;
    this.fileName = this.modelValue.name;
  }

  @Watch("isFile")
  private onIsFileChange(newValue: boolean) {
    if (newValue) {
      (this.modelValue.src.data = this.modelValue.src.data || ""),
        (this.modelValue.src.url = undefined);
    } else {
      (this.modelValue.src.url = this.modelValue.src.url || ""),
        (this.modelValue.src.data = undefined);
    }
  }

  private get imageUrl(): string {
    return this.modelValue.src.url || "";
  }

  private set imageUrl(value: string) {
    this.image = { url: value };
  }

  private get image(): ImageSource {
    return this.modelValue.src;
  }

  private set image(value: ImageSource) {
    if (value) {
      const name = value.url ? value.url.substring(value.url.lastIndexOf("/") + 1) : "Image";
      this.setImage(value, name);
    } else {
      const img: ImageInputImage = {
        src: {},
        name: "",
        width: 0,
        height: 0,
      };
      this.$emit("update:modelValue", img);
    }
  }

  private setImage(value: ImageSource, name: string) {
    this.fileName = name;
    const img: ImageInputImage = {
      src: value,
      name: name,
      width: 0,
      height: 0,
    };
    const htmlImage = new Image();
    htmlImage.onload = () => {
      img.width = htmlImage.width;
      img.height = htmlImage.height;
    };
    // @ts-ignore
    htmlImage.src = value;
    this.$emit("update:modelValue", img);
  }

  private handleImage(event: Event) {
    // @ts-ignore
    const selectedImage: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      // @ts-ignore
      this.setImage({ data: e.target.result }, selectedImage.name);
    };
    reader.readAsDataURL(selectedImage);
  }
}
</script>

<style lang="scss" scoped>
.image-input {
  display: flex;
  width: 100%;
  border-radius: var(--border-radius);

  button {
    flex: 0 0 auto;
    margin: 0;
    min-height: 2rem;
    min-width: 2rem;
    background-color: var(--color-primary--light);
    border: 1px solid var(--color-primary);
    color: var(--color-foreground);
    border-radius: 0;
    padding: 4px 10px;
    cursor: pointer;

    &:focus,
    &:active {
      outline: none;
    }

    &:hover,
    &.selected {
      background-color: var(--color-primary);
      border-color: var(--color-primary--dark);
    }

    &.file-input label {
      cursor: pointer;
    }

    &.file-input,
    &.clear-button {
      background-color: var(--color-primary);
      border-color: var(--color-primary--dark);

      &:hover {
        background-color: var(--color-primary--light);
        border-color: var(--color-primary);
      }
    }

    &:first-child {
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
    }

    &:last-child {
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }
  }

  .text-input,
  .file-input {
    flex: 1 1 auto;
  }

  .file-input {
    padding: 0;
  }

  .text-input {
    height: 2rem;
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
