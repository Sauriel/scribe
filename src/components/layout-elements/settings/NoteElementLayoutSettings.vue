<template>
  <div class="settings">
    <span>
      Type:
      <dropdown
        :items="types"
        v-model="element.type"
        :disabled="element.locked"
      />
    </span>
    <text-editor v-model="element.text" :disabled="element.locked" :config="textEditorConfig" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import NoteElement, { NoteType } from '@/models/layout-elements/NoteElement';
import TextEditor, { TextEditorConfig } from '@/components/ui/TextEditor.vue';
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown.vue";

@Component({ components: { TextEditor, Dropdown }})
export default class NoteElementLayoutSettings extends Vue {
  @Prop(Object)
  readonly element!: NoteElement;

  private textEditorConfig: TextEditorConfig = {
    heading: true
  }

  private get types(): DropdownItem[] {
    const types: DropdownItem[] = [
      { name: "Note", value: NoteType.NOTE },
      { name: "Description", value: NoteType.DESCRIPTION }
      ];
    return types;
  }
}
</script>

<style lang="scss" scoped>
</style>
