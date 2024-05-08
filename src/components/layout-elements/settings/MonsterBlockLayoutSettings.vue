<template>
  <div class="scrollable">
    <ul>
      <li>
        Name:
        <text-input v-model="monster.name" :disabled="element.locked" />
      </li>
      <li>
        <dropdown
          :items="size"
          v-model="monster.size"
          :disabled="element.locked"
        />
        <dropdown
          :items="types"
          v-model="monster.type"
          :disabled="element.locked"
        />
        (
        <text-input v-model="monster.subType" :disabled="element.locked" placeholder="sub species (optional)" />
        )
      </li>
      <li>
        <label>
          Alignment:
          <dropdown
            :items="alignment"
            v-model="monster.alignment"
            :disabled="element.locked"
          />
        </label>
        <label>
          CR:
          <dropdown
            :items="challengeRating"
            v-model="monster.challengeRating"
            :disabled="element.locked"
          />
        </label>
      </li>
      <li>
        Armor: 
        <text-input v-model="monster.armorClass" :disabled="element.locked" type="number" class="ac-input margin-after" />
        <text-input v-model="monster.armorClassType" :disabled="element.locked" />
      </li>
      <li>
        Hit Points:
        <text-input v-model="monster.hitDices" :disabled="element.locked" type="number" />
        <dropdown
          :items="hitDiceTypes"
          v-model="monster.hitDiceType"
          :disabled="element.locked"
        />
        <span class="hit-dice-modifier">+</span>
        <text-input v-model="monster.hitPointModifier" :disabled="element.locked" type="number" />
      </li>
      <li>
        <ul class="inner-list">
          <li>
            STR:
            <text-input v-model="monster.strength" :disabled="element.locked" type="number" />
            DEX:
            <text-input v-model="monster.dexterity" :disabled="element.locked" type="number" />
            CON:
            <text-input v-model="monster.constitution" :disabled="element.locked" type="number" />
          </li>
          <li>
            INT:
            <text-input v-model="monster.intelligence" :disabled="element.locked" type="number" />
            WIS:
            <text-input v-model="monster.wisdom" :disabled="element.locked" type="number" />
            CHA:
            <text-input v-model="monster.charisma" :disabled="element.locked" type="number" />
          </li>
        </ul>
      </li>
      <li>
        Passive Perception:
        <text-input v-model="monster.passivePerception" :disabled="element.locked" type="number" />
      </li>
    </ul>

    <accordion :open="false">
      <template v-slot:header>
        <h3>Optional Base Values</h3>
      </template>
      <ul>
        <li class="flex-column">
          Speed:
          <ul class="inner-list">
            <li v-for="(speed, index) of monster.movements" :key="index">
              <dropdown
                class="movement-type"
                :items="movementType"
                v-model="speed.type"
                :disabled="element.locked"
              />
              <text-input v-model="speed.value" :disabled="element.locked" type="number" />
              <dropdown
                :items="unit"
                v-model="speed.unit"
                :disabled="element.locked"
              />
              <btn icon="trash-alt" alert @click="removeMovement(speed, index)" />
            </li>
            <li class="new-row">
              <dropdown
                class="movement-type"
                :items="movementType"
                v-model="newMovement.type"
                :disabled="element.locked"
              />
              <text-input v-model="newMovement.value" :disabled="element.locked" type="number" />
              <dropdown
                :items="unit"
                v-model="newMovement.unit"
                :disabled="element.locked"
              />
              <btn icon="plus" @click="addMovement" />
            </li>
          </ul>
        </li>
        <li class="flex-column">
          Saving Throws:
          <ul class="inner-list">
            <li v-for="(save, index) of monster.savingThrows" :key="index">
              <dropdown
                :items="stats"
                v-model="save.stat"
                :disabled="element.locked"
              />
              <text-input v-model="save.value" :disabled="element.locked" type="number" />
              <btn icon="trash-alt" alert @click="removeSave(save, index)" />
            </li>
            <li class="new-row">
              <dropdown
                :items="stats"
                v-model="newSave.stat"
                :disabled="element.locked"
              />
              <text-input v-model="newSave.value" :disabled="element.locked" type="number" />
              <btn icon="plus" @click="addSave" />
            </li>
          </ul>
        </li>
        <li class="flex-column">
          Skills:
          <ul class="inner-list">
            <li v-for="(skill, index) of monster.skills" :key="index">
              <text-input v-model="skill.name" :disabled="element.locked" placeholder="Skill name" class="margin-after" />
              <text-input v-model="skill.value" :disabled="element.locked" type="number" />
              <btn icon="trash-alt" alert @click="removeSkill(skill, index)" />
            </li>
            <li class="new-row">
              <text-input v-model="newSkill.name" :disabled="element.locked" placeholder="Skill name" class="margin-after" />
              <text-input v-model="newSkill.value" :disabled="element.locked" type="number" />
              <btn icon="plus" @click="addSkill" />
            </li>
          </ul>
        </li>
        <li class="flex-column">
          Damage Vulnerabilities:
          <text-input v-model="damageVulnerability" :disabled="element.locked" placeholder="Damage types (comma seperated)" />
        </li>
        <li class="flex-column">
          Damage Resistance:
          <text-input v-model="damageResistance" :disabled="element.locked" placeholder="Damage types (comma seperated)" />
        </li>
        <li class="flex-column">
          Damage Immunities:
          <text-input v-model="damageImmunity" :disabled="element.locked" placeholder="Damage types (comma seperated)" />
        </li>
        <li class="flex-column">
          Condition Immunities:
          <ul class="inner-list">
            <li v-for="(conditionImmunity, index) of monster.conditionImmunities" :key="index">
              {{ conditionImmunity }}
              <btn icon="trash-alt" alert @click="removeConditionImmunity(conditionImmunity, index)" />
            </li>
            <li class="new-row">
              <dropdown
                :items="conditions"
                v-model="newConditionImmunity"
                :disabled="element.locked"
              />
              <btn icon="plus" @click="addConditionImmunity" />
            </li>
          </ul>
        </li>
        <li class="flex-column">
          Languages:
          <text-input v-model="languages" :disabled="element.locked" placeholder="Languages (comma seperated)" />
        </li>
        <li class="flex-column">
          Senses:
          <text-input v-model="senses" :disabled="element.locked" placeholder="Senses (comma seperated)" />
        </li>
      </ul>
    </accordion>
    <accordion :open="false">
      <template v-slot:header>
        <h3>Traits and Actions</h3>
      </template>
      <ul>
        <li class="flex-column">
          Special Traits:
          <ul class="inner-list">
            <li v-for="(trait, index) of monster.specialTraits" :key="index" class="flex-column">
              <text-input v-model="trait.name" :disabled="element.locked" placeholder="Trait name" class="margin-after bold" />
              <text-editor v-model="trait.description" :disabled="element.locked" :config="textEditorConfig" />
              <btn icon="trash-alt" full-width alert @click="removeTrait(trait, index)" />
            </li>
            <li class="new-row flex-column">
              <text-input v-model="newTrait.name" :disabled="element.locked" placeholder="Trait name" class="margin-after bold" />
              <text-editor v-model="newTrait.description" :disabled="element.locked" :config="textEditorConfig" />
              <btn icon="plus" full-width @click="addTrait" />
            </li>
          </ul>
        </li>
        <li class="flex-column">
          Actions:
          <ul class="inner-list">
            <li v-for="(action, index) of monster.actions" :key="index" class="flex-column">
              <div v-if="action.attack" class="inputs">
                <label>
                  Name:
                  <text-input v-model="action.attack.name" :disabled="element.locked" placeholder="Bite" class="margin-after bold" />
                </label>
                <label>
                  Attack Type:
                  <text-input v-model="action.attack.attackType" :disabled="element.locked" placeholder="Melee Weapon Attack" class="margin-after italic" />
                </label>
                <label>
                  To Hit:
                  <text-input v-model="action.attack.attack" :disabled="element.locked" placeholder="+X to hit, reach 5 ft., one target" class="margin-after" />
                </label>
                <label>
                  On Hit:
                  <text-input v-model="action.attack.damage" :disabled="element.locked" placeholder="3 (1d4+1) piercing damage." class="margin-after" />
                </label>
              </div>
              <div v-else class="inputs">
                <text-input v-model="action.ability.name" :disabled="element.locked" placeholder="Ability name" class="margin-after bold" />
                <text-editor v-model="action.ability.description" :disabled="element.locked" :config="textEditorConfig" />
              </div>
              <btn icon="trash-alt" full-width alert @click="removeAction(action, index)" />
            </li>
            <li class="new-row flex-column">
              <label class="switch-header">
                <span>Ability</span>
                <switch-input v-model="newActionIsAttack" :disabled="element.locked" />
                <span>Attack</span>
              </label>
              <div v-if="newActionIsAttack" class="inputs">
                <label>
                  Name:
                  <text-input v-model="newActionAttack.name" :disabled="element.locked" placeholder="Bite" class="margin-after bold" />
                </label>
                <label>
                  Attack Type:
                  <text-input v-model="newActionAttack.attackType" :disabled="element.locked" placeholder="Melee Weapon Attack" class="margin-after italic" />
                </label>
                <label>
                  To Hit:
                  <text-input v-model="newActionAttack.attack" :disabled="element.locked" placeholder="+X to hit, reach 5 ft., one target" class="margin-after" />
                </label>
                <label>
                  On Hit:
                  <text-input v-model="newActionAttack.damage" :disabled="element.locked" placeholder="3 (1d4+1) piercing damage." class="margin-after" />
                </label>
              </div>
              <div v-else class="inputs">
                <text-input v-model="newActionAbility.name" :disabled="element.locked" placeholder="Ability name" class="margin-after bold" />
                <text-editor v-model="newActionAbility.description" :disabled="element.locked" :config="textEditorConfig" />
              </div>
              <btn icon="plus" full-width @click="addAction" />
            </li>
          </ul>
        </li>
        <li class="flex-column">
          Bonus Actions:
          <ul class="inner-list">
            <li v-for="(bonusAction, index) of monster.bonusActions" :key="index" class="flex-column">
              <text-input v-model="bonusAction.name" :disabled="element.locked" placeholder="Action name" class="margin-after bold" />
              <text-editor v-model="bonusAction.description" :disabled="element.locked" :config="textEditorConfig" />
              <btn icon="trash-alt" full-width alert @click="removeBonusAction(bonusAction, index)" />
            </li>
            <li class="new-row flex-column">
              <text-input v-model="newBonusAction.name" :disabled="element.locked" placeholder="Action name" class="margin-after bold" />
              <text-editor v-model="newBonusAction.description" :disabled="element.locked" :config="textEditorConfig" />
              <btn icon="plus" full-width @click="addBonusAction" />
            </li>
          </ul>
        </li>
        <li class="flex-column">
          Reactions:
          <ul class="inner-list">
            <li v-for="(reaction, index) of monster.reactions" :key="index" class="flex-column">
              <text-input v-model="reaction.name" :disabled="element.locked" placeholder="Reaction name" class="margin-after bold" />
              <text-editor v-model="reaction.description" :disabled="element.locked" :config="textEditorConfig" />
              <btn icon="trash-alt" full-width alert @click="removeReaction(reaction, index)" />
            </li>
            <li class="new-row flex-column">
              <text-input v-model="newReaction.name" :disabled="element.locked" placeholder="Trait name" class="margin-after bold" />
              <text-editor v-model="newReaction.description" :disabled="element.locked" :config="textEditorConfig" />
              <btn icon="plus" full-width @click="addReaction" />
            </li>
          </ul>
        </li>
      </ul>
    </accordion>
    <accordion :open="false">
      <template v-slot:header>
        <h3>Legendary</h3>
      </template>
      <switch-input v-model="monster.isLegendary" :disabled="element.locked">
        Is Legendary
      </switch-input>
      <ul v-if="monster.isLegendary">
        <li class="flex-column">
          Description:
          <text-editor v-model="legendaryDescription" :disabled="element.locked" :config="textEditorConfig" />
        </li>
        <li class="flex-column">
          Legendary Actions:
          <ul class="inner-list">
            <li v-for="(legendaryAction, index) of monster.legendaryActions" :key="index" class="flex-column">
              <text-input v-model="legendaryAction.name" :disabled="element.locked" placeholder="Action name" class="margin-after bold" />
              <text-editor v-model="legendaryAction.description" :disabled="element.locked" :config="textEditorConfig" />
              <btn icon="trash-alt" full-width alert @click="removeLegendaryAction(legendaryAction, index)" />
            </li>
            <li class="new-row flex-column">
              <text-input v-model="newLegendaryAction.name" :disabled="element.locked" placeholder="Action name" class="margin-after bold" />
              <text-editor v-model="newLegendaryAction.description" :disabled="element.locked" :config="textEditorConfig" />
              <btn icon="plus" full-width @click="addLegendaryAction" />
            </li>
          </ul>
        </li>
      </ul>
    </accordion>
    <accordion :open="false">
      <template v-slot:header>
        <h3>Mythic</h3>
      </template>
      <switch-input v-model="monster.isMythic" :disabled="element.locked">
        Is Mythic
      </switch-input>
      <ul v-if="monster.isMythic">
        <li class="flex-column">
          Description:
          <text-editor v-model="mythicDescription" :disabled="element.locked" :config="textEditorConfig" />
        </li>
        <li class="flex-column">
          Mythic Actions:
          <ul class="inner-list">
            <li v-for="(mythicAction, index) of monster.mythicActions" :key="index" class="flex-column">
              <text-input v-model="mythicAction.name" :disabled="element.locked" placeholder="Action name" class="margin-after bold" />
              <text-editor v-model="mythicAction.description" :disabled="element.locked" :config="textEditorConfig" />
              <btn icon="trash-alt" full-width alert @click="removeMythicAction(mythicAction, index)" />
            </li>
            <li class="new-row flex-column">
              <text-input v-model="newMythicAction.name" :disabled="element.locked" placeholder="Action name" class="margin-after bold" />
              <text-editor v-model="newMythicAction.description" :disabled="element.locked" :config="textEditorConfig" />
              <btn icon="plus" full-width @click="addMythicAction" />
            </li>
          </ul>
        </li>
      </ul>
    </accordion>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MonsterBlockElement, { Monster, MonsterType, MonsterSize, DnDAlignment, DnDChallangeRating, DiceType, MonsterMovementType, Unit, MonsterMovement, MonsterSaves, DnDStats, MonsterSkill, StatusConditions, MonsterAbility, MonsterAttack, MonsterAction } from '@/models/layout-elements/MonsterBlockElement';
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown.vue";
import TextEditor, { TextEditorConfig } from '@/components/ui/TextEditor.vue';
import SwitchInput from "@/components/ui/SwitchInput.vue";
import Accordion from "@/components/ui/Accordion.vue";

@Component({ components: { Accordion, Dropdown, TextEditor, SwitchInput }})
export default class MonsterBlockLayoutSettings extends Vue {
  @Prop(Object)
  readonly element!: MonsterBlockElement;

  private get monster(): Monster {
    return this.element.monster;
  }

  private textEditorConfig: TextEditorConfig = {
    history: false,
    alignment: false,
    font: false,
    size: false
  }

  private get types(): DropdownItem[] {
    return Object.values(MonsterType).map((type: MonsterType): DropdownItem => {
      return { name: type.toString(), value: type }
    });
  }

  private get size(): DropdownItem[] {
    return Object.values(MonsterSize).map((size: MonsterSize): DropdownItem => {
      return { name: size.toString(), value: size }
    });
  }

  private get alignment(): DropdownItem[] {
    return Object.values(DnDAlignment).map((alignment: DnDAlignment): DropdownItem => {
      return { name: alignment.toString(), value: alignment }
    });
  }

  private get challengeRating(): DropdownItem[] {
    return Object.values(DnDChallangeRating).map((challengeRating: DnDChallangeRating): DropdownItem => {
      return { name: challengeRating.toString(), value: challengeRating }
    });
  }

  private get hitDiceTypes(): DropdownItem[] {
    return [
      {
        name: "d4",
        value: DiceType.D4
      },
      {
        name: "d6",
        value: DiceType.D6
      },
      {
        name: "d8",
        value: DiceType.D8
      },
      {
        name: "d10",
        value: DiceType.D10
      },
      {
        name: "d12",
        value: DiceType.D12
      },
      {
        name: "d20",
        value: DiceType.D20
      }
    ];
  }

  private newMovement: MonsterMovement = {
    type: MonsterMovementType.WALK,
    value: 5,
    unit: Unit.FEET
  }

  private get movementType(): DropdownItem[] {
    return Object.values(MonsterMovementType).map((movement: MonsterMovementType): DropdownItem => {
      return { name: movement.toString(), value: movement }
    });
  }

  private get unit(): DropdownItem[] {
    return Object.values(Unit).map((unit: Unit): DropdownItem => {
      return { name: unit.toString(), value: unit }
    });
  }

  private removeMovement(movement: MonsterMovement, index: number) {
    if (this.monster.movements) {
      this.monster.movements.splice(index, 1);
    }
  }

  private addMovement() {
    const movment: MonsterMovement = {
      ...this.newMovement
    };
    if (!this.monster.movements) {
      this.monster.movements = [];
    }
    this.monster.movements.push(movment);
    this.newMovement = {
      type: MonsterMovementType.WALK,
      value: 5,
      unit: Unit.FEET
    };
  }

  private newSave: MonsterSaves = {
    stat: DnDStats.STR,
    value: 0
  };

  private get stats(): DropdownItem[] {
    return Object.values(DnDStats).map((stat: DnDStats): DropdownItem => {
      return { name: stat.toString(), value: stat }
    });
  }

  private removeSave(save: MonsterSaves, index: number) {
    if (this.monster.savingThrows) {
      this.monster.savingThrows.splice(index, 1);
      if (this.monster.savingThrows.length === 0) {
        this.monster.savingThrows = undefined;
      }
    }
  }

  private addSave() {
    const save: MonsterSaves = {
      ...this.newSave
    };
    if (!this.monster.savingThrows) {
      this.monster.savingThrows = [];
    }
    this.monster.savingThrows.push(save);
    this.newSave = {
      stat: DnDStats.STR,
      value: 0
    };
  }

  private newSkill: MonsterSkill = {
    name: "",
    value: 0
  };

  private removeSkill(skill: MonsterSkill, index: number) {
    if (this.monster.skills) {
      this.monster.skills.splice(index, 1);
      if (this.monster.skills.length === 0) {
        this.monster.skills = undefined;
      }
    }
  }

  private addSkill() {
    const skill: MonsterSkill = {
      ...this.newSkill
    };
    if (!this.monster.skills) {
      this.monster.skills = [];
    }
    this.monster.skills.push(skill);
    this.newSkill = {
      name: "",
      value: 0
    };
  }

  private get damageVulnerability(): string {
    return this.monster.damageVulnerability ? this.monster.damageVulnerability.join(", ") : "";
  }

  private set damageVulnerability(value: string) {
    if (value !== "") {
      this.monster.damageVulnerability = value.split(",").map(s => s.trim());
    } else {
      this.monster.damageVulnerability = undefined;
    }
  }

  private get damageResistance(): string {
    return this.monster.damageResistance ? this.monster.damageResistance.join(", ") : "";
  }

  private set damageResistance(value: string) {
    if (value !== "") {
      this.monster.damageResistance = value.split(",").map(s => s.trim());
    } else {
      this.monster.damageResistance = undefined;
    }
  }

  private get damageImmunity(): string {
    return this.monster.damageImmunity ? this.monster.damageImmunity.join(", ") : "";
  }

  private set damageImmunity(value: string) {
    if (value !== "") {
      this.monster.damageImmunity = value.split(",").map(s => s.trim());
    } else {
      this.monster.damageImmunity = undefined;
    }
  }

  private get conditions(): DropdownItem[] {
    return Object.values(StatusConditions).map((condition: StatusConditions): DropdownItem => {
      return { name: condition.toString(), value: condition }
    });
  }

  private newConditionImmunity = StatusConditions.BLINDED;

  private removeConditionImmunity(condition: StatusConditions, index: number) {
    if (this.monster.conditionImmunities) {
      this.monster.conditionImmunities.splice(index, 1);
      if (this.monster.conditionImmunities.length === 0) {
        this.monster.conditionImmunities = undefined;
      }
    }
  }

  private addConditionImmunity() {
    if (!this.monster.conditionImmunities) {
      this.monster.conditionImmunities = [];
    }
    this.monster.conditionImmunities.push(this.newConditionImmunity);
    this.newConditionImmunity = StatusConditions.BLINDED;
  }

  private get senses(): string {
    return this.monster.senses ? this.monster.senses.join(", ") : "";
  }

  private set senses(value: string) {
    if (value !== "") {
      this.monster.senses = value.split(",").map(s => s.trim());
    } else {
      this.monster.senses = undefined;
    }
  }

  private get languages(): string {
    return this.monster.languages ? this.monster.languages.join(", ") : "";
  }

  private set languages(value: string) {
    if (value !== "") {
      this.monster.languages = value.split(",").map(s => s.trim());
    } else {
      this.monster.languages = undefined;
    }
  }

  private newTrait: MonsterAbility = {
    name: "",
    description: " "
  }

  private removeTrait(trait: MonsterAbility, index: number) {
    if (this.monster.specialTraits) {
      this.monster.specialTraits.splice(index, 1);
    }
  }

  private addTrait() {
    const trait: MonsterAbility = {
      ...this.newTrait
    };
    this.monster.specialTraits.push(trait);
    this.newTrait = {
      name: "",
      description: " "
    };
  }

  private newReaction: MonsterAbility = {
    name: "",
    description: " "
  }

  private removeReaction(reaction: MonsterAbility, index: number) {
    if (this.monster.reactions) {
      this.monster.reactions.splice(index, 1);
    }
  }

  private addReaction() {
    const reaction: MonsterAbility = {
      ...this.newReaction
    };
    this.monster.reactions.push(reaction);
    this.newReaction = {
      name: "",
      description: " "
    };
  }

  private newBonusAction: MonsterAbility = {
    name: "",
    description: " "
  }

  private removeBonusAction(bonusAction: MonsterAbility, index: number) {
    if (this.monster.bonusActions) {
      this.monster.bonusActions.splice(index, 1);
    }
  }

  private addBonusAction() {
    const bonusAction: MonsterAbility = {
      ...this.newBonusAction
    };
    this.monster.bonusActions.push(bonusAction);
    this.newBonusAction = {
      name: "",
      description: " "
    };
  }

  private newActionIsAttack = false;

  private newActionAbility: MonsterAbility = {
    name: "",
    description: " "
  }

  private newActionAttack: MonsterAttack = {
    name: "",
    attackType: "",
    attack: "",
    damage: ""
  }

  private removeAction(action: MonsterAction, index: number) {
    if (this.monster.actions) {
      this.monster.actions.splice(index, 1);
    }
  }

  private addAction() {
    const action: MonsterAction = {
      ability: !this.newActionIsAttack ? this.newActionAbility : undefined,
      attack: this.newActionIsAttack ? this.newActionAttack : undefined,
    };
    this.monster.actions.push(action);
    this.newActionAbility = {
      name: "",
      description: " "
    };
    this.newActionAttack = {
      name: "",
      attackType: "",
      attack: "",
      damage: ""
    };
  }

  private get legendaryDescription(): string {
    return this.monster.isLegendary && this.monster.legendaryDescription ? this.monster.legendaryDescription : "";
  }

  private set legendaryDescription(value: string) {
    if (this.monster.isLegendary) {
      this.monster.legendaryDescription = value;
    } else {
      this.monster.legendaryDescription = undefined;
    }
  }

  private newLegendaryAction: MonsterAbility = {
    name: "",
    description: " "
  }

  private removeLegendaryAction(legendaryAction: MonsterAbility, index: number) {
    if (this.monster.legendaryActions) {
      this.monster.legendaryActions.splice(index, 1);
      if (this.monster.legendaryActions.length === 0) {
        this.monster.legendaryActions = undefined;
      }
    }
  }

  private addLegendaryAction() {
    const legendaryAction: MonsterAbility = {
      ...this.newLegendaryAction
    };
    if (!this.monster.legendaryActions) {
      this.monster.legendaryActions = [];
    }
    this.monster.legendaryActions.push(legendaryAction);
    this.newLegendaryAction = {
      name: "",
      description: " "
    };
  }

  private get mythicDescription(): string {
    return this.monster.isMythic && this.monster.mythicDescription ? this.monster.mythicDescription : "";
  }

  private set mythicDescription(value: string) {
    if (this.monster.isMythic) {
      this.monster.mythicDescription = value;
    } else {
      this.monster.mythicDescription = undefined;
    }
  }

  private newMythicAction: MonsterAbility = {
    name: "",
    description: " "
  }

  private removeMythicAction(mythicAction: MonsterAbility, index: number) {
    if (this.monster.mythicActions) {
      this.monster.mythicActions.splice(index, 1);
      if (this.monster.mythicActions.length === 0) {
        this.monster.mythicActions = undefined;
      }
    }
  }

  private addMythicAction() {
    const mythicAction: MonsterAbility = {
      ...this.newMythicAction
    };
    if (!this.monster.mythicActions) {
      this.monster.mythicActions = [];
    }
    this.monster.mythicActions.push(mythicAction);
    this.newMythicAction = {
      name: "",
      description: " "
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

.scrollable {
  max-height: calc(100vh - 128px);
  overflow-x: auto;
}

ul {
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    white-space: nowrap;
    padding: 5px 10px;

    &:not(:last-child) {
      margin-bottom: 6px;
    }

    &:nth-child(even) {
      background-color: $backgroundLight;
    }

    &.flex-column {
      flex-direction: column;
    }

    &.new-row {
      position: relative;

      &::before {
        content: "";
        display: block;
        width: calc(100% + 20px);
        position: absolute;
        top: 0px;
        left: -10px;
        border-top: 2px solid $backgroundDark;
      }

      .switch-header {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 10px;

        > label {
          margin: 0 10px;
        }
      }
    }

    .dropdown {
      min-width: auto;

      &:not(:last-child) {
        margin-right: 5px;
      }

      &:not(:first-child) {
        margin-left: 5px;
      }

      &.movement-type {
        min-width: 80px;
      }
    }

    .ac-input {
      width: 60px;
    }

    .margin-after {
      margin-right: 10px;
    }

    .hit-dice-modifier {
      padding: 0 10px;
    }

    .bold {
      font-weight: bold;
    }

    .italic {
      font-style: italic;
    }

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 0;
      flex: 0 0 auto;
    }

    .editor {
      flex: 0 0 auto;
      width: 100%;
    }

    .inputs {
      width: 100%;

      label {
        display: flex;
        align-items: baseline;
      }
    }
  }

  &.inner-list {
    width: 100%;

    li {
      padding: 0;

      &:nth-child(even) {
        background-color: transparent;
      }
    }
  }
}
</style>
