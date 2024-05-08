<template>
  <div class="color-picker">
    <div class="preview" :style="pickerStyle" @click="show = !show" />
    <color-kit
      v-if="show"
      theme="dark"
      :color="color"
      :colors-default="predefinedColors"
      @changeColor="onChangeColor"
      v-click-outside="onClickOutside"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import { ColorPicker as ColorKit } from "vue-color-kit";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import DocumentModel from "@/models/document";
import { SETTINGS } from "@/models/setting";
import VuexHelper from "@/helper/VuexHelper";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

interface ColorKitEvent {
  hex: string;
  hsv: {
    h: number;
    s: number;
    v: number;
  };
  rgba: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}

@Options({
  components: {
    ColorKit,
  },
})
export default class ColorPicker extends Vue {
  @Prop({ type: String, required: true })
  private readonly modelValue!: string;

  @Prop({ type: Array, default: [] })
  private readonly defaultColors!: string[];

  @Prop(Object)
  private readonly document?: DocumentModel;

  private show = false;

  private get color(): string {
    return this.modelValue;
  }

  private set color(value: string) {
    this.$emit("update:modelValue", value);
  }

  private get pickerStyle(): Record<string, string> {
    return {
      backgroundColor: this.color,
    };
  }

  private onChangeColor(event: ColorKitEvent) {
    if (event.rgba.a < 1) {
      this.color =
        "rgba(" +
        event.rgba.r +
        ", " +
        event.rgba.g +
        ", " +
        event.rgba.b +
        ", " +
        event.rgba.a +
        ")";
    } else {
      this.color = event.hex;
    }
  }

  private onClickOutside() {
    this.show = false;
  }

  private get settingColors(): string[] {
    const defaultSetting = Object.values(SETTINGS).find(
      (setting) => setting.name === this.document?.defaults.setting
    );
    return defaultSetting ? defaultSetting.colors.map((color) => color.value) : [];
  }

  private get predefinedColors(): string[] {
    return this.defaultColors.concat(this.settingColors);
  }
}
</script>

<style lang="scss">
@import "@/styles/ext/vue-color-kit.scss";

.color-picker {
  position: relative;
  margin: 0 0.5em;

  > .preview {
    width: 1em;
    height: 1em;
    border: 1px solid var(--color-foreground--dark);
    background-color: red;
    cursor: pointer;
  }

  > .hu-color-picker {
    position: absolute;
    right: -7px;
    top: calc(1em + 10px);
    width: 218px !important; // Fix for style in library
    background: var(--color-background);
    border: 1px solid var(--color-background--dark);
    border-radius: var(--border-radius);

    &::before {
      content: "";
      box-sizing: border-box;
      position: absolute;
      display: block;
      height: 20px;
      width: 20px;
      border: 10px solid transparent;
      top: -20px;
      right: var(--border-radius);
      border-bottom-color: var(--color-background--dark);
    }

    .color-type .name {
      color: var(--color-foreground);
      background-color: var(--color-background--dark);
    }

    .color-type .value {
      color: var(--color-foreground);
      background-color: var(--color-background--light);
      font: inherit;
    }
  }
}
</style>
