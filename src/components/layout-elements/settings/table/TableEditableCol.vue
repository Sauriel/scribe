<template>
  <div class="editable">
    <span v-if="!edit" v-html="value"/>
    <text-editor v-else small v-model="internalValue" :disabled="disabled" :config="textEditorConfig" />
  </div>
</template>

<script lang="ts">
import { TextEditorConfig } from '@/components/ui/TextEditor.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import TextEditor from '@/components/ui/TextEditor.vue';

@Component({ components: { TextEditor }})
export default class TableEditableCol extends Vue {
  @Prop(String)
  readonly value!: string;

  @Prop({ type: Boolean, default: false})
  readonly disabled!: boolean;

  @Prop({ type: Boolean, default: false})
  readonly edit!: boolean;

  private get internalValue(): string {
    return this.value;
  }

  private set internalValue(value: string) {
    this.$emit("input", value);
  }

  private textEditorConfig: TextEditorConfig = {
    history: false,
    uList: false,
    oList: false,
    alignment: false,
    font: false,
    size: false
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

.editable {
  > span {    
    ::v-deep p {
      margin-block-start: .2em;
      margin-block-end: .2em;
    }
  }
}
</style>
