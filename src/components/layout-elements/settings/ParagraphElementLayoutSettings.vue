<template>
  <div class="settings">
    <text-editor v-model="element.text" :disabled="element.locked">
      <template slot="tools">
        <label @click="element.initial = !element.initial">
          <font-awesome-icon :icon="element.initial ? 'toggle-on' : 'toggle-off'" />
          Initial
        </label>
      </template>
    </text-editor>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ParagraphElement from '@/models/layout-elements/ParagraphElement';
import TextEditor from '@/components/ui/TextEditor.vue';

@Component({ components: { TextEditor }})
export default class ParagraphElementLayoutSettings extends Vue {
  @Prop(Object)
  readonly element!: ParagraphElement;
}
</script>

<style lang="scss" scoped>
</style>
