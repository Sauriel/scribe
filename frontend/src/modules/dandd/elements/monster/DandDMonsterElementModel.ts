import emitter from "@/emitter";
import { DialogUpdateEvent, DIALOG_UPDATE_EVENT_NAME } from "@/events/dialog";
import MathHelper from "@/helper/MathHelper";
import { translate } from "@/i18n";
import { StringWrapper } from "@/models";
import DocumentModel from "@/models/document";
import ElementModel, { LayoutElementModel } from "@/modules/ElementModel";
// @ts-ignore
import { AddDanddMonsterPayload, ADD_DANDD_MONSTER_TAG } from "@/modules/dandd/elements/monster/element/dialog/add/AddDandDMonsterDialogContent.vue";
// @ts-ignore
import { TipTapDefaults } from "@/components/app/ui/tiptap/TipTap.vue";
import { cloneDeep } from "lodash";

export enum Type {
  ABERRATION = "Aberration",
  BEAST = "Beast",
  CELESTIAL = "Celestial",
  CONSTRUCT = "Construct",
  DRAGON = "Dragon",
  ELEMENTAL = "Elemental",
  FEY = "Fey",
  FIEND = "Fiend",
  GIANT = "Giant",
  HUMANOID = "Humanoid",
  MONSTROSITY = "Monstrosity",
  OOZE = "Ooze",
  PLANT = "Plant",
  UNDEAD = "Undead",
  UNKNOWN = "Unknown",
}

export enum Size {
  GARGANTUAN = "Gargantuan",
  HUGE = "Huge",
  LARGE = "Large",
  MEDIUM = "Medium",
  SMALL = "Small",
  TINY = "Tiny",
}

export enum Alignment {
  ANY = "Any_Alignment",
  LAWFUL_GOOD = "Lawful_Good",
  NEUTRAL_GOOD = "Neutral_Good",
  CHAOTIC_GOOD = "Chaotic_Good",
  LAWFUL_NEUTRAL = "Lawful_Neutral",
  NEUTRAL_NEUTRAL = "Neutral",
  CHAOTIC_NEUTRAL = "Chaotic_Neutral",
  LAWFUL_EVIL = "Lawful_Evil",
  NEUTRAL_EVIL = "Neutral_Evil",
  CHAOTIC_EVIL = "Chaotic_Evil",
  UNALIGNED = "Unaligned",
  TYPICALLY_LAWFUL_GOOD = "Typically_Lawful_Good",
  TYPICALLY_NEUTRAL_GOOD = "Typically_Neutral_Good",
  TYPICALLY_CHAOTIC_GOOD = "Typically_Chaotic_Good",
  TYPICALLY_LAWFUL_NEUTRAL = "Typically_Lawful_Neutral",
  TYPICALLY_NEUTRAL_NEUTRAL = "Typically_Neutral",
  TYPICALLY_CHAOTIC_NEUTRAL = "Typically_Chaotic_Neutral",
  TYPICALLY_LAWFUL_EVIL = "Typically_Lawful_Evil",
  TYPICALLY_NEUTRAL_EVIL = "Typically_Neutral_Evil",
  TYPICALLY_CHAOTIC_EVIL = "Typically_Chaotic_Evil",
}

export enum DiceType {
  D4 = 4,
  D6 = 6,
  D8 = 8,
  D10 = 10,
  D12 = 12,
  D20 = 20,
}

export enum Stats {
  STR = "Strength",
  DEX = "Dexterity",
  CON = "Constitution",
  INT = "Intelligence",
  WIS = "Wisdom",
  CHA = "Charisma",
}

export enum StatusConditions {
  BLINDED = "Blinded",
  CHARMED = "Charmed",
  DEAFENED = "Deafened",
  EXHAUSTION = "Exhaustion",
  FRIGHTENED = "Frightened",
  GRAPPLED = "Grappled",
  INCAPACITATED = "Incapacitated",
  INVISIBLE = "Invisible",
  PARALYZED = "Paralyzed",
  PETRIFIED = "Petrified",
  POISONED = "Poisoned",
  PRONE = "Prone",
  RESTRAINED = "Restrained",
  STUNNED = "Stunned",
  UNCONSCIOUS = "Unconscious",
}

export interface Action {
  ability?: Ability;
  attack?: Attack;
}

export interface Ability {
  name: string;
  description: string;
}

export interface Attack {
  name: string;
  attackType: string;
  attack: string;
  damage: string;
}

export interface Skill {
  name: string;
  value: number;
}

export interface Saves {
  stat: Stats;
  value: number;
}

export enum MovementType {
  WALK = "walk",
  SWIM = "swim",
  FLY = "fly",
  CLIMB = "climb",
  BURROW = "burrow",
}

export enum Unit {
  FEET = "ft.",
  METER = "m",
}

export interface Movement {
  type: MovementType;
  value: number;
  unit: Unit;
}

export interface ChallengeRating {
  rating: number;
  exp: number;
}

const CR = (rating: number, exp: number): ChallengeRating => ({ rating, exp });

export const ChallengeRatings = {
  ZERO: CR(0, 0),
  ZERO_ALT: CR(0, 10),
  EIGHTS: CR(1 / 8, 25),
  QUARTER: CR(1 / 4, 50),
  HALF: CR(1 / 2, 100),
  ONE: CR(1, 200),
  TWO: CR(2, 450),
  THREE: CR(3, 700),
  FOUR: CR(4, 1100),
  FIVE: CR(5, 1800),
  SIX: CR(6, 2300),
  SEVEN: CR(7, 2900),
  EIGHT: CR(8, 3900),
  NINE: CR(9, 5000),
  TEN: CR(10, 5900),
  ELEVEN: CR(11, 7200),
  TWELVE: CR(12, 8400),
  THIRTEEN: CR(13, 10000),
  FOURTEEN: CR(14, 11500),
  FIFTEEN: CR(15, 13000),
  SIXTEEN: CR(16, 15000),
  SEVENTEEN: CR(17, 18000),
  EIGHTEEN: CR(18, 20000),
  NINETEEN: CR(19, 22000),
  TWENTY: CR(20, 25000),
  TWENTY_ONE: CR(21, 33000),
  TWENTY_TWO: CR(22, 41000),
  TWENTY_THREE: CR(23, 50000),
  TWENTY_FOUR: CR(24, 62000),
  TWENTY_FIVE: CR(25, 75000),
  TWENTY_SIX: CR(26, 90000),
  TWENTY_SEVEN: CR(27, 105000),
  TWENTY_EIGHT: CR(28, 120000),
  TWENTY_NINE: CR(29, 135000),
  THIRTY: CR(30, 155000),
};

export interface LegendaryInfo {
  description: string;
  actions: Ability[];
}

export interface BasicInfo {
  name: string;
  type: Type;
  subType: string | null;
  size: Size;
  alignment: Alignment | null;
}

export interface CombatStats {
  armorClass: number;
  armorClassType: string;
  hitDices: number;
  hitDiceType: DiceType;
  hitPointModifier: number;
  movements: Movement[];
}

export interface StatValues {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CombatModifier {
  damageVulnerability: StringWrapper[];
  damageResistance: StringWrapper[];
  damageImmunity: StringWrapper[];
  conditionImmunities: StatusConditions[];
}

export interface Abilities {
  savingThrows: Saves[];
  skills: Skill[];
  senses: StringWrapper[];
  passivePerception: number;
  combatModifier: CombatModifier;
  languages: StringWrapper[];
  challengeRating: ChallengeRating;
  proficiencyBonus?: number;
}

export interface Actions {
  actions: Action[];
  reactions: Ability[];
  bonusActions: Ability[];
}

export interface Monster {
  basic: BasicInfo;
  combat: CombatStats;
  stats: StatValues;
  abilities: Abilities;
  specialTraits: Ability[];
  actions: Actions;
  legendary: LegendaryInfo | null;
  mythic: LegendaryInfo | null;
}

export const MONSTER_PRESET_NORN: Monster = {
  basic: {
    name: "Norn",
    size: Size.LARGE,
    type: Type.CELESTIAL,
    subType: null,
    alignment: Alignment.CHAOTIC_NEUTRAL,
  },
  combat: {
    armorClass: 18,
    armorClassType: "natural armor",
    hitDiceType: DiceType.D12,
    hitDices: 99,
    hitPointModifier: 356,
    movements: [
      {
        type: MovementType.WALK,
        value: 30,
        unit: Unit.FEET,
      },
    ],
  },
  stats: {
    strength: 10,
    dexterity: 24,
    constitution: 29,
    intelligence: 29,
    wisdom: 29,
    charisma: 29,
  },
  abilities: {
    challengeRating: ChallengeRatings.THIRTY,
    savingThrows: [
      {
        stat: Stats.INT,
        value: 6,
      },
      {
        stat: Stats.WIS,
        value: 7,
      },
      {
        stat: Stats.CHA,
        value: 9,
      },
    ],
    combatModifier: {
      conditionImmunities: [StatusConditions.POISONED, StatusConditions.FRIGHTENED],
      damageImmunity: [{ value: "piercing" }, { value: "bludgeoning and slashing" }],
      damageResistance: [],
      damageVulnerability: [],
    },
    languages: [{ value: "Common" }],
    passivePerception: 19,
    senses: [],
    skills: [],
  },
  specialTraits: [
    {
      name: "Legendary Resistance (9/day)",
      description: "<p>If Norn fails a saving throw, she may choose to make it instead.</p>",
    },
    {
      name: "Spin thread",
      description: "<p>Norn has advantage on Charisma and Dexterity saving throws.</p>",
    },
  ],
  actions: {
    actions: [
      {
        ability: {
          name: "Golden Scissors",
          description:
            "<p>All creatures of Nora's choice within 99m of Nora that are aware of her must make a Wisdom saving throw against DC 19 to avoid being frightened for 1 minute.</p><p>A creature can reroll the saving throw at the end of each of its turns, ending the effect on itself if successful. It suffers disadvantage on the saving throw if Norn is still in sight. If the saving throw succeeds or the effect ends, then the creature is immune to golden scissors for the next 24 hours.</p>",
        },
      },
      {
        ability: {
          name: "Ponder",
          description:
            "<p>Norn can innately cast the Friendship spell, with no components required. The attribute for casting innate spells is Wisdom for her.</p>",
        },
      },
      {
        attack: {
          name: "Claws",
          attackType: "Melee Weapon Attack",
          attack: "+19 to hit, range 30 ft., one target",
          damage: "99 (10d12+34) slashing damage",
        },
      },
    ],
    bonusActions: [],
    reactions: [],
  },
  legendary: {
    description:
      "<p>Nora can perform 9 legendary actions and choose from the following options. She can only use one legendary action option at a time, and only at the end of another character's turn. Nora regains spent legendary actions at the beginning of her turn.</p>",
    actions: [
      {
        name: "Past",
        description:
          "<p>Norn looks back to the days when it was difficult to create his character.</p>",
      },
      {
        name: "Present",
        description: "<p>Norn lingers thoughtfully.</p>",
      },
      {
        name: "Future",
        description: "<p>Nora is looking forward to working with you on your project.</p>",
      },
    ],
  },
  mythic: null,
};

export const MONSTER_PRESET_DEFAULT: Monster = {
  basic: {
    name: "NAME",
    size: Size.MEDIUM,
    type: Type.HUMANOID,
    subType: null,
    alignment: Alignment.ANY,
  },
  combat: {
    armorClass: 10,
    armorClassType: "natural armor",
    hitDiceType: DiceType.D4,
    hitDices: 1,
    hitPointModifier: 0,
    movements: [],
  },
  stats: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  abilities: {
    challengeRating: ChallengeRatings.ZERO,
    savingThrows: [],
    combatModifier: {
      conditionImmunities: [],
      damageImmunity: [],
      damageResistance: [],
      damageVulnerability: [],
    },
    languages: [],
    passivePerception: 10,
    senses: [],
    skills: [],
  },
  specialTraits: [],
  actions: {
    actions: [],
    bonusActions: [],
    reactions: [],
  },
  legendary: null,
  mythic: null,
};

export default interface DandDMonsterElementModel extends ElementModel {
  value: Monster;
  twoColumns: boolean;
  numbersFix: boolean;
}

export function create(
  document: DocumentModel,
  monster: Monster = MONSTER_PRESET_DEFAULT,
  layout?: LayoutElementModel
): DandDMonsterElementModel {
  // @ts-ignore
  const twoColumns = layout ? !layout.width : false;
  return {
    component: "DandDMonsterElement",
    value: cloneDeep(monster),
    twoColumns: twoColumns,
    numbersFix: false,
  };
}

export function callbackCreate(
  document: DocumentModel,
  callback: (model: DandDMonsterElementModel) => void,
  layout?: LayoutElementModel
) {
  const event: DialogUpdateEvent<AddDanddMonsterPayload> = {
    name: DIALOG_UPDATE_EVENT_NAME,
    payload: {
      component: ADD_DANDD_MONSTER_TAG,
      visible: true,
      payload: {
        document: document,
        callback: callback,
        layout: layout,
      },
    },
  };
  emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
}

export function calculateAverageHealth(
  numberOfHitDices: number,
  diceType: DiceType,
  hitPointModifier: number
): number {
  return Math.floor(numberOfHitDices * ((diceType + 1) / 2)) + hitPointModifier; // ToDo: Check if this is correct
}

export function calculateModNumber(value: number): number {
  return Math.floor((value - 10) / 2);
}

export function calculateMod(value: number): string {
  const mod = calculateModNumber(value);
  return (mod >= 0 ? "+" : "") + mod;
}

export function formatCR(cr: ChallengeRating): string {
  return (
    MathHelper.asFraction(cr.rating) +
    " (" +
    cr.exp.toLocaleString() +
    " " +
    translate("module.dandd.rules.exp.short") +
    ")"
  );
}

export const dndMonsterDefaults: TipTapDefaults = {
  font: "Scaly Sans Remake",
  size: 9,
  color: "#1d1d1b",
};
