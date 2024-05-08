<template>
  <div class="edit-panel">
    <component v-if="component" :is="component" :document="document" />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-property-decorator";
import DocumentDefaultsEditPanel from "@/components/app/edit/document-defaults/DocumentDefaultsEditPanel.vue";
import PageBackgroundEditPanel from "@/components/app/edit/background/PageBackgroundEditPanel.vue";
import PageBackgroundImagesEditPanel from "@/components/app/edit/background/image/PageBackgroundImagesEditPanel.vue";
import VuexHelper from "@/helper/VuexHelper";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreGetters } from "@/store/layout/layoutStoreGetters";
import DocumentModel from "@/models/document";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);
const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  components: {
    DocumentDefaultsEditPanel,
    PageBackgroundEditPanel,
    PageBackgroundImagesEditPanel,
  },
})
export default class EditPanel extends Vue {
  private get component(): string | undefined {
    return layoutStore.getters(LayoutStoreGetters.EDIT_PANEL_COMPONENT);
  }

  private get document(): DocumentModel {
    return documentStore.getters<DocumentModel>(DocumentStoreGetters.DOCUMENT) as DocumentModel;
  }
}
</script>

<style lang="scss" scoped>
.edit-panel {
  padding: 1rem;
  width: 100%;
}
</style>
