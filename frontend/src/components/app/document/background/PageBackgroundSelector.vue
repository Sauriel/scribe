<template>
  <div class="background-images">
    <div
      v-for="(setting, index) of settingsWithBackgrounds"
      :key="'b1-group-' + index"
      class="background-image"
    >
      <header>{{ $t("settings." + setting.name) }}</header>
      <div class="background-image-list">
        <div
          v-for="(background, bIndex) of setting.backgrounds"
          :key="'bi-entry-' + bIndex"
          class="settings-background-image"
          :class="{
            'settings-background-image--selected': background.id === internalValue,
          }"
          @click="internalValue = background.id"
        >
          <img :src="background.thumb" :style="pageThumbnailStyle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";
import { PageFormat } from "@/models/document/pageFormat";
import { SettingsWithBackgrounds, BACKGROUNDS } from "@/models/document/backgrounds";

export default class PageBackgroundSelector extends Vue {
  @Prop({ type: String, required: true })
  private readonly modelValue!: string;

  @Prop({ type: Object, required: true })
  private readonly format!: PageFormat;

  private get internalValue(): string {
    return this.modelValue;
  }

  private set internalValue(value: string) {
    this.$emit("update:modelValue", value);
  }

  private get settingsWithBackgrounds(): SettingsWithBackgrounds[] {
    return BACKGROUNDS;
  }

  private get pageThumbnailStyle(): Record<string, string> {
    const pageFormat = this.format;
    const pHeight = pageFormat.height * pageFormat.unit.pixelPerUnit;
    const pWidth = pageFormat.width * pageFormat.unit.pixelPerUnit;
    const height = 100;
    const width = (height / pHeight) * pWidth;
    return {
      width: width + "px",
      height: height + "px",
    };
  }
}
</script>

<style lang="scss" scoped>
.background-images {
  display: flex;
  overflow-y: hidden;
  overflow-x: auto;
  max-height: 220px;

  .background-image {
    header {
      white-space: nowrap;
      padding: 0.25rem 1rem;
    }

    &:not(:first-child) {
      border-left: 2px solid var(--color-background--light);
    }

    &-list {
      display: flex;

      .settings-background-image {
        display: flex;
        padding: 1rem;
        cursor: pointer;

        &--selected {
          position: relative;

          img {
            border: 2px solid var(--color-primary);
          }

          &::before {
            content: "";
            position: absolute;
            border: 1px solid var(--color-foreground);
            top: calc(1rem - 1px);
            left: calc(1rem - 1px);
            bottom: calc(1rem - 1px);
            right: calc(1rem - 1px);
          }
        }

        img {
          width: 100px;
        }
      }
    }
  }
}
</style>
