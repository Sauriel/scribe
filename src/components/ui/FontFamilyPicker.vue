<template>
  <div class="font-picker">
    <div id="font-picker-custom"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import FontPicker from "@/font-picker/FontPicker";
import { Font } from "@samuelmeuli/font-manager";
import VuexHelper from "@/helper/VuexHelper";
import AppDocument from "@/models/AppDocument";
import { APP_MESSENGER } from "@/AppMessenger";

const appStore = VuexHelper.createNamespace("appStore");

// ToDo: Fork font-picker and add possibility for not google fonts to be added

@Component
export default class FontFamilyPicker extends Vue {
  @Prop(String)
  readonly value!: string;

  @Prop({ type: String, default: "Open Sans" })
  readonly default!: string;

  private fontPicker: FontPicker | null = null;

  private get internalValue(): string {
    return this.value;
  }

  private set internalValue(value: string) {
    this.$emit("input", value);
  }

  mounted() {
    this.fontPicker = new FontPicker(
      "<YOUR_API_KEY_HERE>", // Google API key
      "Open Sans", // Default font
      {
        limit: 100, // 2021-04-16: There are currently 1052 google fonts, so i'm only loading the top 100
        pickerId: "custom",
        scripts: ["latin", "latin-ext"],
      } // Additional options
    );
    APP_MESSENGER.send("loadFonts");
    APP_MESSENGER.on("fontsLoaded", (event, fonts) => {
      if (this.fontPicker) {
        this.fontPicker.addLocalFonts(fonts, true);
      }
    });
    this.fontPicker.addLocalFonts(this.settingFonts, true);
    this.fontPicker.setActiveFont(this.default);
    this.fontPicker.setOnChange(this.fontChanged);
  }

  @Watch("value")
  onValueChanged() {
    const fontPickerActiveFont = this.fontPicker
      ? this.fontPicker.getActiveFont().family
      : undefined;
    if (this.internalValue !== fontPickerActiveFont && this.fontPicker) {
      this.fontPicker.setActiveFont(this.internalValue);
    }
  }

  private fontChanged(font: Font) {
    this.internalValue = font.family;
  }

  private get settingFonts(): string[] {
    const document: AppDocument = appStore.getters<AppDocument>("document");
    return document.settings.setting.fonts;
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

.font-picker {
  display: inline-block;

  #font-picker-custom {
    width: auto;
    min-width: 150px;

    &::v-deep {
      > .dropdown-button {
        background-color: $backgroundDark;
        height: 25px;

        .dropdown-icon.finished:before {
          border-top-color: $foreground;
        }
      }

      > ul {
        background-color: $backgroundLight;

        > li {
          > button {
            &.active-font,
            &:hover,
            &:focus {
              background-color: $foregroundDark;
              color: $backgroundDark;
            }

            &.active-font {
              color: $primary;
            }
          }
        }
      }
    }
  }
}
</style>
