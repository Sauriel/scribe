<template>
  <div class="tip-tap-menu">
    <div class="menu-group" v-if="$slots.default">
      <slot />
    </div>
    <div class="menu-group" v-if="isVisible('Font', 'Size')">
      <font-selector v-if="isVisible('Font')" v-model="font" :document="documentInternal" />
      <dropdown v-if="isVisible('Size')" v-model="size" :items="sizes" />
    </div>
    <div class="menu-group" v-if="isVisible('Bold', 'Italic', 'Underline', 'Strike', 'Color')">
      <font-awesome-icon
        v-if="isVisible('Bold')"
        icon="bold"
        class="icon"
        :class="{
          'icon--active': editor.isActive('bold'),
        }"
        @click="toggleBold()"
      />
      <font-awesome-icon
        v-if="isVisible('Italic')"
        icon="italic"
        class="icon"
        :class="{
          'icon--active': editor.isActive('italic'),
        }"
        @click="toggleItalic()"
      />
      <font-awesome-icon
        v-if="isVisible('Underline')"
        icon="underline"
        class="icon"
        :class="{
          'icon--active': editor.isActive('underline'),
        }"
        @click="toggleUnderline()"
      />
      <font-awesome-icon
        v-if="isVisible('Strike')"
        icon="strikethrough"
        class="icon"
        :class="{
          'icon--active': editor.isActive('strike'),
        }"
        @click="toggleStrike()"
      />
      <color-picker v-if="isVisible('Color')" v-model="color" :document="documentInternal" />
    </div>
    <div class="menu-group" v-if="isVisible('Link', 'Image', 'Typogr')">
      <font-awesome-icon
        v-if="isVisible('Link')"
        :icon="editor.isActive('link') ? 'unlink' : 'link'"
        class="icon"
        :class="{
          'icon--active': editor.isActive('link'),
        }"
        @click="setLink(editor.isActive('link'))"
      />
      <font-awesome-icon
        v-if="isVisible('Image')"
        icon="image"
        class="icon"
        :class="{
          'icon--active': editor.isActive('custom-image'),
        }"
        @click="addImage"
      />
      <font-awesome-icon
        v-if="isVisible('Typogr')"
        icon="tools"
        class="icon"
        @click="runTypogrJS"
      />
    </div>
    <div class="menu-group" v-if="isVisible('Align')">
      <font-awesome-icon
        icon="align-left"
        class="icon"
        :class="{
          'icon--active': editor.isActive({ textAlign: 'left' }),
        }"
        @click="setTextAlign('left')"
      />
      <font-awesome-icon
        icon="align-center"
        class="icon"
        :class="{
          'icon--active': editor.isActive({ textAlign: 'center' }),
        }"
        @click="setTextAlign('center')"
      />
      <font-awesome-icon
        icon="align-right"
        class="icon"
        :class="{
          'icon--active': editor.isActive({ textAlign: 'right' }),
        }"
        @click="setTextAlign('right')"
      />
      <font-awesome-icon
        icon="align-justify"
        class="icon"
        :class="{
          'icon--active': editor.isActive({ textAlign: 'justify' }),
        }"
        @click="setTextAlign('justify')"
      />
    </div>
    <div class="menu-group" v-if="isVisible('BulletList', 'OrderedList')">
      <font-awesome-icon
        v-if="isVisible('BulletList')"
        icon="list-ul"
        class="icon"
        :class="{
          'icon--active': editor.isActive('bulletList'),
        }"
        @click="toggleBulletList()"
      />
      <font-awesome-icon
        v-if="isVisible('OrderedList')"
        icon="list-ol"
        class="icon"
        :class="{
          'icon--active': editor.isActive('orderedList'),
        }"
        @click="toggleOrderedList()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";
import { Editor } from "@tiptap/vue-3";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import { TipTapDefaults } from "@/components/app/ui/tiptap/TipTap.vue";
import {
  ADD_IMAGE_TAG,
  ADD_LINK_TAG,
  DialogUpdateEvent,
  DIALOG_UPDATE_EVENT_NAME,
  TYPOGR_TAG,
} from "@/events/dialog";
import emitter from "@/emitter";
import { AddLinkPayload } from "@/components/app/dialog/link/AddLinkDialogContent.vue";
import { LinkConfig } from "@/models";
import { intersection, isEmpty } from "lodash";
import { TypogrConfig, TypogrPayload } from "@/components/app/dialog/typogr/TypogrDialogContent.vue";
// @ts-ignore
import typogr from "typogr";
import { AddImageConfig, AddImagePayload, ImageFloat } from "@/components/app/dialog/image/add/AddImageDialogContent.vue";
import { CustomImageAttributes } from "@/tiptap/image";
import { Unit, Units } from "@/models/document/pageFormat";
import DocumentModel from "@/models/document";
import VuexHelper from "@/helper/VuexHelper";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

export declare type StyleType =
  | "OrderedList"
  | "BulletList"
  | "Strike"
  | "Underline"
  | "Italic"
  | "Bold"
  | "Color"
  | "Size"
  | "Font"
  | "Align"
  | "Link"
  | "Typogr"
  | "Image";

export interface StyleUpdateEvent {
  type: StyleType;
  value?: string;
}

export declare type TipTapMenuConfig = StyleType[];

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 36, 42, 56, 72];
const DEFAULT_FONT = "sans-serif";
const DEFAULT_FONT_SIZE = "12pt";
const DEFAULT_COLOR = "#ffffff";

export default class TipTapMenu extends Vue {
  @Prop({ type: Object, required: true })
  private readonly editor!: Editor;

  @Prop({ type: Object, default: {} })
  private readonly defaults!: TipTapDefaults;

  @Prop({ type: Array, default: [] })
  private readonly config!: TipTapMenuConfig;

  @Prop(Object)
  private readonly document?: DocumentModel;

  private get documentInternal(): DocumentModel {
    return this.document || documentStore.getters<DocumentModel>(DocumentStoreGetters.DOCUMENT) as DocumentModel;
  }

  private isVisible(...types: StyleType[]): boolean {
    return this.config.length === 0 || intersection(types, this.config).length > 0;
  }

  private get font(): string {
    const textStyle = this.editor.getAttributes("textStyle");
    const fontFamily = textStyle.fontFamily;
    if (fontFamily) {
      return fontFamily;
    }
    return this.defaults.font ? this.defaults.font : DEFAULT_FONT;
  }

  private set font(value: string) {
    const isDefault = this.defaults.font ? this.defaults.font === value : DEFAULT_FONT === value;
    if (isDefault) {
      this.editor.chain().focus().unsetFontFamily().setMeta("preventUpdate", true).run();
    } else {
      this.editor.chain().focus().setFontFamily(value).setMeta("preventUpdate", true).run();
    }
    const event: StyleUpdateEvent = {
      type: "Font",
      value: value,
    };
    this.$emit("update:style", event);
  }

  private get size(): string {
    const textStyle = this.editor.getAttributes("textStyle");
    const fontSize = textStyle.fontSize;
    if (fontSize) {
      return fontSize;
    }
    return this.defaults.size ? this.defaults.size + "pt" : DEFAULT_FONT_SIZE;
  }

  private set size(value: string) {
    const isDefault = this.defaults.size
      ? this.defaults.size + "pt" === value
      : DEFAULT_FONT_SIZE === value;
    if (isDefault) {
      this.editor.chain().focus().unsetFontSize().setMeta("preventUpdate", true).run();
    } else {
      this.editor.chain().setFontSize(value).setMeta("preventUpdate", true).run();
    }
    const event: StyleUpdateEvent = {
      type: "Size",
      value: value,
    };
    this.$emit("update:style", event);
  }

  private get sizes(): DropdownItem[] {
    return FONT_SIZES.map((size) => ({
      name: size + "pt",
      value: size + "pt",
    }));
  }

  private get color(): string {
    const textStyle = this.editor.getAttributes("textStyle");
    const color = textStyle.color;
    if (color) {
      return color;
    }
    return this.defaults.color ? this.defaults.color : DEFAULT_COLOR;
  }

  private set color(value: string) {
    const isDefault = this.defaults.color ? this.defaults.color === value : DEFAULT_COLOR === value;
    if (isDefault) {
      this.editor.chain().focus().unsetColor().setMeta("preventUpdate", true).run();
    } else {
      this.editor.chain().focus().setColor(value).setMeta("preventUpdate", true).run();
    }
    const event: StyleUpdateEvent = {
      type: "Color",
      value: value,
    };
    this.$emit("update:style", event);
  }

  private toggleBold() {
    this.editor.chain().focus().toggleBold().setMeta("preventUpdate", true).run();
    const event: StyleUpdateEvent = {
      type: "Bold",
    };
    this.$emit("update:style", event);
  }

  private toggleItalic() {
    this.editor.chain().focus().toggleItalic().setMeta("preventUpdate", true).run();
    const event: StyleUpdateEvent = {
      type: "Italic",
    };
    this.$emit("update:style", event);
  }

  private toggleUnderline() {
    this.editor.chain().focus().toggleUnderline().setMeta("preventUpdate", true).run();
    const event: StyleUpdateEvent = {
      type: "Underline",
    };
    this.$emit("update:style", event);
  }

  private toggleStrike() {
    this.editor.chain().focus().toggleStrike().setMeta("preventUpdate", true).run();
    const event: StyleUpdateEvent = {
      type: "Strike",
    };
    this.$emit("update:style", event);
  }

  private setTextAlign(value: string) {
    this.editor.chain().focus().setTextAlign(value).setMeta("preventUpdate", true).run();
    const event: StyleUpdateEvent = {
      type: "Align",
      value: value,
    };
    this.$emit("update:style", event);
  }

  private toggleBulletList() {
    this.editor.chain().focus().toggleBulletList().setMeta("preventUpdate", true).run();
    const event: StyleUpdateEvent = {
      type: "BulletList",
    };
    this.$emit("update:style", event);
  }

  private toggleOrderedList() {
    this.editor.chain().focus().toggleOrderedList().setMeta("preventUpdate", true).run();
    const event: StyleUpdateEvent = {
      type: "OrderedList",
    };
    this.$emit("update:style", event);
  }

  private setLink(isSet: boolean) {
    if (isSet) {
      this.setLinkValue();
    } else {
      const event: DialogUpdateEvent<AddLinkPayload> = {
        name: DIALOG_UPDATE_EVENT_NAME,
        payload: {
          component: ADD_LINK_TAG,
          visible: true,
          payload: {
            linkConfig: {
              href: "",
              openInNewTab: true,
            },
            callback: this.setLinkValue,
          },
        },
      };
      emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
    }
  }

  private setLinkValue(value?: LinkConfig) {
    if (value && !isEmpty(value.href?.trim())) {
      const link = {
        href: value.href,
        target: value.openInNewTab ? "_blank" : undefined,
      };
      this.editor.chain().focus().setLink(link).setMeta("preventUpdate", true).run();
    } else {
      this.editor.chain().focus().unsetLink().setMeta("preventUpdate", true).run();
    }
    const styleUpdateEvent: StyleUpdateEvent = {
      type: "Link",
    };
    this.$emit("update:style", styleUpdateEvent);
  }

  private runTypogrJS() {
    const event: DialogUpdateEvent<TypogrPayload> = {
      name: DIALOG_UPDATE_EVENT_NAME,
      payload: {
        component: TYPOGR_TAG,
        visible: true,
        payload: {
          typogrConfig: {
            smartypants: false,
            widont: false,
          },
          callback: this.setTypogrValues,
        },
      },
    };
    emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
  }

  private setTypogrValues(config: TypogrConfig) {
    let typogrChain = typogr(this.editor.getHTML()).chain();
    if (config.smartypants) {
      typogrChain = typogrChain.smartypants();
    }
    if (config.widont) {
      typogrChain = typogrChain.widont();
    }
    const newText = typogrChain.value();
    this.editor.chain().focus().setContent(newText).setMeta("preventUpdate", true).run();
    const styleUpdateEvent: StyleUpdateEvent = {
      type: "Typogr",
    };
    this.$emit("update:style", styleUpdateEvent);
  }

  private addImage() {
    const imageSelected = this.editor.isActive("custom-image");
    const imageConfig: AddImageConfig = {
      image: {},
      name: "",
      float: ImageFloat.NONE,
      noBg: false,
      pngMask: false,
    };
    if (imageSelected) {
      const attributes: CustomImageAttributes = this.editor.getAttributes(
        "custom-image"
      ) as CustomImageAttributes;
      imageConfig.image = { url: attributes.src }; // ToDo: Update when image upload is enabled
      imageConfig.float = attributes.float;
      imageConfig.noBg = attributes.noBg;
      imageConfig.pngMask = attributes.pngMask;
      imageConfig.name = attributes.title || attributes.alt || "";
      if (attributes.width !== "auto") {
        const valueMatch = attributes.width.match(/\d+/g);
        const unitSuffixMatch = attributes.width.match(/[a-zA-Z]+/g);
        if (valueMatch && unitSuffixMatch) {
          const value = +valueMatch[0];
          const unitSuffix = unitSuffixMatch[0];
          const unit: Unit =
            Object.values(Units).find((unit) => unit.suffix === unitSuffix) || Units.PIXEL;
          imageConfig.width = {
            value: value,
            unit: unit,
          };
        }
        if (attributes.height !== "auto") {
          const valueMatch = attributes.height.match(/\d+/g);
          const unitSuffixMatch = attributes.height.match(/[a-zA-Z]+/g);
          if (valueMatch && unitSuffixMatch) {
            const value = +valueMatch[0];
            const unitSuffix = unitSuffixMatch[0];
            const unit: Unit =
              Object.values(Units).find((unit) => unit.suffix === unitSuffix) || Units.PIXEL;
            imageConfig.height = {
              value: value,
              unit: unit,
            };
          }
        }
      }
    }
    const event: DialogUpdateEvent<AddImagePayload> = {
      name: DIALOG_UPDATE_EVENT_NAME,
      payload: {
        component: ADD_IMAGE_TAG,
        visible: true,
        payload: {
          addImageConfig: imageConfig,
          callback: this.addImageValue,
        },
      },
    };
    emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
  }

  private addImageValue(config: AddImageConfig) {
    const image: CustomImageAttributes = {
      src: config.image.url || config.image.data || "",
      title: config.name,
      alt: config.name,
      float: config.float,
      noBg: config.noBg,
      pngMask: config.pngMask,
      width: config.width ? config.width.value + config.width.unit.suffix : "auto",
      height: config.height ? config.height.value + config.height.unit.suffix : "auto",
    };
    this.editor.chain().focus().setImage(image).setMeta("preventUpdate", true).run();
    const styleUpdateEvent: StyleUpdateEvent = {
      type: "Image",
    };
    this.$emit("update:style", styleUpdateEvent);
  }
}
</script>

<style lang="scss" scoped>
.tip-tap-menu {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.5em 0;
  background-color: var(--color-background--light);

  .icon {
    color: var(--color-foreground--dark);
    cursor: pointer;

    &:hover,
    &--active {
      color: var(--color-secondary);
    }
  }

  .menu-group {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    > * {
      margin: 0 0.5em;
    }

    &:not(:last-child) {
      border-right: 2px solid var(--color-foreground--dark);
    }
  }
}
</style>
