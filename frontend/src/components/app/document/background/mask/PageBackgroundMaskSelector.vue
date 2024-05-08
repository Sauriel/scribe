<template>
  <div v-for="(setting, index) of settingsWithMasks" :key="'ms-' + index" class="masks">
    <header>{{ $t("settings." + setting.name) }}</header>
    <div
      v-for="(mask, mIndex) of setting.masks"
      :key="'mask-' + mIndex"
      class="mask"
      :class="{ 'mask--selected': mask.id === image.maskId }"
      @click="selectMask(mask)"
    >
      <img :src="mask.src" :style="maskStyle" />
    </div>
  </div>
  <span class="brush-license-info" v-html="$t('about-us.3rd-party.mask-brushes.text')" />
</template>

<script lang="ts">
import { Vue, Prop, Options } from "vue-property-decorator";
import BackgroundImage from "@/models/document/images";
import { SettingsWithMask, SettingMask, MASKS } from "@/models/document/masks";
import { PageFormat } from "@/models/document/pageFormat";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { ChangePageBackgroundImageAction } from "@/history/page/backgroundImage";

@Options({
  inject: [HISTORY_MANAGER],
})
export default class PageBackgroundMaskSelector extends Vue {
  @Prop({ type: Object, required: true })
  private readonly image!: BackgroundImage;

  @Prop({ type: Object, required: true })
  private readonly format!: PageFormat;

  @Prop({ type: Number, required: true })
  private readonly index!: number;

  @Prop({ type: Number, required: true })
  private readonly pageIndex!: number;

  private get settingsWithMasks(): SettingsWithMask[] {
    return MASKS;
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get maskStyle(): Record<string, string> {
    const height = (100 / this.format.width) * this.format.height;
    return {
      height: height + "px",
    };
  }

  private selectMask(mask: SettingMask) {
    const changedImage: BackgroundImage = {
      ...this.image,
      maskId: mask.id,
    };
    const action = new ChangePageBackgroundImageAction(
      this.pageIndex,
      this.index,
      this.image,
      changedImage
    );
    this.history.do(action);
  }
}
</script>

<style lang="scss" scoped>
.masks {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;

  header {
    flex: 0 0 auto;
    width: 100%;
    margin: 0 10px;
    font-weight: bold;
  }

  .mask {
    display: flex;
    background-color: #fff;
    margin: 10px;
    cursor: pointer;

    &--selected {
      position: relative;

      &::before,
      &::after {
        content: "";
        position: absolute;
      }

      &::before {
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border: 4px solid var(--color-foreground);
      }

      &::after {
        top: 1px;
        left: 1px;
        bottom: 1px;
        right: 1px;
        border: 2px solid var(--color-primary);
      }
    }

    img {
      width: 85px;
    }
  }
}
.brush-license-info {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  padding: 0.5em 1em;

  &:deep(a) {
    color: inherit;
  }
}
</style>
