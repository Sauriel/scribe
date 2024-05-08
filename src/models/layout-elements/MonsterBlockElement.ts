import LayoutElement from "./LayoutElement";

export enum MonsterType {
  ABERATION = "Aberation",
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
  UNKNOWN = "Unknown"
}

export enum MonsterSize {
  GARGANTUAN = "Gargantuan",
  HUGE = "Huge",
  LARGE = "Large",
  MEDIUM = "Medium",
  SMALL = "Small",
  TINY = "Tiny"
}

export enum DnDAlignment {
  UNALIGNED = "Unaligned",
  LAWFUL_GOOD = "Lawful Good",
  LAWFUL_NEUTRAL = "Lawful Neutral",
  LAWFUL_EVIL = "Lawful Evil",
  NEUTRAL_GOOD = "Neutral Good",
  NEUTRAL_NEUTRAL = "Neutral",
  NEUTRAL_EVIL = "Neutral Evil",
  CHAOTIC_GOOD = "Chaotic Good",
  CHAOTIC_NEUTRAL = "Chaotic Neutral",
  CHAOTIC_EVIL = "Chaotic Evil"
}

export enum DiceType {
  D4 = 4,
  D6 = 6,
  D8 = 8,
  D10 = 10,
  D12 = 12,
  D20 = 20
}

export enum DnDStats {
  STR = "Strength",
  DEX = "Dexterity",
  CON = "Constitution",
  INT = "Intelligence",
  WIS = "Wisdom",
  CHA = "Charisma"
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
  POISONIED = "Poisoned",
  PRONE = "Prone",
  RESTRAINED = "Restrained",
  STUNNED = "Stunned",
  UNCONSCIOUS = "Unconscious"
}

export interface MonsterAction {
  ability?: MonsterAbility;
  attack?: MonsterAttack;
}

export interface MonsterAbility {
  name: string;
  description: string;
}

export interface MonsterAttack {
  name: string;
  attackType: string;
  attack: string;
  damage: string;
}

export interface MonsterSkill {
  name: string;
  value: number;
}

export interface MonsterSaves {
  stat: DnDStats;
  value: number;
}

export enum MonsterMovementType {
  WALK = "",
  SWIM = "swim",
  FLY = "fly",
  CLIMB = "climb",
  BURROW = "burrow"
}

export enum Unit {
  FEET = "ft.",
  METER = "m"
}

export interface MonsterMovement {
  type: MonsterMovementType;
  value: number;
  unit: Unit;
}

export enum DnDChallangeRating {
  ZERO = "0 (0 XP)",
  ZERO_ALT = "0 (10 XP)",
  EIGTHS = "1/8 (25 XP)",
  QUARTER = "1/4 (50 XP)",
  HALF = "1/2 (100 XP)",
  ONE = "1 (200 XP)",
  TWO = "2 (450 XP)",
  THREE = "3 (700 XP)",
  FOUR = "4 (1,100 XP)",
  FIVE = "5 (1,800 XP)",
  SIX = "6 (2,300 XP)",
  SEVEN = "7 (2,900 XP)",
  EIGTH = "8 (3,900 XP)",
  NINE = "9 (5,000 XP)",
  TEN = "10 (5,900 XP)",
  ELEVEN = "11 (7,200 XP)",
  TWELVE = "12 (8,400 XP)",
  THIRTEEN = "13 (10,000 XP)",
  FOURTEEN = "14 (11,500 XP)",
  FIFTEEN = "15 (13,000 XP)",
  SIXTEEN = "16 (15,000 XP)",
  SEVENTEEN = "17 (18,000 XP)",
  EIGTHTEEN = "18 (20,000 XP)",
  NINETEEN = "19 (22,000 XP)",
  TWENTY = "20 (25,000 XP)",
  TWENTY_ONE = "21 (33,000 XP)",
  TWENTY_TWO = "22 (41,000 XP)",
  TWENTY_THREE = "23 (50,000 XP)",
  TWENTY_FOUR = "24 (62,000 XP)",
  TWENTY_FIVE = "25 (75,000 XP)",
  TWENTY_SIX = "26 (90,000 XP)",
  TWENTY_SEVEN = "27 (105,000 XP)",
  TWENTY_EIGHT = "28 (120,000 XP)",
  TWENTY_NINE = "29 (135,000 XP)",
  THIRTY = "30 (155,000 XP)",
}

export interface Monster {
  name: string;
  type: MonsterType;
  subType?: string;
  size: MonsterSize;
  alignment?: DnDAlignment;
  challengeRating: DnDChallangeRating;
  specialTraits: MonsterAbility[];
  actions: MonsterAction[];
  reactions: MonsterAbility[];
  bonusActions: MonsterAbility[];
  isLegendary: boolean;
  legendaryDescription?: string;
  legendaryActions?: MonsterAbility[];
  isMythic: boolean;
  mythicDescription?: string;
  mythicActions?: MonsterAbility[];
  armorClass: number;
  armorClassType: string;
  passivePerception: number;
  hitDices: number;
  hitDiceType: DiceType;
  hitPointModifier: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  savingThrows?: MonsterSaves[];
  damageVulnerability?: string[];
  damageResistance?: string[];
  damageImmunity?: string[];
  conditionImmunities?: StatusConditions[];
  languages?: string[];
  senses?: string[];
  movements: MonsterMovement[];
  skills?: MonsterSkill[];
}

export default interface MonsterBlockElement extends LayoutElement {
  monster: Monster;
}

function newMonster(): Monster {
  return {
    name: "Name",
    type: MonsterType.ABERATION,
    size: MonsterSize.TINY,
    challengeRating: DnDChallangeRating.ZERO,
    armorClass: 0,
    armorClassType: "(natural armor)",
    passivePerception: 10,
    hitDices: 1,
    hitDiceType: DiceType.D4,
    hitPointModifier: 0,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    isLegendary: false,
    isMythic: false,
    specialTraits: [],
    actions: [],
    reactions: [],
    bonusActions: [],
    movements: []
  };
}

export function createDefaultMonsterBlockElement(): MonsterBlockElement {
  return {
    name: "Monster",
    component: "MonsterBlockLayout",
    icon: "paw",
    monster: newMonster(),
    locked: false,
    preview: require("../../assets/settings/dnd5/preview/dnd-5e-preview--monster.jpg")
  };
}
