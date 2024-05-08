<template>
  <div class="settings">
    <section class="section">
      <header class="header">{{ $t("dandd-monster-wizard.abilities.challengeRating") }}</header>
      <dropdown v-model="challengeRating" :items="challengeRatings" />
    </section>
    <section class="section">
      <header class="header">{{ $t("dandd-monster-wizard.abilities.savingThrows") }}</header>
      <combobox
        :items="abilities.savingThrows"
        @chip:delete="deleteSavingThrow"
        @chip:add="addSavingThrow"
      >
        <template #item="{ item }">
          <span class="stat-name" v-if="!loading">
            {{ $t("module.dandd.rules.stats." + item.stat.toLowerCase() + ".short") }}
          </span>
          <span class="modifier" v-if="!loading">
            {{ item.value >= 0 ? "+" : "" }}{{ item.value }}
          </span>
        </template>
        <template #item-edit="{ index, item, save }">
          <dropdown v-model="item.stat" :items="stats" @update:modelValue="rerender" />
          <input-field
            type="number"
            class="wide-input"
            v-model="item.value"
            @update:modelValue="rerender"
            @enter="save(item, index)"
          />
        </template>
        <template #item-add="{ save }">
          <dropdown v-model="newSave.stat" :items="stats" />
          <input-field type="number" class="wide-input" v-model="newSave.value" @enter="save" />
        </template>
      </combobox>
    </section>
    <section class="section">
      <header class="header">{{ $t("dandd-monster-wizard.abilities.skills") }}</header>
      <combobox :items="abilities.skills" @chip:delete="deleteSkill" @chip:add="addSkill">
        <template #item="{ item }">
          <span class="stat-name" v-if="!loading">
            {{ item.name }}
          </span>
          <span class="modifier" v-if="!loading">
            {{ item.value >= 0 ? "+" : "" }}{{ item.value }}
          </span>
        </template>
        <template #item-edit="{ index, item, save }">
          <input-field
            class="extra-wide-input"
            v-model="item.name"
            @update:modelValue="rerender"
            @enter="save(item, index)"
          />
          <input-field
            type="number"
            class="wide-input"
            v-model="item.value"
            @update:modelValue="rerender"
            @enter="save(item, index)"
          />
        </template>
        <template #item-add="{ save }">
          <input-field class="extra-wide-input" v-model="newSkill.name" @enter="save" />
          <input-field type="number" class="wide-input" v-model="newSkill.value" @enter="save" />
        </template>
      </combobox>
    </section>
    <section class="section">
      <header class="header">{{ $t("dandd-monster-wizard.abilities.senses") }}</header>
      <combobox :items="abilities.senses" @chip:delete="deleteSense" @chip:add="addSense">
        <template #item="{ item }">
          <span v-if="!loading">
            {{ item.value }}
          </span>
        </template>
        <template #item-edit="{ index, item, save }">
          <input-field
            class="extra-wide-input"
            v-model="item.value"
            @update:modelValue="rerender"
            @enter="save(item, index)"
          />
        </template>
        <template #item-add="{ save }">
          <input-field class="extra-wide-input" v-model="newSense.value" @enter="save" />
        </template>
      </combobox>
    </section>
    <section class="section">
      <header class="header">{{ $t("dandd-monster-wizard.abilities.passivePerception") }}</header>
      <input-field type="number" class="small-input" v-model="abilities.passivePerception" />
      <span class="information">
        <strong>{{ $t("dandd-monster-wizard.abilities.default") }}: </strong>
        <span
          >10 + {{ $t("module.dandd.rules.stats.wisdom.short") }}
          {{ $t("module.dandd.rules.stats.modifier") }} ({{ wisMod }}) =
          {{ defaultPassivePerception }}</span
        >
      </span>
    </section>
    <section class="section">
      <header class="header">
        {{ $t("dandd-monster-wizard.abilities.combatModifier.damageVulnerability") }}
      </header>
      <combobox
        :items="abilities.combatModifier.damageVulnerability"
        @chip:delete="deleteDamageVulnerability"
        @chip:add="addDamageVulnerability"
      >
        <template #item="{ item }">
          <span v-if="!loading">
            {{ item.value }}
          </span>
        </template>
        <template #item-edit="{ index, item, save }">
          <input-field
            class="extra-wide-input"
            v-model="item.value"
            @update:modelValue="rerender"
            @enter="save(item, index)"
          />
        </template>
        <template #item-add="{ save }">
          <input-field
            class="extra-wide-input"
            v-model="newDamageVulnerability.value"
            @enter="save"
          />
        </template>
      </combobox>
    </section>
    <section class="section">
      <header class="header">
        {{ $t("dandd-monster-wizard.abilities.combatModifier.damageResistance") }}
      </header>
      <combobox
        :items="abilities.combatModifier.damageResistance"
        @chip:delete="deleteDamageResistance"
        @chip:add="addDamageResistance"
      >
        <template #item="{ item }">
          <span v-if="!loading">
            {{ item.value }}
          </span>
        </template>
        <template #item-edit="{ index, item, save }">
          <input-field
            class="extra-wide-input"
            v-model="item.value"
            @update:modelValue="rerender"
            @enter="save(item, index)"
          />
        </template>
        <template #item-add="{ save }">
          <input-field class="extra-wide-input" v-model="newDamageResistance.value" @enter="save" />
        </template>
      </combobox>
    </section>
    <section class="section">
      <header class="header">
        {{ $t("dandd-monster-wizard.abilities.combatModifier.damageImmunity") }}
      </header>
      <combobox
        :items="abilities.combatModifier.damageImmunity"
        @chip:delete="deleteDamageImmunity"
        @chip:add="addDamageImmunity"
      >
        <template #item="{ item }">
          <span v-if="!loading">
            {{ item.value }}
          </span>
        </template>
        <template #item-edit="{ index, item, save }">
          <input-field
            class="extra-wide-input"
            v-model="item.value"
            @update:modelValue="rerender"
            @enter="save(item, index)"
          />
        </template>
        <template #item-add="{ save }">
          <input-field class="extra-wide-input" v-model="newDamageImmunity.value" @enter="save" />
        </template>
      </combobox>
    </section>
    <section class="section">
      <header class="header">
        {{ $t("dandd-monster-wizard.abilities.combatModifier.conditionImmunities") }}
      </header>
      <combobox
        :items="conditionImmunities"
        @chip:delete="deleteConditionImmunities"
        @chip:add="addConditionImmunities"
        @chip:edit="editConditionImmunities"
      >
        <template #item="{ item }">
          <span v-if="!loading">
            {{ $t("module.dandd.rules.status." + item.value) }}
          </span>
        </template>
        <template #item-edit="{ item }">
          <dropdown v-model="item.value" :items="statusConditions" @update:modelValue="rerender" />
        </template>
        <template #item-add>
          <dropdown
            v-model="newConditionImmunities"
            :items="statusConditions"
            @update:modelValue="rerender"
          />
        </template>
      </combobox>
    </section>
    <section class="section">
      <header class="header">{{ $t("dandd-monster-wizard.abilities.languages") }}</header>
      <combobox :items="abilities.languages" @chip:delete="deleteLanguage" @chip:add="addLanguage">
        <template #item="{ item }">
          <span v-if="!loading">
            {{ item.value }}
          </span>
        </template>
        <template #item-edit="{ index, item, save }">
          <input-field
            class="extra-wide-input"
            v-model="item.value"
            @update:modelValue="rerender"
            @enter="save(item, index)"
          />
        </template>
        <template #item-add="{ save }">
          <input-field class="extra-wide-input" v-model="newLanguage.value" @enter="save" />
        </template>
      </combobox>
    </section>
    <section class="section">
      <header class="header">
        {{ $t("dandd-monster-wizard.abilities.proficiency-bonus.label") }}
      </header>
      <div class="proficiency-bonus">
        <input-field type="number" v-model="proficiencyBonus" />
        <input-switch v-model="showProficiencyBonus">
          {{ $t("dandd-monster-wizard.abilities.proficiency-bonus.show") }}
        </input-switch>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { ComboboxEvent } from "@/components/app/ui/combobox/Combobox.vue";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import { WizardStepModel } from "@/components/app/ui/wizard/Wizard.vue";
import { EnumWrapper, StringWrapper } from "@/models";
import { cloneDeep } from "lodash";
import { Options, Vue, Prop } from "vue-property-decorator";
import {
  Monster,
  Abilities,
  Stats,
  Saves,
  Skill,
  calculateModNumber,
  calculateMod,
  StatusConditions,
  ChallengeRatings,
  formatCR,
} from "@/modules/dandd/elements/monster/DandDMonsterElementModel";

@Options({
  emits: ["step:reload"],
})
export default class DandDMonsterAbilities extends Vue {
  @Prop({ type: Object, required: true })
  private readonly model!: WizardStepModel<Monster>;

  private loading = false;

  private reload() {
    this.$emit("step:reload");
  }

  private rerender() {
    // This is a hack, so that a few things can rerender
    this.loading = true;
    this.$nextTick(() => {
      this.loading = false;
    });
  }

  private get abilities(): Abilities {
    return this.model.model.abilities;
  }

  private get stats(): DropdownItem[] {
    return Object.values(Stats).map((stat) => ({
      name: this.$t("module.dandd.rules.stats." + stat.toLowerCase() + ".short"),
      value: stat,
    }));
  }

  private newSave: Saves = {
    stat: Stats.STR,
    value: 0,
  };

  private deleteSavingThrow(event: ComboboxEvent<Saves>) {
    this.abilities.savingThrows.splice(event.index, 1);
    this.rerender();
  }

  private addSavingThrow() {
    const newSave = cloneDeep(this.newSave);
    this.abilities.savingThrows.push(newSave);
    this.newSave.stat = Stats.STR;
    this.newSave.value = 0;
    this.rerender();
  }

  private newSkill: Skill = {
    name: "",
    value: 0,
  };

  private deleteSkill(event: ComboboxEvent<Skill>) {
    this.abilities.skills.splice(event.index, 1);
    this.rerender();
  }

  private addSkill() {
    const newSkill = cloneDeep(this.newSkill);
    this.abilities.skills.push(newSkill);
    this.newSkill.name = "";
    this.newSkill.value = 0;
    this.rerender();
  }

  private newSense: StringWrapper = {
    value: "",
  };

  private deleteSense(event: ComboboxEvent<StringWrapper>) {
    this.abilities.senses.splice(event.index, 1);
    this.rerender();
  }

  private addSense() {
    const newSense = cloneDeep(this.newSense);
    this.abilities.senses.push(newSense);
    this.newSense.value = "";
    this.rerender();
  }

  private get wisMod(): string {
    return calculateMod(this.model.model.stats.wisdom);
  }

  private get defaultPassivePerception(): number {
    return 10 + calculateModNumber(this.model.model.stats.wisdom);
  }

  private newDamageVulnerability: StringWrapper = {
    value: "",
  };

  private deleteDamageVulnerability(event: ComboboxEvent<StringWrapper>) {
    this.abilities.combatModifier.damageVulnerability.splice(event.index, 1);
    this.rerender();
  }

  private addDamageVulnerability() {
    const newDamageVulnerability = cloneDeep(this.newDamageVulnerability);
    this.abilities.combatModifier.damageVulnerability.push(newDamageVulnerability);
    this.newDamageVulnerability.value = "";
    this.rerender();
  }

  private newDamageResistance: StringWrapper = {
    value: "",
  };

  private deleteDamageResistance(event: ComboboxEvent<StringWrapper>) {
    this.abilities.combatModifier.damageResistance.splice(event.index, 1);
    this.rerender();
  }

  private addDamageResistance() {
    const newDamageResistance = cloneDeep(this.newDamageResistance);
    this.abilities.combatModifier.damageResistance.push(newDamageResistance);
    this.newDamageResistance.value = "";
    this.rerender();
  }

  private newDamageImmunity: StringWrapper = {
    value: "",
  };

  private deleteDamageImmunity(event: ComboboxEvent<StringWrapper>) {
    this.abilities.combatModifier.damageImmunity.splice(event.index, 1);
    this.rerender();
  }

  private addDamageImmunity() {
    const newDamageImmunity = cloneDeep(this.newDamageImmunity);
    this.abilities.combatModifier.damageImmunity.push(newDamageImmunity);
    this.newDamageImmunity.value = "";
    this.rerender();
  }

  private get statusConditions(): DropdownItem[] {
    return Object.values(StatusConditions).map((stat) => ({
      name: this.$t("module.dandd.rules.status." + stat),
      value: stat,
    }));
  }

  private get conditionImmunities(): EnumWrapper<StatusConditions>[] {
    return this.abilities.combatModifier.conditionImmunities.map((condition) => ({
      value: condition,
    }));
  }

  private newConditionImmunities = StatusConditions.BLINDED;

  private deleteConditionImmunities(event: ComboboxEvent<EnumWrapper<StatusConditions>>) {
    this.abilities.combatModifier.conditionImmunities.splice(event.index, 1);
    this.rerender();
  }

  private addConditionImmunities() {
    this.abilities.combatModifier.conditionImmunities.push(this.newConditionImmunities);
    this.newConditionImmunities = StatusConditions.BLINDED;
    this.rerender();
  }

  private editConditionImmunities(event: ComboboxEvent<EnumWrapper<StatusConditions>>) {
    this.abilities.combatModifier.conditionImmunities[event.index] = event.item.value;
  }

  private newLanguage: StringWrapper = {
    value: "",
  };

  private deleteLanguage(event: ComboboxEvent<StringWrapper>) {
    this.abilities.languages.splice(event.index, 1);
    this.rerender();
  }

  private addLanguage() {
    const newLanguage = cloneDeep(this.newLanguage);
    this.abilities.languages.push(newLanguage);
    this.newLanguage.value = "";
    this.rerender();
  }

  private get challengeRatings(): DropdownItem[] {
    return Object.entries(ChallengeRatings).map((cr) => ({
      name: formatCR(cr[1]),
      value: cr[0],
    }));
  }

  private get challengeRating(): string {
    const cr = Object.entries(ChallengeRatings).find(
      (cr) => cr[1] === this.abilities.challengeRating
    );
    return cr ? cr[0] : "ZERO";
  }

  private set challengeRating(value: string) {
    const cr = Object.entries(ChallengeRatings).find((cr) => cr[0] === value);
    this.abilities.challengeRating = cr ? cr[1] : ChallengeRatings.ZERO;
    this.reload();
  }

  private get proficiencyBonus(): number {
    return this.abilities.proficiencyBonus || 0;
  }

  private set proficiencyBonus(value: number) {
    this.abilities.proficiencyBonus = value;
  }

  private get showProficiencyBonus(): boolean {
    return this.abilities.proficiencyBonus !== undefined;
  }

  private set showProficiencyBonus(value: boolean) {
    if (value) {
      this.abilities.proficiencyBonus = 0;
    } else {
      this.abilities.proficiencyBonus = undefined;
    }
  }
}
</script>

<style lang="scss" scoped>
.settings {
  padding-bottom: 1em;
  .section {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;

    & > *:not(.header) {
      flex: 1 1 auto;
    }

    .header {
      flex: 0 0 auto;
      width: 120px;
      padding-top: 0.25rem;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .combobox {
      margin-right: 6em;
    }
  }
}

.stat-name {
  margin-right: 0.25em;
}

.small-input {
  width: 3em;
}

.wide-input {
  min-width: 3em;
}

.extra-wide-input {
  min-width: 9em;
}

.information {
  font-size: 0.85em;
  color: var(--color-foreground--dark);
  white-space: nowrap;
  align-self: center;
  margin-bottom: 0.5em;
}

.proficiency-bonus {
  display: flex;
  align-items: center;
  gap: 1em;
}
</style>
