<template>
  <div class="dandd-monster-wizard">
    <heading :info="$t('dandd-monster-wizard.info')">{{
      editMode
        ? $t("dandd-monster-wizard.edit-header", { name: monster.basic.name })
        : $t("dandd-monster-wizard.header")
    }}</heading>
    <wizard :steps="addMonsterSteps" :model="wizardModel" />
    <footer class="footer">
      <btn outline @click="cancel">
        {{ $t("dandd-monster-wizard.close") }}
      </btn>
      <btn @click="apply">
        {{ $t(this.editMode ? "dandd-monster-wizard.save" : "dandd-monster-wizard.apply") }}
      </btn>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Options } from "vue-property-decorator";
import DocumentModel from "@/models/document";
import DandDMonsterElementModel, { Monster } from "@/modules/dandd/elements/monster/DandDMonsterElementModel";
import { WizardStep, WizardStepModel } from "@/components/app/ui/wizard/Wizard.vue";

export const DANDD_MONSTER_WIZARD_TAG = "dandd-monster-wizard";

export interface DandDMonsterWizardPayload {
  edit: boolean;
  document: DocumentModel;
  model: DandDMonsterElementModel;
  activeStepIndex?: number;
  focus?: any;
  callback: (model: DandDMonsterElementModel) => void;
}

@Options({
  emits: ["close"],
})
export default class DandDMonsterWizardDialogContent extends Vue {
  @Prop({ type: Object, required: true })
  private readonly payload!: DandDMonsterWizardPayload;

  private get monster(): Monster {
    return this.payload.model.value;
  }

  private get editMode(): boolean {
    return this.payload.edit;
  }

  private get wizardModel(): WizardStepModel<Monster> {
    return {
      model: this.monster,
      activeStepIndex: this.payload.activeStepIndex,
      focus: this.payload.focus,
    };
  }

  private get addMonsterSteps(): WizardStep[] {
    return [
      {
        label: "dandd-monster-wizard.basic.header",
        subLabel: "dandd-monster-wizard.basic.summary",
        component: "DandDMonsterBasics",
      },
      {
        label: "dandd-monster-wizard.combat.header",
        subLabel: "dandd-monster-wizard.combat.summary",
        component: "DandDMonsterCombat",
      },
      {
        label: "dandd-monster-wizard.abilities.header",
        subLabel: "dandd-monster-wizard.abilities.summary",
        component: "DandDMonsterAbilities",
      },
      {
        label: "dandd-monster-wizard.specialTraits.header",
        component: "DandDMonsterSpecialTraits",
      },
      {
        label: "dandd-monster-wizard.actions.header",
        subLabel: "dandd-monster-wizard.actions.summary",
        component: "DandDMonsterActions",
      },
      {
        label: "dandd-monster-wizard.legendary.header",
        component: "DandDMonsterLegendary",
      },
    ];
  }

  private cancel() {
    this.$emit("close");
  }

  private apply() {
    this.payload.model.value = this.monster;
    this.payload.callback(this.payload.model);
    this.$emit("close");
  }
}
</script>

<style lang="scss" scoped>
.dandd-monster-wizard {
  width: 600px;
  height: 600px;
  max-height: 100vh;
  display: flex;
  flex-direction: column;

  .header {
    flex: 0 0 auto;
  }

  .footer {
    display: flex;
    margin-top: 1em;
    gap: 1em;

    > button {
      margin: 0;
      flex-basis: 0;
    }
  }
}
</style>
