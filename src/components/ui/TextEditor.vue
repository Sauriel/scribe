<template>
  <div class="editor" :class="{ 'editor--small': small}">
    <editor-menu-bar v-if="internalValue && !disabled" :editor="editor" v-slot="{ commands, isActive, getMarkAttrs }">
      <div class="editor-tools">
        <font-awesome-icon
          v-if="configuration.bold"
          icon="bold"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        />
        <font-awesome-icon
          v-if="configuration.italic"
          icon="italic"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        />
        <font-awesome-icon
          v-if="configuration.underlined"
          icon="underline"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        />
        <font-awesome-icon
          v-if="configuration.strike"
          icon="strikethrough"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        />
        <font-awesome-icon
          v-if="configuration.heading"
          icon="heading"
          :class="{ 'is-active': isActive.heading({ level: 5 }) }"
          @click="commands.heading({ level: 5 })"
        />
        <font-awesome-icon
          v-if="configuration.history"
          icon="undo"
          @click="commands.undo"
        />
        <font-awesome-icon
          v-if="configuration.history"
          icon="redo"
          @click="commands.redo"
        />
        <font-awesome-icon
          v-if="configuration.uList"
          icon="list-ul"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        />
        <font-awesome-icon
          v-if="configuration.oList"
          icon="list-ol"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        />
        <font-awesome-icon
          v-if="configuration.alignment"
          icon="align-left"
          :class="{ 'is-active': getMarkAttrs('alignment').align === 'left' }"
          @click="commands.alignment({ align: 'left' })"
        />
        <font-awesome-icon
          v-if="configuration.alignment"
          icon="align-center"
          :class="{ 'is-active': getMarkAttrs('alignment').align === 'center' }"
          @click="commands.alignment({ align: 'center' })"
        />
        <font-awesome-icon
          v-if="configuration.alignment"
          icon="align-right"
          :class="{ 'is-active': getMarkAttrs('alignment').align === 'right' }"
          @click="commands.alignment({ align: 'right' })"
        />
        <font-awesome-icon
          v-if="configuration.alignment"
          icon="align-justify"
          :class="{ 'is-active': getMarkAttrs('alignment').align === 'justify' }"
          @click="commands.alignment({ align: 'justify' })"
        />
        <span class="font-picker" v-if="configuration.font">
          Font:
          <font-family-picker :value="getActiveFont(getMarkAttrs)" @input="fontChanged(commands, $event)" :default="defaultFont" />
        </span>
        <span class="size-picker" v-if="configuration.size">
          Size:
          <dropdown
            :items="fontSizes"
            :value="getSelectedFontSize(getMarkAttrs)"
            @input="commands.size({ size: $event })"
          >
            <li>
              <input
                type="string"
                placeholder="custom"
                class="size-picker-custom"
                :value="getSelectedFontSize(getMarkAttrs)"
                @keydown.enter="fontSizeChanged(commands, $event)"
              />
            </li>
          </dropdown>
        </span>
        <slot name="tools" />
      </div>
    </editor-menu-bar>
    <editor-content :editor="editor" class="editor-content" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
// @ts-ignore
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
  // @ts-ignore
import { Bold, BulletList, ListItem, History, Italic, OrderedList, Strike, Underline, Heading } from 'tiptap-extensions';
import Alignment from "@/tiptap/alignment";
import FontFamily from "@/tiptap/fontFamily";
import FontSize, { DEFAULT_SIZE } from "@/tiptap/fontSize";
import FontFamilyPicker from "@/components/ui/FontFamilyPicker.vue";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown.vue";

export interface TextEditorConfig {
  bold?: boolean;
  italic?: boolean;
  underlined?: boolean;
  strike?: boolean;
  heading?: boolean;
  history?: boolean;
  uList?: boolean;
  oList?: boolean;
  alignment?: boolean;
  font?: boolean;
  size?: boolean;
}

const defaultConfig: TextEditorConfig = {
  bold: true,
  italic: true,
  underlined: true,
  strike: true,
  heading: false,
  history: true,
  uList: true,
  oList: true,
  alignment: true,
  font: true,
  size: true
};

@Component({ components: { EditorContent, EditorMenuBar, FontFamilyPicker, Dropdown }})
export default class TextEditor extends Vue {
  @Prop(String)
  readonly value!: string;

  @Prop({ type: Boolean, default: false})
  readonly disabled!: boolean;

  @Prop(Object)
  readonly config?: TextEditorConfig;

  @Prop({ type: Boolean, default: false})
  readonly small!: boolean;

  private configuration = defaultConfig;

  private defaultFont = "BookSanity";

  private editor: Editor = null;

  private get fontSizes(): DropdownItem[] {
    const fontSizes: DropdownItem[] = [ { name: "Default", value: DEFAULT_SIZE } ];
    const availableFontSizes = [ 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 36, 42, 56 ,72 ];
    return fontSizes.concat(availableFontSizes.map(this.toDropdownItem));
  }

  private toDropdownItem(size: number): DropdownItem {
    return {
      name: size + "pt",
      value: size + "pt"
    };
  }

  private get internalValue(): string {
    return this.value;
  }

  private set internalValue(value: string) {
    this.$emit("input", value);
  }

  mounted() {
    if (this.config) {
      this.configuration =  { ...defaultConfig, ...this.config };
    }
    const extensions = [];
    if (this.configuration.bold) {
      extensions.push(new Bold());
    }
    if (this.configuration.uList) {
      extensions.push(new BulletList());
    }
    if (this.configuration.oList) {
      extensions.push(new OrderedList());
    }
    if (this.configuration.uList || this.configuration.oList) {
      extensions.push(new ListItem());
    }
    if (this.configuration.history) {
      extensions.push(new History());
    }
    if (this.configuration.italic) {
      extensions.push(new Italic());
    }
    if (this.configuration.strike) {
      extensions.push(new Strike());
    }
    if (this.configuration.underlined) {
      extensions.push(new Underline());
    }
    if (this.configuration.font) {
      extensions.push(new FontFamily(this.defaultFont));
    }
    if (this.configuration.size) {
      extensions.push(new FontSize());
    }
    if (this.configuration.heading) {
      extensions.push(new Heading());
    }
    if (this.configuration.alignment) {
      extensions.push(new Alignment());
    }
    this.editor = new Editor({
      extensions: extensions,
      content: this.internalValue,
      editable: !this.disabled,
      // @ts-ignore
      onUpdate: ({getJSON, getHTML}) => this.internalValue = getHTML()
    });
  }

  @Watch("value")
  onValueChanged() {
    if (this.internalValue !== this.editor.getHTML()) {
      this.editor.setContent(this.internalValue, false);
    }
  }

  @Watch("disabled")
  onDisabledChanged() {
    this.editor.setOptions({ editable: !this.disabled });
  }

  private getActiveFont(getMarkAttrs: any) {
    const font = getMarkAttrs('font').font;
    return font ? font : this.defaultFont;
  }

  private fontChanged(commands: any, result: string) {
    commands.font({ font: result })
  }

  private getSelectedFontSize(getMarkAttrs: any) {
    const size = getMarkAttrs('size').size;
    return size ? size : DEFAULT_SIZE;
  }

  private fontSizeChanged(commands: any, event: KeyboardEvent) {
    // @ts-ignore
    const value = event.target.value;
    commands.size({ size: isNaN(value) ? value : value + "pt" })
    event.preventDefault();
  }

  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

.editor {
  background-color: $foregroundDark;
  color: $backgroundDark;
  padding: 5px 10px;

  &-tools {
    background-color: $background;
    margin: -5px -15px;
    padding: 10px 0;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-wrap: wrap;
    color: $foreground;

    ::v-deep > * {
      cursor: pointer;
      margin: 10px 5px 0;

      &:hover {
        color: $foregroundDark;
      }

      &.is-active {
        color: $primaryLight;
      }
    }

    .size-picker {
      &-custom {
        border: none;
        width: 100%;
        background-color: $foregroundDark;
        color: $backgroundDark;
        border-bottom: 2px solid $background;;

        &:focus {
          outline: none;
        }
      }
    }
  }

  &-content {
    ::v-deep > .ProseMirror {
      &[contenteditable=false] {
        cursor: not-allowed;
        color: $backgroundLight;
      }

      &:focus {
        outline: none;
      }
    }
  }

  &--small {
    background-color: transparent;
    padding: 0;

    .editor-tools {
      margin: 0;
      padding: 0;
      background-color: transparent;

      > * {
        margin-top: 0;
      }
    }

    .editor-content {
      ::v-deep > .ProseMirror {
        color: $foreground;
        border-bottom: 2px solid $foreground;
        padding: 5px 10px;

        &:not(.ProseMirror[contenteditable=false]):focus {
          outline: none;
          border-bottom-color: $primary;
        }

        > p {
          margin: 0;
        }
      }
    }
  }
}
</style>
