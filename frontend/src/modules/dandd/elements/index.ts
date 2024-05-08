import { App } from "vue";
import DandDHeadingElement from "@/modules/dandd/elements/heading/element/DandDHeadingElement.vue";
import DandDHeadingElementPanel from "@/modules/dandd/elements/heading/element/panel/DandDHeadingElementPanel.vue";
import DandDParagraphElement from "@/modules/dandd/elements/paragraph/element/DandDParagraphElement.vue";
import DandDParagraphElementPanel from "@/modules/dandd/elements/paragraph/element/panel/DandDParagraphElementPanel.vue";
import DandDNoteElement from "@/modules/dandd/elements/note/element/DandDNoteElement.vue";
import DandDNoteElementPanel from "@/modules/dandd/elements/note/element/panel/DandDNoteElementPanel.vue";
import DandDTableElement from "@/modules/dandd/elements/table/element/DandDTableElement.vue";
import DandDTableElementPanel from "@/modules/dandd/elements/table/element/panel/DandDTableElementPanel.vue";
import DandDSpellElement from "@/modules/dandd/elements/spell/element/DandDSpellElement.vue";
import DandDSpellElementPanel from "@/modules/dandd/elements/spell/element/panel/DandDSpellElementPanel.vue";
import DandDMonsterElement from "@/modules/dandd/elements/monster/element/DandDMonsterElement.vue";
import DandDMonsterElementPanel from "@/modules/dandd/elements/monster/element/panel/DandDMonsterElementPanel.vue";
import AddDandDMonsterDialogContent, {
  // @ts-ignore
  ADD_DANDD_MONSTER_TAG,
} from "@/modules/dandd/elements/monster/element/dialog/add/AddDandDMonsterDialogContent.vue";
import DandDMonsterWizardDialogContent, {
  // @ts-ignore
  DANDD_MONSTER_WIZARD_TAG,
} from "@/modules/dandd/elements/monster/element/dialog/wizard/DandDMonsterWizardDialogContent.vue";
import DandDMonsterAbilities from "@/modules/dandd/elements/monster/element/dialog/wizard/steps/DandDMonsterAbilities.vue";
import DandDMonsterActions from "@/modules/dandd/elements/monster/element/dialog/wizard/steps/DandDMonsterActions.vue";
import DandDMonsterBasics from "@/modules/dandd/elements/monster/element/dialog/wizard/steps/DandDMonsterBasics.vue";
import DandDMonsterCombat from "@/modules/dandd/elements/monster/element/dialog/wizard/steps/DandDMonsterCombat.vue";
import DandDMonsterLegendary from "@/modules/dandd/elements/monster/element/dialog/wizard/steps/DandDMonsterLegendary.vue";
import DandDMonsterMythic from "@/modules/dandd/elements/monster/wizard-steps/DandDMonsterMythic.vue";
import DandDMonsterSpecialTraits from "@/modules/dandd/elements/monster/element/dialog/wizard/steps/DandDMonsterSpecialTraits.vue";
import DandDMonsterStats from "@/modules/dandd/elements/monster/wizard-steps/DandDMonsterStats.vue";

export function addDandDComponents(app: App<Element>) {
  // Heading
  app.component("DandDHeadingElement", DandDHeadingElement);
  app.component("DandDHeadingElementPanel", DandDHeadingElementPanel);
  // Paragraph
  app.component("DandDParagraphElement", DandDParagraphElement);
  app.component("DandDParagraphElementPanel", DandDParagraphElementPanel);
  // Note
  app.component("DandDNoteElement", DandDNoteElement);
  app.component("DandDNoteElementPanel", DandDNoteElementPanel);
  // Table
  app.component("DandDTableElement", DandDTableElement);
  app.component("DandDTableElementPanel", DandDTableElementPanel);
  // Spell
  app.component("DandDSpellElement", DandDSpellElement);
  app.component("DandDSpellElementPanel", DandDSpellElementPanel);
  // Monster
  app.component("DandDMonsterElement", DandDMonsterElement);
  app.component("DandDMonsterElementPanel", DandDMonsterElementPanel);
  app.component(ADD_DANDD_MONSTER_TAG, AddDandDMonsterDialogContent);
  app.component(DANDD_MONSTER_WIZARD_TAG, DandDMonsterWizardDialogContent);
  app.component("DandDMonsterAbilities", DandDMonsterAbilities);
  app.component("DandDMonsterActions", DandDMonsterActions);
  app.component("DandDMonsterBasics", DandDMonsterBasics);
  app.component("DandDMonsterCombat", DandDMonsterCombat);
  app.component("DandDMonsterLegendary", DandDMonsterLegendary);
  app.component("DandDMonsterSpecialTraits", DandDMonsterSpecialTraits);
}
