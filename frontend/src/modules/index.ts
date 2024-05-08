import { App } from "vue";
import HorizontalLayoutElement from "@/modules/default/elements/horizontal/element/HorizontalLayoutElement.vue";
import VerticalLayoutElement from "@/modules/default/elements/vertical/element/VerticalLayoutElement.vue";
import HorizontalLayoutElementPanel from "@/modules/default/elements/horizontal/element/panel/HorizontalLayoutElementPanel.vue";
import VerticalSpacingElement from "@/modules/default/elements/spacing/element/VerticalSpacingElement.vue";
import VerticalSpacingElementPanel from "@/modules/default/elements/spacing/element/panel/VerticalSpacingElementPanel.vue";
import { DandDOpenEditFunctions } from "@/modules/dandd";
// @ts-ignore
import AddHorizontalLayoutDialogContent, {
  ADD_HORIZONTAL_LAYOUT_TAG,
} from "@/modules/default/elements/horizontal/element/dialog/AddHorizontalLayoutDialogContent.vue";
import { addDandDComponents } from "@/modules/dandd/elements";

export function addLayoutElements(app: App<Element>) {
  // Default
  app.component("HorizontalLayoutElement", HorizontalLayoutElement);
  app.component("VerticalLayoutElement", VerticalLayoutElement);
  app.component("VerticalSpacingElement", VerticalSpacingElement);
  app.component("HorizontalLayoutElementPanel", HorizontalLayoutElementPanel);
  app.component("VerticalSpacingElementPanel", VerticalSpacingElementPanel);
  app.component(ADD_HORIZONTAL_LAYOUT_TAG, AddHorizontalLayoutDialogContent);

  // Dungeons & Dragons
  addDandDComponents(app);
}

export const OpenEditFunctions = {
  ...DandDOpenEditFunctions,
};
