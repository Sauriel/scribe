<template>
  <div>
    <div class="elements">
      <preview-element
        v-for="(element, index) in elements"
        :key="index"
        :element="element"
      />
    </div>
    <div style="padding: 20px;">
      <h1>Licenses</h1>
      <p>
        This prototype uses styles from <a href="https://github.com/naturalcrit/homebrewery" target="_blank" style="color: lightgray;">Homebrewery</a> for prototyping reasons.
      </p>
      <p>
        The finished product will be developed from scratch and not based on the work of third parties.
      </p>
      <p>
        The Image in the default document is part of the <a href="https://dnd.wizards.com/pressassets" target="_blank" style="color: lightgray;">Wizard of the Coast 2017 Campaign/Products press assets.</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import LayoutElement from '@/models/layout-elements/LayoutElement';
import { Component, Vue } from 'vue-property-decorator';
import { createDefaultSpacerElement } from '@/models/layout-elements/SpacerElement';
import { createDefaultHeadingElement } from '@/models/layout-elements/HeadingElement';
import { createDefaultParagraphElement } from '@/models/layout-elements/ParagraphElement';
import VuexHelper from '@/helper/VuexHelper';
import { PageFormat } from '@/models/AppDocumentSettings';
import { createDefaultHorizontalLayoutElement } from '@/models/layout-elements/HorizontalLayoutElement';
import PreviewElement from "@/components/tools/page/PreviewElement.vue";
import { createDefaultNoteElement } from '@/models/layout-elements/NoteElement';
import { createDefaultTableElement } from '@/models/layout-elements/TableElement';
import { createDefaultMonsterBlockElement } from '@/models/layout-elements/MonsterBlockElement';

const appStore = VuexHelper.createNamespace("appStore");

@Component({ components: { PreviewElement }})
export default class Elements extends Vue {

  private get elements(): LayoutElement[] {
    const page: PageFormat = appStore.getters<PageFormat>("documentPageFormat");
    const list: LayoutElement[] = [];
    list.push(createDefaultSpacerElement(page));
    list.push(createDefaultHeadingElement());
    list.push(createDefaultParagraphElement());
    list.push(createDefaultHorizontalLayoutElement([50, 50]));
    list.push(createDefaultNoteElement());
    list.push(createDefaultTableElement({rows: 4, cols: 3}));
    list.push(createDefaultMonsterBlockElement());
    return list;
  }
}
</script>

<style lang="scss" scoped>
  .elements {
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 30px;
    display: flex;
  }
</style>

function createDefaultMonsterBlockElement(): LayoutElement {
  throw new Error('Function not implemented.');
}
