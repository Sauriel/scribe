// @ts-ignore
import { TipTapDefaults } from "@/components/app/ui/tiptap/TipTap.vue";
import DocumentModel from "@/models/document";
import ElementModel from "@/modules/ElementModel";

export enum SpellLevel {
  CANTRIP = "cantrip",
  ONE = "one",
  TWO = "two",
  THREE = "three",
  FOUR = "four",
  FIVE = "five",
  SIX = "six",
  SEVEN = "seven",
  EIGHT = "eight",
  NINE = "nine"
}

export enum SpellType {
  ABJURATION = "abjuration",
  CONJURATION = "conjuration",
  DIVINATION = "divination",
  ENCHANTMENT = "enchantment",
  EVOCATION = "evocation",
  ILLUSION = "illusion",
  NECROMANCY = "necromancy",
  TRANSMUTATION = "transmutation"
}

export enum TimeType {
  ACTION = "action",
  BONUS_ACTION = "bonusAction",
  REACTION = "reaction",
  MINUTE = "minute",
  HOUR = "hour",
}

export interface SpellCastingTime {
  value: number;
  type: TimeType;
  addition?: string;
}

export enum DistanceUnit {
  FEET = "feet",
  MILE = "mile",
  METER = "meter",
  KILOMETER = "kilometer"
}

export enum RangeType {
  SELF = "self",
  SIGHT = "sight",
  TOUCH = "touch",
  DISTANCE = "distance",
  SPECIAL = "special",
  UNLIMITED = "unlimited"
}

export enum AOEType  {
  NONE = "none",
  LINE = "line",
  CONE = "cone",
  RADIUS = "radius",
  CUBE = "cube",
  CYLINDER = "cylinder",
  SPHERE = "sphere",
  HEMISPHERE = "hemisphere"
}

export interface Range {
  type: RangeType;
  value: number;
  unit: DistanceUnit;
  areaOfEffect: AOEType;
}

export enum DurationValueType {
  MINUTE = "minute",
  HOUR = "hour",
  DAY = "day",
  ROUND = "round"
}

export enum DurationType {
  INSTANTANEOUS = "instantaneous",
  UNTIL_DISPELLED = "untilDispelled", // Simulacrum (PHB 276)
  UNTIL_DISPELLED_OR_TRIGGERED = "untilDispelledOrTriggered", // Symbol (PHB 280)
  VALUE = "value"
}

export interface SpellDuration {
  type: DurationType;
  concentration: boolean;
  upTo: boolean;
  value: number;
  valueType: DurationValueType;
}

export default interface DandDSpellElementModel extends ElementModel {
  name: string;
  level: SpellLevel;
  type: SpellType;
  ritual: boolean;
  castingTime: SpellCastingTime; // Plant Growth (PHB 266) / Hellish Rebuke (PHB 250)
  range: Range;
  verbalComponent: boolean;
  somaticComponent: boolean;
  materialComponent: boolean;
  materialComponents: string[];
  duration: SpellDuration;
  description: string;
}

export function create(document: DocumentModel): DandDSpellElementModel {
  const isMetric = document.format.unit.suffix === "mm";
  return {
    component: "DandDSpellElement",
    name: "Spell",
    level: SpellLevel.ONE,
    type: SpellType.ABJURATION,
    ritual: false,
    castingTime: {
      value: 1,
      type: TimeType.ACTION
    },
    range: {
      type: RangeType.DISTANCE,
      value: 1,
      unit: isMetric ? DistanceUnit.METER : DistanceUnit.FEET,
      areaOfEffect: AOEType.NONE
    },
    verbalComponent: true,
    somaticComponent: true,
    materialComponent: true,
    materialComponents: [],
    duration: {
      type: DurationType.VALUE,
      concentration: false,
      upTo: false,
      value: 1,
      valueType: DurationValueType.MINUTE
    },
    description: "<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>"
  };
}

export const dndSpellDefaults: TipTapDefaults = {
  font: "Book Insanity",
  size: 9,
  color: "#1d1d1b",
};