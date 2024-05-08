<template>
  <div class="image-input-dialog">
    <div class="image-input-dialog-content">
      <image-input v-model="image" />
    </div>
    <footer class="footer">
      <btn outline @click="$emit('close')">{{ $t("add-link.close") }}</btn>
      <btn @click="applyChanges">{{ $t("add-link.apply") }}</btn>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Options } from "vue-property-decorator";
import { ImageInputImage } from "@/components/app/ui/image-input/ImageInput.vue";

export interface ImageSelectPayload {
  image: ImageInputImage;
  callback: (image: ImageInputImage) => void;
}

@Options({
  emits: ["close"],
})
export default class ImageSelectDialogContent extends Vue {
  @Prop({ type: Object, required: true })
  private readonly payload!: ImageSelectPayload;

  private get image(): ImageInputImage {
    return this.payload.image;
  }

  private set image(value: ImageInputImage) {
    this.payload.image = value;
  }

  private applyChanges() {
    this.payload.callback(this.payload.image);
    this.$emit("close");
  }
}
</script>

<style lang="scss" scoped>
.image-input-dialog {
  min-width: 350px;

  &-content {
    margin-bottom: 1rem;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    margin: -10px;
  }
}
</style>
