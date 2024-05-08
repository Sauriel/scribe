<template>
  <div class="monster-block" :class="{ 'monster-block--full-width' : isFullWidth }">
    <header class="h2">{{ monster.name }}</header>
    <small>{{ subhead }}</small>
    <hr />
    <ul>
      <li>
        <strong>
          Armor Class
        </strong>
        {{ monster.armorClass }}
        {{ monster.armorClassType }}
      </li>
      <li>
        <strong>
          Hit Points
        </strong>
        {{ hitPoints }}
      </li>
      <li v-if="movements">
        <strong>
          Speed
        </strong>
        {{ movements }}
      </li>
    </ul>
    <hr />
    <table>
      <thead>
        <tr>
          <th>STR</th>
          <th>DEX</th>
          <th>CON</th>
          <th>INT</th>
          <th>WIS</th>
          <th>CHA</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ strength }}</td>
          <td>{{ dexterity }}</td>
          <td>{{ constitution }}</td>
          <td>{{ intelligence }}</td>
          <td>{{ wisdom }}</td>
          <td>{{ charisma }}</td>
        </tr>
      </tbody>
    </table>
    <hr />
    <ul>
      <li v-if="monster.savingThrows">
        <strong>
          Saving Throws
        </strong>
        {{ savingThrows }}
      </li>
      <li v-if="monster.skills">
        <strong>
          Skills
        </strong>
        {{ skills }}
      </li>
      <li v-if="monster.damageVulnerability">
        <strong>
          Damage Vulnerabilities
        </strong>
        {{ vulnerabilities }}
      </li>
      <li v-if="monster.damageResistance">
        <strong>
          Damage Resistances
        </strong>
        {{ resistances }}
      </li>
      <li v-if="monster.damageImmunity">
        <strong>
          Damage Immunities
        </strong>
        {{ immunities }}
      </li>
      <li v-if="monster.conditionImmunities">
        <strong>
          Condition Immunities
        </strong>
        {{ conditionImmunities }}
      </li>
      <li v-if="monster.senses">
        <strong>
          Senses
        </strong>
        {{ senses }}
      </li>
      <li>
        <strong>
          Languages
        </strong>
        {{ languages }}
      </li>
      <li>
        <strong>
          Challenge
        </strong>
        {{ monster.challengeRating }}
      </li>
    </ul>
    <hr v-if="hasAbilities" />
    <p v-for="(trait, index) of monster.specialTraits" :key="'trait-' + index">
      <strong>
        {{ trait.name }}.
      </strong>
      <span v-html="trait.description" class="no-line-break" />
    </p>
    <header class="h3" v-if="hasActions">
      Actions
    </header>
    <p v-for="(action, index) of monster.actions" :key="'action-' + index">
      <fragment v-if="action.ability">
        <strong>
          {{ action.ability.name }}.
        </strong>
        <span v-html="action.ability.description" class="no-line-break" />
      </fragment>
      <fragment v-if="action.attack">
        <strong>
          {{ action.attack.name }}.
        </strong>
        <em>
          {{ action.attack.attackType }}:
        </em>
        {{ action.attack.attack }}
        <em>Hit:</em>
        {{ action.attack.damage }}
      </fragment>
    </p>
    <header class="h3" v-if="hasBonusActions">
      Bonus Actions
    </header>
    <p v-for="(bonus, index) of monster.bonusActions" :key="'bonus-' + index">
      <strong>
        {{ bonus.name }}.
      </strong>
      <span v-html="bonus.description" class="no-line-break" />
    </p>
    <header class="h3" v-if="hasReactions">
      Reactions
    </header>
    <p v-for="(reaction, index) of monster.reactions" :key="'reaction-' + index">
      <strong>
        {{ reaction.name }}.
      </strong>
      <span v-html="reaction.description" class="no-line-break" />
    </p>
    <div v-if="monster.isLegendary">
      <header class="h3">
        Legendary Actions
      </header>
      <p v-if="monster.isLegendary" v-html="monster.legendaryDescription" />
      <p v-for="(legendary, index) of monster.legendaryActions" :key="'legendary-' + index">
        <strong>
          {{ legendary.name }}.
        </strong>
        <span v-html="legendary.description" class="no-line-break" />
      </p>
    </div>
    <div v-if="monster.isMythic">
      <header class="h3">
        Mythic Actions
      </header>
      <p v-if="monster.isMythic" v-html="monster.mythicDescription" />
      <p v-for="(mythic, index) of monster.mythicActions" :key="'mythic-' + index">
        <strong>
          {{ mythic.name }}.
        </strong>
        <span v-html="mythic.description" class="no-line-break" />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MonsterBlockElement, { Monster } from '@/models/layout-elements/MonsterBlockElement';
import { LAYOUT_ELEMENT_CACHE } from '@/chaches';
import VerticalLayoutElement from '@/models/layout-elements/VerticalLayoutElement';
import HorizontalLayoutElement from '@/models/layout-elements/HorizontalLayoutElement';

@Component
export default class MonsterBlockLayout extends Vue {
  @Prop(Object)
  readonly element!: MonsterBlockElement;

  private get monster(): Monster {
    return this.element.monster;
  }

  private get isFullWidth(): boolean {
    const parent = LAYOUT_ELEMENT_CACHE.get(this.element.parentLayoutId);
    if (parent) {
      const parentOfParent = LAYOUT_ELEMENT_CACHE.get(parent.parentLayoutId);
      if (parentOfParent && parentOfParent.component === "HorizontalLayout") {
        const horizontalLayout = parentOfParent as HorizontalLayoutElement;
        return horizontalLayout.columns.length === 1;
      }
    }
    return true;
  }

  private get subhead(): string {
    let subhead = this.monster.size.toString();
    subhead += " " + this.monster.type.toString().toLowerCase();
    if (this.monster.subType) {
      subhead += " (" + this.monster.subType.toLowerCase() + ")";
    }
    if (this.monster.alignment) {
       subhead += ", " + this.monster.alignment.toLowerCase()
    }
    return subhead;
  }

  private get hitPoints(): string {
    const hitDices: number = +this.monster.hitDices;
    const hitDiceType: number = +this.monster.hitDiceType;
    const hitDiceModifier: number = +this.monster.hitPointModifier;
    const hitDiceText = " (" + hitDices + "d" + hitDiceType + (hitDiceModifier >= 0 ? " + " : " - ") + Math.abs(hitDiceModifier) + ")";
    const averageHitPointsText = Math.floor(hitDices * ((hitDiceType + 1) / 2)) + hitDiceModifier;
    return averageHitPointsText + hitDiceText;
  }

  private get movements(): string {
    // Fix
    if (this.monster.movements === undefined) {
      this.monster.movements = [];
    }
    if (this.monster.movements.length > 0) {
      return this.monster.movements.map(move => (move.type.toString() + " " + move.value + " " + move.unit.toString()).trim()).join(", ");
    }
    return "";
  }

  private get savingThrows(): string {
    if (this.monster.savingThrows) {
      return this.monster.savingThrows.map(save => save.stat.toString().substring(0, 3) + (save.value >= 0 ? " +" : " -") + save.value).join(", ");
    }
    return "";
  }

  private get skills(): string {
    if (this.monster.skills) {
      return this.monster.skills.map(skill => skill.name + (skill.value >= 0 ? " +" : " -") + skill.value).join(", ");
    }
    return "";
  }

  private get vulnerabilities(): string {
    if (this.monster.damageVulnerability) {
      return this.monster.damageVulnerability.join(", ");
    }
    return "";
  }

  private get resistances(): string {
    if (this.monster.damageResistance) {
      return this.monster.damageResistance.join(", ");
    }
    return "";
  }

  private get immunities(): string {
    if (this.monster.damageImmunity) {
      return this.monster.damageImmunity.join(", ");
    }
    return "";
  }

  private get conditionImmunities(): string {
    if (this.monster.conditionImmunities) {
      return this.monster.conditionImmunities.map(condition => condition.toString().toLowerCase()).join(", ");
    }
    return "";
  }

  private get senses(): string {
    let senses = "";
    if (this.monster.senses) {
      senses += this.monster.senses.join(", ");
    }
    if (this.monster.passivePerception) {
      if (senses !== "") {
        senses += ", ";
      }
      senses += "passive Perception " + this.monster.passivePerception;
    }
    return senses;
  }

  private get languages(): string {
    if (this.monster.languages) {
      return this.monster.languages.join(", ");
    }
    return "—";
  }

  private get strength(): string {
    return this.valueAndMod(this.monster.strength);
  }

  private get dexterity(): string {
    return this.valueAndMod(this.monster.dexterity);
  }

  private get constitution(): string {
    return this.valueAndMod(this.monster.constitution);
  }

  private get intelligence(): string {
    return this.valueAndMod(this.monster.intelligence);
  }

  private get wisdom(): string {
    return this.valueAndMod(this.monster.wisdom);
  }

  private get charisma(): string {
    return this.valueAndMod(this.monster.charisma);
  }

  private valueAndMod(value: number): string {
    const mod = Math.floor((value - 10) / 2);
    return value +  (mod >= 0 ? " (+" : " (") + mod + ")";
  }

  private get hasAbilities(): boolean {
    return this.hasSpecialTraits || this.hasActions || this.hasBonusActions || this.hasReactions;
  }

  private get hasSpecialTraits(): boolean {
    return this.monster.specialTraits.length > 0;
  }

  private get hasActions(): boolean {
    return this.monster.actions.length > 0;
  }

  private get hasBonusActions(): boolean {
    return this.monster.bonusActions.length > 0;
  }

  private get hasReactions(): boolean {
    return this.monster.reactions.length > 0;
  }
}
</script>

<style lang="scss" scoped>
.no-line-break::v-deep > p {
  display: inline;
}
</style>
