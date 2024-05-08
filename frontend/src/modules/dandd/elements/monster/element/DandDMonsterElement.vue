<template>
  <div :class="scopedClass">
    <custom-css :style="model.customCss" :prefix="scopedClass" />
    <div
      class="monster"
      :class="{
        'monster--two-columns': twoColumns,
        'monster--numbers-fix': numbersFix,
      }"
      @click="$emit('element:selected', model)"
    >
      <div class="basics do-not-break" @click="edit(0)">
        <header class="name" ref="referenceElement">
          {{ name }}
        </header>
        <span>{{ $t("module.dandd.rules.size." + size) }}</span>
        <span>&nbsp;{{ $t("module.dandd.rules.monster.type." + type) }}</span>
        <span v-if="subType">&nbsp;({{ subType }})</span>
        <span v-if="alignment">,&nbsp;{{ $t("module.dandd.rules.alignment." + alignment) }}</span>
      </div>
      <hr class="arrow-line" :style="dividerStyle" />
      <div class="combat-stats do-not-break" @click="edit(1)">
        <div class="row">
          <strong class="header">
            {{ $t("module.dandd.element.monster.combat-stats.ac") }}
          </strong>
          <span> {{ armorClass }}&nbsp;({{ armorClassType }}) </span>
        </div>
        <div class="row">
          <strong class="header">
            {{ $t("module.dandd.element.monster.combat-stats.hp") }}
          </strong>
          <span>
            {{ averageHealth }}&nbsp;({{ hitDices
            }}{{ $t("module.dandd.rules.dice", { eyes: hitDiceType }) }}&nbsp;+&nbsp;{{
              hitPointModifier
            }})
          </span>
        </div>
        <div class="row">
          <strong class="header">
            {{ $t("module.dandd.element.monster.combat-stats.movement") }}
          </strong>
          <span>
            {{ movement }}
          </span>
        </div>
      </div>
      <hr class="arrow-line" :style="dividerStyle" />
      <table class="stats do-not-break">
        <thead>
          <tr>
            <th @click="edit(0, 'STR')">
              {{ $t("module.dandd.rules.stats.strength.short") }}
            </th>
            <th @click="edit(0, 'DEX')">
              {{ $t("module.dandd.rules.stats.dexterity.short") }}
            </th>
            <th @click="edit(0, 'CON')">
              {{ $t("module.dandd.rules.stats.constitution.short") }}
            </th>
            <th @click="edit(0, 'INT')">
              {{ $t("module.dandd.rules.stats.intelligence.short") }}
            </th>
            <th @click="edit(0, 'WIS')">
              {{ $t("module.dandd.rules.stats.wisdom.short") }}
            </th>
            <th @click="edit(0, 'CHA')">
              {{ $t("module.dandd.rules.stats.charisma.short") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td @click="edit(0, 'STR')">{{ strength }}&nbsp;({{ strengthMod }})</td>
            <td @click="edit(0, 'DEX')">{{ dexterity }}&nbsp;({{ dexterityMod }})</td>
            <td @click="edit(0, 'CON')">{{ constitution }}&nbsp;({{ constitutionMod }})</td>
            <td @click="edit(0, 'INT')">{{ intelligence }}&nbsp;({{ intelligenceMod }})</td>
            <td @click="edit(0, 'WIS')">{{ wisdom }}&nbsp;({{ wisdomMod }})</td>
            <td @click="edit(0, 'CHA')">{{ charisma }}&nbsp;({{ charismaMod }})</td>
          </tr>
        </tbody>
      </table>
      <hr class="arrow-line" :style="dividerStyle" />
      <div class="abilities do-not-break" @click="edit(2)">
        <div class="row">
          <strong class="header">
            {{ $t("module.dandd.element.monster.abilities.saves") }}
          </strong>
          <span>
            {{ savingThrows }}
          </span>
        </div>
        <div class="row" v-if="skills">
          <strong class="header">
            {{ $t("module.dandd.element.monster.abilities.skills") }}
          </strong>
          <span>
            {{ skills }}
          </span>
        </div>
        <div class="row" v-if="damageVulnerabilities">
          <strong class="header">
            {{ $t("module.dandd.element.monster.abilities.combat.damage-vulnerabilities") }}
          </strong>
          <span>
            {{ damageVulnerabilities }}
          </span>
        </div>
        <div class="row" v-if="damageResistances">
          <strong class="header">
            {{ $t("module.dandd.element.monster.abilities.combat.damage-resistances") }}
          </strong>
          <span>
            {{ damageResistances }}
          </span>
        </div>
        <div class="row" v-if="damageImmunities">
          <strong class="header">
            {{ $t("module.dandd.element.monster.abilities.combat.damage-immunities") }}
          </strong>
          <span>
            {{ damageImmunities }}
          </span>
        </div>
        <div class="row" v-if="conditionImmunities">
          <strong class="header">
            {{ $t("module.dandd.element.monster.abilities.combat.condition-immunities") }}
          </strong>
          <span>
            {{ conditionImmunities }}
          </span>
        </div>
        <div class="row" v-if="senses">
          <strong class="header">
            {{ $t("module.dandd.element.monster.abilities.senses.label") }}
          </strong>
          <span>
            {{ senses }}
          </span>
        </div>
        <div class="row">
          <strong class="header">
            {{ $t("module.dandd.element.monster.abilities.languages") }}
          </strong>
          <span>
            {{ languages }}
          </span>
        </div>
        <div class="double-row">
          <div class="row">
            <strong class="header">
              {{ $t("module.dandd.element.monster.abilities.cr") }}
            </strong>
            <span>
              {{ challenge }}
            </span>
          </div>
          <div class="row" v-if="passivePerception">
            <strong class="header">
              {{ $t("module.dandd.element.monster.abilities.proficiency-bonus") }}
            </strong>
            <span>
              {{ passivePerception }}
            </span>
          </div>
        </div>
      </div>
      <hr class="arrow-line" :style="dividerStyle" />
      <div class="special-traits do-not-break" @click="edit(3)">
        <div class="ability" v-for="(trait, index) of specialTraits" :key="'st-' + index">
          <strong class="ability-name">{{ trait.name }}</strong>
          <span class="ability-description" v-safe-html="trait.description" />
        </div>
      </div>
      <div class="actions do-not-break" v-if="actions.length > 0" @click="edit(4)">
        <header class="action-header">{{ $t("module.dandd.element.monster.actions") }}</header>
        <div class="actions-list">
          <div class="action" v-for="(action, index) of actions" :key="'ac-' + index">
            <div class="ability" v-if="action.ability">
              <strong class="ability-name">{{ action.ability.name }}</strong>
              <span class="ability-description" v-safe-html="action.ability.description" />
            </div>
            <div class="ability" v-if="action.attack">
              <strong class="ability-name">{{ action.attack.name }}</strong>
              <em class="ability-italic">{{ action.attack.attackType }}:</em>
              <span class="ability-text">{{ action.attack.attack }}</span>
              <em class="ability-italic">{{ $t("module.dandd.rules.hit") }}:</em>
              <span class="ability-text">{{ action.attack.damage }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="actions do-not-break" v-if="bonusActions.length > 0" @click="edit(4)">
        <header class="action-header">{{ $t("module.dandd.element.monster.bonus-actions") }}</header>
        <div class="actions-list">
          <div class="ability" v-for="(bonusAction, index) of bonusActions" :key="'ba-' + index">
            <strong class="ability-name">{{ bonusAction.name }}</strong>
            <span class="ability-description" v-safe-html="bonusAction.description" />
          </div>
        </div>
      </div>
      <div class="actions do-not-break" v-if="reactions.length > 0" @click="edit(4)">
        <header class="action-header">{{ $t("module.dandd.element.monster.reactions") }}</header>
        <div class="actions-list">
          <div class="ability" v-for="(reaction, index) of reactions" :key="'ra-' + index">
            <strong class="ability-name">{{ reaction.name }}</strong>
            <span class="ability-description" v-safe-html="reaction.description" />
          </div>
        </div>
      </div>
      <div class="actions do-not-break" v-if="isLegendary" @click="edit(5)">
        <header class="action-header">
          {{ $t("module.dandd.element.monster.legendary-actions") }}
        </header>
        <div class="legendary-description" v-safe-html="legendaryDescription" />
        <div class="actions-list">
          <div class="ability" v-for="(lAction, index) of legendaryActions" :key="'la-' + index">
            <strong class="ability-name">{{ lAction.name }}</strong>
            <span class="ability-description" v-safe-html="lAction.description" />
          </div>
        </div>
      </div>
      <div class="actions do-not-break" v-if="isMythic" @click="edit(5)">
        <header class="action-header">{{ $t("module.dandd.element.monster.mythic-actions") }}</header>
        <div class="legendary-description" v-safe-html="mythicDescription" />
        <div class="actions-list">
          <div class="ability" v-for="(mAction, index) of mythicActions" :key="'ma-' + index">
            <strong class="ability-name">{{ mAction.name }}</strong>
            <span class="ability-description" v-safe-html="mAction.description" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop, Ref } from "vue-property-decorator";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { LayoutElementModel } from "@/modules/ElementModel";
import DandDMonsterElementModel, {
  Ability,
  Action,
  Monster,
  Movement,
  Saves,
  Skill,
  calculateAverageHealth,
  calculateMod,
  formatCR,
  Stats,
} from "@/modules/dandd/elements/monster/DandDMonsterElementModel";
import VuexHelper from "@/helper/VuexHelper";
import emitter from "@/emitter";
import { DialogUpdateEvent, DIALOG_UPDATE_EVENT_NAME } from "@/events/dialog";
import { cloneDeep } from "lodash";
import {
  DandDMonsterWizardPayload,
  DANDD_MONSTER_WIZARD_TAG,
} from "@/modules/dandd/elements/monster/element/dialog/wizard/DandDMonsterWizardDialogContent.vue";
import { ChangeDandDMonsterAction } from "@/modules/dandd/elements/monster/historyActions";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import DocumentModel from "@/models/document";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import { getCurrentInstance } from "vue";

const documentStorage = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  inject: [HISTORY_MANAGER],
})
export default class DandDMonsterElement extends Vue {
  @Prop({ type: Object, required: true })
  private readonly model!: DandDMonsterElementModel;

  @Prop({ type: Number, required: true })
  private readonly index!: number;

  @Prop({ type: Object, required: true })
  private readonly layout!: LayoutElementModel;

  @Prop({ type: Boolean, default: false })
  private readonly locked!: boolean;

  @Prop({ type: Object, required: true })
  private readonly document!: DocumentModel;

  @Ref()
  private readonly referenceElement!: HTMLElement;

  private width = 100;

  private uid = 0;

  mounted() {
    this.calculateWidth();
  }

  updated() {
    this.calculateWidth();
  }

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private get scopedClass(): string {
    return "dnd-monster--" + this.uid;
  }

  private calculateWidth() {
    this.width = this.referenceElement.getBoundingClientRect().width;
  }

  private get dividerStyle(): Record<string, string> {
    return {
      "border-left-width": this.width + "px",
    };
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get monster(): Monster {
    return this.model.value;
  }

  private get twoColumns(): boolean {
    return this.model.twoColumns;
  }

  private get numbersFix(): boolean {
    return this.model.numbersFix;
  }

  private get name(): string {
    return this.monster.basic.name;
  }

  private get size(): string {
    return this.monster.basic.size;
  }

  private get type(): string {
    return this.monster.basic.type;
  }

  private get subType(): string {
    return this.monster.basic.subType || "";
  }

  private get alignment(): string {
    return this.monster.basic.alignment || "";
  }

  private get armorClass(): number {
    return this.monster.combat.armorClass;
  }

  private get armorClassType(): string {
    return this.monster.combat.armorClassType;
  }

  private get averageHealth(): number {
    return calculateAverageHealth(this.hitDices, this.hitDiceType, this.hitPointModifier);
  }

  private get hitDices(): number {
    return this.monster.combat.hitDices;
  }

  private get hitDiceType(): number {
    return this.monster.combat.hitDiceType;
  }

  private get hitPointModifier(): number {
    return this.monster.combat.hitPointModifier;
  }

  private get movement(): string {
    return this.monster.combat.movements.map(this.formatMovement).join(", ");
  }

  private formatMovement(movement: Movement): string {
    const speed = movement.value + " " + movement.unit;
    const type = this.$t("module.dandd.rules.movement." + movement.type);
    const formatedMovement = type + " " + speed;
    return formatedMovement.trim();
  }

  private get strength(): number {
    return this.monster.stats.strength;
  }

  private get strengthMod(): string {
    return calculateMod(this.strength);
  }

  private get dexterity(): number {
    return this.monster.stats.dexterity;
  }

  private get dexterityMod(): string {
    return calculateMod(this.dexterity);
  }

  private get constitution(): number {
    return this.monster.stats.constitution;
  }

  private get constitutionMod(): string {
    return calculateMod(this.constitution);
  }

  private get intelligence(): number {
    return this.monster.stats.intelligence;
  }

  private get intelligenceMod(): string {
    return calculateMod(this.intelligence);
  }

  private get wisdom(): number {
    return this.monster.stats.wisdom;
  }

  private get wisdomMod(): string {
    return calculateMod(this.wisdom);
  }

  private get charisma(): number {
    return this.monster.stats.charisma;
  }

  private get charismaMod(): string {
    return calculateMod(this.charisma);
  }

  private get savingThrows(): string {
    return this.monster.abilities.savingThrows.map(this.formatSavingThrow).join(", ");
  }

  private formatSavingThrow(save: Saves): string {
    const stat = this.$t("module.dandd.rules.stats." + save.stat.toLowerCase() + ".short");
    return stat + (save.value >= 0 ? " +" : " ") + save.value;
  }

  private get skills(): string {
    return this.monster.abilities.skills.map(this.formatSkill).join(", ");
  }

  private formatSkill(skill: Skill): string {
    return skill.name + (skill.value >= 0 ? " +" : " ") + skill.value;
  }

  private get damageVulnerabilities(): string {
    return this.monster.abilities.combatModifier.damageVulnerability
      .map((wrapper) => wrapper.value)
      .join(", ");
  }

  private get damageResistances(): string {
    return this.monster.abilities.combatModifier.damageResistance
      .map((wrapper) => wrapper.value)
      .join(", ");
  }

  private get damageImmunities(): string {
    return this.monster.abilities.combatModifier.damageImmunity
      .map((wrapper) => wrapper.value)
      .join(", ");
  }

  private get conditionImmunities(): string {
    return this.monster.abilities.combatModifier.conditionImmunities.join(", ");
  }

  private get senses(): string {
    return this.monster.abilities.senses
      .map((wrapper) => wrapper.value)
      .concat(
        this.$t("module.dandd.element.monster.abilities.senses.passive-perception") +
          " " +
          this.monster.abilities.passivePerception
      )
      .join(", ");
  }

  private get languages(): string {
    return this.monster.abilities.languages.map((wrapper) => wrapper.value).join(", ");
  }

  private get challenge(): string {
    const cr = this.monster.abilities.challengeRating;
    return formatCR(cr);
  }

  private get passivePerception(): string | null {
    const proficiencyBonus = this.monster.abilities.proficiencyBonus;
    return proficiencyBonus ? (proficiencyBonus >= 0 ? " +" : " ") + proficiencyBonus : null;
  }

  private get specialTraits(): Ability[] {
    return this.monster.specialTraits;
  }

  private get actions(): Action[] {
    return this.monster.actions.actions;
  }

  private get bonusActions(): Ability[] {
    return this.monster.actions.bonusActions;
  }

  private get reactions(): Ability[] {
    return this.monster.actions.reactions;
  }

  private get isLegendary(): boolean {
    return !!this.monster.legendary;
  }

  private get legendaryDescription(): string {
    return this.monster.legendary ? this.monster.legendary.description : "";
  }

  private get legendaryActions(): Ability[] {
    return this.monster.legendary ? this.monster.legendary.actions : [];
  }

  private get isMythic(): boolean {
    return !!this.monster.mythic;
  }

  private get mythicDescription(): string {
    return this.monster.mythic ? this.monster.mythic.description : "";
  }

  private get mythicActions(): Ability[] {
    return this.monster.mythic ? this.monster.mythic.actions : [];
  }

  private edit(step: number, focus?: string) {
    const event: DialogUpdateEvent<DandDMonsterWizardPayload> = {
      name: DIALOG_UPDATE_EVENT_NAME,
      payload: {
        component: DANDD_MONSTER_WIZARD_TAG,
        visible: true,
        payload: {
          edit: true,
          document: this.document,
          activeStepIndex: step,
          focus: focus,
          model: cloneDeep(this.model),
          callback: (element: DandDMonsterElementModel) => {
            const action = new ChangeDandDMonsterAction(this.model, this.monster, element.value);
            this.history.do(action);
          },
        },
      },
    };
    emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
  }
}
</script>

<style lang="scss" scoped>
@import "@/modules/dandd/fonts.scss";
@import "@/modules/dandd/colors.scss";

.monster {
  position: relative;
  font-family: "Scaly Sans Remake";
  font-size: 9pt;
  padding: 1em;
  background-color: $monsterFawn;
  background-image: url(/images/document/backgrounds/dandd/monster_bg-dandd.png);
  background-size: cover;
  color: $black;
  margin-bottom: 1em;

  &--numbers-fix {
    font-family: "Scaly Sans";
  }

  &--two-columns {
    columns: 2;
    column-gap: 20px;

    .do-not-break {
      break-inside: avoid;
    }
  }

  .do-not-break {
    cursor: pointer;
  }

  &::before,
  &::after {
    content: "";
    display: block;
    height: 3pt;
    position: absolute;
    left: -2pt;
    right: -2pt;
    background-color: $gold;
    background: repeating-linear-gradient(
      10deg,
      $lightGold,
      $lightGold 2px,
      $gold 10px,
      $gold 10px
    );
    background-image: url(/images/document/backgrounds/dandd/monster_border-dandd.jpg);
    border: 1pt solid $black;
  }

  &::before {
    top: -3pt;
  }

  &::after {
    bottom: -3pt;
  }

  .name {
    font-family: "Mr Eaves Small Caps";
    color: $darkRed;
    font-size: 26pt;
    font-weight: bold;
    font-style: normal;
  }

  .basics {
    font-style: italic;
  }

  .arrow-line {
    margin: 0.5em 0;
    border-top: 0.25em solid transparent;
    border-bottom: 0.25em solid transparent;
    border-left: 100px solid $red;
    border-right: 0 solid transparent;
  }

  .combat-stats,
  .stats,
  .abilities,
  .action-header {
    color: $darkRed;
  }

  .stats {
    width: 100%;

    td,
    th {
      text-align: center;
    }

    thead th {
      font-weight: bold;
      text-transform: uppercase;
    }
  }

  .row {
    .header {
      margin-right: 0.25em;
    }
  }

  .double-row {
    display: flex;
    justify-content: space-between;
  }

  .ability {
    margin: 0.5em 0;

    .ability-name,
    .ability-text,
    .ability-italic {
      margin-right: 0.25em;
    }

    .ability-description:deep(p) {
      margin: 0;
      display: inline;
    }
  }

  .special-traits {
    padding: 0.25em 0;
  }

  .actions {
    .action-header {
      font-family: "Scaly Sans Caps";
      border-bottom: 1px solid $darkRed;
      font-size: 11pt;
      margin: 0.2em 0;
    }
  }
}
</style>
