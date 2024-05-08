<template>
  <div class="tip-tap" :class="{ 'tip-tap--disabled': disabled }" @drop="true">
    <bubble-menu
      class="bubble-menu"
      v-if="showBubbleMenu"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
    >
      <tip-tap-menu
        :editor="editor"
        :defaults="defaults"
        :config="config"
        :document="document"
        @update:style="onStyleUpdate"
      >
        <slot />
      </tip-tap-menu>
    </bubble-menu>

    <tip-tap-menu
      v-if="showTopMenu"
      :editor="editor"
      :defaults="defaults"
      :config="config"
      :document="document"
      @update:style="onStyleUpdate"
    >
      <slot />
    </tip-tap-menu>
    <slot name="before-content" />
    <editor-content :editor="editor" />
    <slot name="after-content" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Watch, Options } from "vue-property-decorator";
import { getCurrentInstance } from "vue";
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import TipTapMenu, { StyleUpdateEvent, TipTapMenuConfig } from "@/components/app/ui/tiptap/menu/TipTapMenu.vue";
import FontSize from "@/tiptap/font-size/";
import Color from "@/tiptap/color/";
import CustomImage from "@/tiptap/image";
import { Getter, Setter } from "@/models";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { ChangeTipTapContentAction } from "@/history/tiptap";
import VuexHelper from "@/helper/VuexHelper";
import { GlobalStoreGetters } from "@/store/global/globalStoreGetters";
import { GLOBAL_STORE_NAMESPACE } from "@/store/global/globalStoreModule";
import DocumentModel from "@/models/document";

export interface TipTapDefaults {
  font?: string;
  size?: number;
  color?: string;
  background?: string;
}

export interface TipTapHistoryConfig<T> {
  object: T;
  set: Setter<T, string>;
  get: Getter<T, string>;
}

export interface TipTapModalPayload<T> {
  config: TipTapHistoryConfig<T>;
  defaults: TipTapDefaults;
}

const globalStore = VuexHelper.createNamespace(GLOBAL_STORE_NAMESPACE);

@Options({
  components: {
    EditorContent,
    BubbleMenu,
    TipTapMenu,
  },
  inject: [HISTORY_MANAGER],
})
export default class TipTap extends Vue {
  @Prop({ type: String, required: true })
  private readonly modelValue!: string;

  @Prop({ type: Boolean, default: false })
  private readonly inline!: boolean;

  @Prop({ type: Object, default: {} })
  private readonly defaults!: TipTapDefaults;

  @Prop({ type: Array, default: [] })
  private readonly config!: TipTapMenuConfig;

  @Prop(Object)
  private readonly historyConfig?: TipTapHistoryConfig<unknown>;

  @Prop({ type: Boolean, default: false })
  private readonly disabled!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly locked!: boolean;

  @Prop(Object)
  private readonly document?: DocumentModel;

  private editor: Editor | null = null;

  private get inlineTipTapBubble(): boolean {
    return !!globalStore.getters(GlobalStoreGetters.INLINE_TIPTAP_BUBBLE);
  }

  private get showBubbleMenu(): boolean {
    return !this.locked && !!this.editor && this.inline && this.inlineTipTapBubble;
  }

  private get showTopMenu(): boolean {
    return !this.locked && !!this.editor && !this.inline;
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private uid = 0;

  @Watch("modelValue")
  onModelValueChange(value: string) {
    if (this.editor?.getHTML() !== value) {
      this.editor?.commands.setContent(this.modelValue, false);
    }
  }

  private onStyleUpdate(event: StyleUpdateEvent) {
    if (this.editor && this.historyConfig) {
      const action = new ChangeTipTapContentAction<unknown>(
        event.type,
        this.historyConfig.object,
        this.historyConfig.set,
        this.historyConfig.get,
        this.modelValue,
        this.editor.getHTML()
      );
      if (event.type === "Color") {
        this.history.gracefulDo(action, "TipTap.color-" + this.uid);
      } else {
        this.history.do(action);
      }
    } else {
      this.$emit("update:modelValue", this.editor?.getHTML());
    }
  }

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  mounted() {
    this.editor = new Editor({
      content: this.modelValue,
      extensions: [
        StarterKit.configure({
          dropcursor: {
            color: "var(--color-secondary)",
          },
        }),
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        TextStyle,
        FontFamily,
        FontSize,
        Color,
        Link,
        CustomImage,
      ],
      editorProps: {
        transformPastedHTML: (html: string) => {
          return html.replace(/\s*[a-zA-Z-]*=".*?"/gm, ""); // Remove all attributes from html tags
        },
        attributes: {
          class: this.inline ? "text-content ProseMirror--inline" : "text-content",
          style: this.getDefaults(),
        },
      },
      onUpdate: () => {
        if (this.editor && this.historyConfig) {
          const action = new ChangeTipTapContentAction<unknown>(
            "Content",
            this.historyConfig.object,
            this.historyConfig.set,
            this.historyConfig.get,
            this.modelValue,
            this.editor.getHTML()
          );
          this.history.gracefulDo(action, "TipTap.value-" + this.uid);
        } else {
          this.$emit("update:modelValue", this.editor?.getHTML());
        }
      },
      onFocus: ({ event }) => {
        this.$emit("focus", event);
      },
      onBlur: ({ event }) => {
        this.$emit("blur", event);
      },
    });
  }

  beforeUnmount() {
    this.editor?.destroy();
  }

  private getDefaults(): string {
    const styles: string[] = [];
    if (this.defaults.color) {
      const style = "color: " + this.defaults.color + ";";
      styles.push(style);
    }
    if (this.defaults.background && !this.inline) {
      const style = "background-color: " + this.defaults.background + ";";
      styles.push(style);
    }
    if (this.defaults.font) {
      const style = 'font-family: "' + this.defaults.font + '";';
      styles.push(style);
    }
    if (this.defaults.size) {
      const style = "font-size: " + this.defaults.size + "pt;";
      styles.push(style);
    }
    return styles.join(" ");
  }
}
</script>

<style lang="scss" scoped>
.tip-tap {
  &--disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
  }

  &:deep(.ProseMirror > * + *) {
    margin-top: 0.75em;
  }

  &:deep(.ProseMirror a) {
    pointer-events: none;
  }

  &:deep(.ProseMirror img.ProseMirror-selectednode) {
    outline: 2px solid var(--color-secondary);

    @media print {
      outline: none;
    }
  }

  &:deep(.ProseMirror img.custom-image--float-left) {
    float: left;
  }

  &:deep(.ProseMirror img.custom-image--float-right) {
    float: right;
  }

  &:deep(.ProseMirror img.custom-image--no-bg) {
    mix-blend-mode: darken;
  }

  &:deep(.ProseMirror:not(.ProseMirror--inline)) {
    padding: 1rem;
    background-color: var(--color-foreground);
    color: var(--color-background);
  }

  &:deep(.ProseMirror:not(.ProseMirror--inline) > p:first-child) {
    margin-block-start: 0;
  }

  &:deep(.ProseMirror:not(.ProseMirror--inline) > p:last-child) {
    margin-block-end: 0;
  }

  &:deep(.tippy-box > .tippy-arrow) {
    display: block;
    height: 20px;
    width: 20px;
    border: 10px solid transparent;
    left: 50%;
    margin-left: -10px;

    @media print {
      display: none;
    }
  }

  &:deep(.tippy-box[data-placement="top"] > .tippy-arrow) {
    bottom: -20px;
    border-top-color: var(--color-background--dark);
  }

  &:deep(.tippy-box[data-placement="bottom"] > .tippy-arrow) {
    top: -20px;
    border-bottom-color: var(--color-background--dark);
  }

  .bubble-menu {
    display: flex;
    padding: 5px 10px;
    border: 2px solid var(--color-background--dark);
    border-radius: 8px;
    min-height: 30px;
    z-index: 100;
    align-items: center;
    justify-content: center;
    position: relative;

    @media print {
      display: none;
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: var(--color-background--dark);
      opacity: 0.75;
      z-index: -1;
    }

    .tip-tap-menu {
      justify-content: center;
      background-color: transparent;
      padding: 0.5em 0 0;
    }
  }

  &:deep(.tippy-box) {
    max-width: 600px !important;

    .menu-group {
      margin-bottom: 0.5em;
    }
  }
}
</style>
