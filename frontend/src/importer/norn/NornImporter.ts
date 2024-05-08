import VerticalSpacingElementModel from "@/modules/default/elements/spacing/VerticalSpacingElementModel";
import DandDTableElementModel, {
  DandDTableType,
} from "@/modules/dandd/elements/table/DandDTableElementModel";
import VerticalLayoutElementModel from "@/modules/default/elements/vertical/VerticalLayoutElementModel";
import DocumentModel, { PageDefaults, PageModel } from "@/models/document";
import BackgroundImage, { Position } from "@/models/document/images";
import { PageFormat, PAGE_FORMATS, Units } from "@/models/document/pageFormat";
import { SettingName } from "@/models/setting";
import ElementModel from "@/modules/ElementModel";
import AppDocument from "@/importer/norn/models/AppDocument";
import {
  PageFormat as NornPageFormat,
  PAGE_FORMATS as NORN_PAGE_FORMATS,
} from "@/importer/norn/models/AppDocumentSettings";
import AppPage from "@/importer/norn/models/AppPage";
import NornBackgroundImage from "@/importer/norn/models/BackgroundImage";
import HeadingElement, { HeadingType } from "@/importer/norn/models/layout-elements/HeadingElement";
import HorizontalLayoutElement, { Column } from "@/importer/norn/models/layout-elements/HorizontalLayoutElement";
import LayoutElement from "@/importer/norn/models/layout-elements/LayoutElement";
import MonsterBlockElement, {
  MonsterSize,
  MonsterType,
  DiceType as NornDiceType,
  DnDChallangeRating,
  StatusConditions as NornStatusConditions,
  Unit as NornUnit,
  MonsterAbility,
  DnDAlignment,
  MonsterAction,
  MonsterMovement,
  MonsterSaves,
  MonsterSkill,
  MonsterAttack,
} from "@/importer/norn/models/layout-elements/MonsterBlockElement";
import NoteElement, { NoteType } from "@/importer/norn/models/layout-elements/NoteElement";
import ParagraphElement from "@/importer/norn/models/layout-elements/ParagraphElement";
import SpacerElement from "@/importer/norn/models/layout-elements/SpacerElement";
import TableElement, {
  TableType,
  Table as NornTable,
  TableColAlign,
} from "@/importer/norn/models/layout-elements/TableElement";
import VerticalLayoutElement from "@/importer/norn/models/layout-elements/VerticalLayoutElement";
import DandDParagraphElementModel from "@/modules/dandd/elements/paragraph/DandDParagraphElementModel";
import DandDNoteElementModel, {
  DandDNoteType,
} from "@/modules/dandd/elements/note/DandDNoteElementModel";
import DandDMonsterElementModel, {
  Ability,
  Action,
  Alignment,
  Attack,
  ChallengeRating,
  ChallengeRatings,
  DiceType,
  LegendaryInfo,
  Monster,
  Movement,
  MovementType,
  Saves,
  Size,
  Skill,
  Stats,
  StatusConditions,
  Type,
  Unit,
} from "@/modules/dandd/elements/monster/DandDMonsterElementModel";
import HorizontalLayoutElementModel, {
  HorizontalLayoutElementColumnModel,
} from "@/modules/default/elements/horizontal/HorizontalLayoutElementModel";
import DandDHeadingElementModel, {
  HeadingLevel,
} from "@/modules/dandd/elements/heading/DandDHeadingElementModel";
import { isEmpty } from "lodash";
import { Table, TableColumn, TableRow, TableCell } from "@/models/document/table";
import { StringWrapper, TextAlign } from "@/models";
export default class NornImporter {
  constructor(private readonly nornDocument: AppDocument) {}

  public convert(): DocumentModel {
    return {
      name: "Imported Norn document",
      version: 1,
      defaults: this.convertDefaults(),
      format: this.convertFormat(this.nornDocument.settings.pageSize),
      pages: this.convertPages(this.nornDocument.pages),
    };
  }

  private convertDefaults(): PageDefaults {
    return {
      setting: SettingName.DUNGEONS_AND_DRAGONS,
      background: "dandd-1",
      footer: {
        image: {
          url: "/images/document/backgrounds/dandd/footer-dandd.png",
        },
        text: 'Made with <a href="https://scribe.sauriel.net" target="_blank">Scribe – Tabletop Publisher</a>',
        paging: {
          show: true,
          alternate: true,
          position: "right",
        },
      },
    };
  }

  private convertFormat(format: NornPageFormat): PageFormat {
    if (format.name === NORN_PAGE_FORMATS.DIN_A4.name) {
      return PAGE_FORMATS.DIN_A4;
    } else if (format.name === NORN_PAGE_FORMATS.US_LETTER.name) {
      return PAGE_FORMATS.US_LETTER;
    } else {
      return {
        ...PAGE_FORMATS.CUSTOM,
        width: format.width,
        height: format.height,
        unit: format.unit === "mm" ? Units.MILLIMETER : Units.INCH,
      };
    }
  }

  private convertPages(pages: AppPage[]): PageModel[] {
    return pages.map(this.convertPage.bind(this));
  }

  private convertPage(page: AppPage): PageModel {
    return {
      backgroundImages: this.convertBackgroundImages(page.backgroundImages),
      elements: page.layout.rows.map(this.convertElement.bind(this)),
    };
  }

  private convertBackgroundImages(images: NornBackgroundImage[]): BackgroundImage[] {
    return images
      .map(this.convertBackgroundImage.bind(this))
      .filter((image) => !isEmpty(image) && !isEmpty(image?.imageSrc.url)) as BackgroundImage[];
  }

  private convertBackgroundImage(image: NornBackgroundImage): BackgroundImage | undefined {
    const isData = image.image.src.startsWith("data:image/");
    if (!isData) {
      return {
        imageSrc: {
          url: !isData ? image.image.src : undefined,
          //data: isData ? image.image.src : undefined,
        },
        maskId: this.convertMask(image.mask),
        height: image.image.height,
        width: image.image.width,
        name: "Imported image",
        position: this.getImagePosition(image),
      };
    } else {
      return undefined;
    }
  }

  private getImagePosition(image: NornBackgroundImage): Position {
    const pageWidth =
      this.nornDocument.settings.pageSize.width * this.nornDocument.settings.pageSize.pixelPerUnit;
    const pageHeight =
      this.nornDocument.settings.pageSize.height * this.nornDocument.settings.pageSize.pixelPerUnit;
    const horizontalPercentile = image.horizontalPosition * 0.01;
    const verticalPercentile = image.verticalPosition * 0.01;
    const horizontalCenterPosition = (pageWidth - image.image.width) / 2;
    const verticalCenterPosition = (pageHeight - image.image.height) / 2;
    const horizontalMargin =
      pageWidth >= image.image.width
        ? pageWidth + horizontalCenterPosition
        : image.image.width + horizontalCenterPosition;
    const verticalMargin =
      pageHeight >= image.image.height
        ? pageHeight + verticalCenterPosition
        : image.image.height + verticalCenterPosition;
    const horizontalPosition = horizontalCenterPosition + horizontalMargin * horizontalPercentile;
    const verticalPosition = verticalCenterPosition + verticalMargin * verticalPercentile;
    return {
      x: horizontalPosition,
      y: verticalPosition,
    };
  }

  private convertMask(mask: string): string {
    if (mask === "stains stains--top") {
      return "dandd-1";
    } else if (mask === "stains stains--top-right") {
      return "dandd-5";
    } else if (mask === "stains stains--top-right2") {
      return "dandd-3";
    }
    return "default-1";
  }

  private convertElement(element: LayoutElement): ElementModel {
    switch (element.component) {
      case "HeadingElementLayout":
        return this.convertHeadingElement(element as HeadingElement);
      case "HorizontalLayout":
        return this.convertHorizontalLayoutElement(element as HorizontalLayoutElement);
      case "MonsterBlockLayout":
        return this.convertMonsterElement(element as MonsterBlockElement);
      case "NoteElementLayout":
        return this.convertNoteElement(element as NoteElement);
      case "ParagraphElementLayout":
        return this.convertParagraphElement(element as ParagraphElement);
      case "SpacerElementLayout":
        return this.convertSpacerElement(element as SpacerElement);
      case "TableElementLayout":
        return this.convertTableElement(element as TableElement);
      case "VerticalLayout":
        return this.convertVerticalLayoutElement(element as VerticalLayoutElement);
      default:
        return { component: "UNKNOWN" };
    }
  }

  private convertHorizontalLayoutElement(
    element: HorizontalLayoutElement
  ): HorizontalLayoutElementModel {
    return {
      component: "HorizontalLayoutElement",
      elements: element.columns.map(this.convertHorizontalLayoutColumn.bind(this)),
      gutter: 32,
    };
  }

  private convertHorizontalLayoutColumn(column: Column): HorizontalLayoutElementColumnModel {
    return {
      ...this.convertVerticalLayoutElement(column.element as VerticalLayoutElement),
      width: column.width,
    };
  }

  private convertVerticalLayoutElement(element: VerticalLayoutElement): VerticalLayoutElementModel {
    return {
      component: "VerticalLayoutElement",
      elements: element.rows.map(this.convertElement.bind(this)),
    };
  }

  private convertSpacerElement(element: SpacerElement): VerticalSpacingElementModel {
    return {
      component: "VerticalSpacingElement",
      height: element.height * this.nornDocument.settings.pageSize.pixelPerUnit,
    };
  }

  private convertHeadingElement(element: HeadingElement): DandDHeadingElementModel {
    return {
      component: "DandDHeadingElement",
      level: this.convertHeadingType(element.type),
      value: element.text,
    };
  }

  private convertHeadingType(type: HeadingType): HeadingLevel {
    switch (type) {
      case "h5":
        return 5;
      case "h4":
        return 4;
      case "h3":
        return 3;
      case "h2":
        return 2;
      case "h1":
      default:
        return 1;
    }
  }

  private convertParagraphElement(element: ParagraphElement): DandDParagraphElementModel {
    return {
      component: "DandDParagraphElement",
      firstLineUppercase: false,
      initial: element.initial,
      value: element.text,
    };
  }

  private convertNoteElement(element: NoteElement): DandDNoteElementModel {
    return {
      component: "DandDNoteElement",
      value: element.text,
      type: this.convertNoteType(element.type),
      backgroundColor: "#f2edce",
    };
  }

  private convertNoteType(type: NoteType): DandDNoteType {
    if (type === NoteType.DESCRIPTION) {
      return DandDNoteType.INTRO;
    } else if (type === NoteType.NOTE) {
      return DandDNoteType.NOTE;
    } else {
      return DandDNoteType.NOTE;
    }
  }

  private convertTableElement(element: TableElement): DandDTableElementModel {
    return {
      component: "DandDTableElement",
      rowBackground: "#e0e5c1",
      type: this.convertTableType(element.type),
      headline: !isEmpty(element.headline) ? element.headline : undefined,
      table: this.convertTable(element.table),
    };
  }

  private convertTableType(type: TableType): DandDTableType {
    if (type === TableType.SIMPLE) {
      return DandDTableType.SIMPLE;
    } else if (type === TableType.CLASS) {
      return DandDTableType.CLASS;
    } else {
      return DandDTableType.SIMPLE;
    }
  }

  private convertTable(table: NornTable): Table {
    const header: TableColumn[] = [];
    const rows: TableRow[] = [];
    for (const headerCol of table.header.cols) {
      const headerColumn: TableColumn = {
        header: {
          style: {
            align: this.convertTableAlign(headerCol.align),
          },
          value: headerCol.content,
        },
      };
      header.push(headerColumn);
    }
    for (const r of table.rows) {
      const columns: TableCell[] = [];
      for (let i = 0; i < r.cols.length; i++) {
        const col = r.cols[i];
        const header = table.header.cols[i];
        const column: TableCell = {
          style: {
            align: this.convertTableAlign(header.align),
          },
          value: col.content,
        };
        columns.push(column);
      }
      const row: TableRow = {
        columns: columns,
      };
      rows.push(row);
    }
    return {
      header: header,
      rows: rows,
    };
  }

  private convertTableAlign(align: TableColAlign): TextAlign {
    if (align === TableColAlign.LEFT) {
      return TextAlign.LEFT;
    } else if (align === TableColAlign.CENTER) {
      return TextAlign.CENTER;
    } else if (align === TableColAlign.RIGHT) {
      return TextAlign.RIGHT;
    } else {
      return TextAlign.LEFT;
    }
  }

  private convertMonsterElement(element: MonsterBlockElement): DandDMonsterElementModel {
    const nornMonster = element.monster;
    const monster: Monster = {
      basic: {
        name: nornMonster.name,
        alignment: this.convertAlignment(nornMonster.alignment),
        size: this.convertMonsterSize(nornMonster.size),
        type: this.convertMonsterType(nornMonster.type),
        subType: nornMonster.subType ? nornMonster.subType : null,
      },
      combat: {
        armorClass: nornMonster.armorClass,
        armorClassType: nornMonster.armorClassType,
        hitDices: nornMonster.hitDices,
        hitDiceType: this.convertDice(nornMonster.hitDiceType),
        hitPointModifier: nornMonster.hitPointModifier,
        movements: this.convertMovements(nornMonster.movements),
      },
      stats: {
        charisma: nornMonster.charisma,
        constitution: nornMonster.constitution,
        dexterity: nornMonster.dexterity,
        intelligence: nornMonster.intelligence,
        strength: nornMonster.strength,
        wisdom: nornMonster.wisdom,
      },
      abilities: {
        challengeRating: this.convertCR(nornMonster.challengeRating),
        combatModifier: {
          conditionImmunities: this.convertConditions(nornMonster.conditionImmunities),
          damageImmunity: this.toStringWrapperArray(nornMonster.damageImmunity),
          damageResistance: this.toStringWrapperArray(nornMonster.damageResistance),
          damageVulnerability: this.toStringWrapperArray(nornMonster.damageVulnerability),
        },
        languages: this.toStringWrapperArray(nornMonster.languages),
        passivePerception: nornMonster.passivePerception,
        savingThrows: this.convertSaves(nornMonster.savingThrows),
        senses: this.toStringWrapperArray(nornMonster.senses),
        skills: this.convertSkills(nornMonster.skills),
      },
      actions: {
        actions: this.convertActions(nornMonster.actions),
        bonusActions: this.convertAbilities(nornMonster.bonusActions),
        reactions: this.convertAbilities(nornMonster.reactions),
      },
      specialTraits: this.convertAbilities(nornMonster.specialTraits),
      legendary: nornMonster.isLegendary
        ? this.convertLegendaryInfo(nornMonster.legendaryDescription, nornMonster.legendaryActions)
        : null,
      mythic: nornMonster.isMythic
        ? this.convertLegendaryInfo(nornMonster.mythicDescription, nornMonster.mythicActions)
        : null,
    };
    return {
      component: "DandDMonsterElement",
      numbersFix: false,
      twoColumns: false,
      value: monster,
    };
  }

  private convertAlignment(alignment: DnDAlignment | undefined): Alignment | null {
    if (alignment) {
      switch (alignment) {
        case DnDAlignment.CHAOTIC_EVIL:
          return Alignment.CHAOTIC_EVIL;
        case DnDAlignment.CHAOTIC_GOOD:
          return Alignment.CHAOTIC_GOOD;
        case DnDAlignment.CHAOTIC_NEUTRAL:
          return Alignment.CHAOTIC_NEUTRAL;
        case DnDAlignment.NEUTRAL_EVIL:
          return Alignment.NEUTRAL_EVIL;
        case DnDAlignment.NEUTRAL_GOOD:
          return Alignment.NEUTRAL_GOOD;
        case DnDAlignment.NEUTRAL_NEUTRAL:
          return Alignment.NEUTRAL_NEUTRAL;
        case DnDAlignment.LAWFUL_EVIL:
          return Alignment.LAWFUL_EVIL;
        case DnDAlignment.LAWFUL_GOOD:
          return Alignment.LAWFUL_GOOD;
        case DnDAlignment.LAWFUL_NEUTRAL:
          return Alignment.LAWFUL_NEUTRAL;
        case DnDAlignment.UNALIGNED:
        default:
          return Alignment.UNALIGNED;
      }
    }
    return null;
  }

  private convertMonsterSize(size: MonsterSize): Size {
    switch (size) {
      case MonsterSize.GARGANTUAN:
        return Size.GARGANTUAN;
      case MonsterSize.HUGE:
        return Size.HUGE;
      case MonsterSize.LARGE:
        return Size.LARGE;
      case MonsterSize.TINY:
        return Size.TINY;
      case MonsterSize.SMALL:
        return Size.SMALL;
      case MonsterSize.MEDIUM:
      default:
        return Size.MEDIUM;
    }
  }

  private convertMonsterType(type: MonsterType): Type {
    switch (type) {
      case MonsterType.ABERATION:
        return Type.ABERRATION;
      case MonsterType.BEAST:
        return Type.BEAST;
      case MonsterType.CELESTIAL:
        return Type.CELESTIAL;
      case MonsterType.CONSTRUCT:
        return Type.CONSTRUCT;
      case MonsterType.DRAGON:
        return Type.DRAGON;
      case MonsterType.ELEMENTAL:
        return Type.ELEMENTAL;
      case MonsterType.FEY:
        return Type.FEY;
      case MonsterType.FIEND:
        return Type.FIEND;
      case MonsterType.GIANT:
        return Type.GIANT;
      case MonsterType.HUMANOID:
        return Type.HUMANOID;
      case MonsterType.MONSTROSITY:
        return Type.MONSTROSITY;
      case MonsterType.OOZE:
        return Type.OOZE;
      case MonsterType.PLANT:
        return Type.PLANT;
      case MonsterType.UNDEAD:
        return Type.UNDEAD;
      case MonsterType.UNKNOWN:
      default:
        return Type.UNKNOWN;
    }
  }

  private convertDice(hitDiceType: NornDiceType): DiceType {
    switch (hitDiceType) {
      case NornDiceType.D10:
        return DiceType.D10;
      case NornDiceType.D12:
        return DiceType.D12;
      case NornDiceType.D20:
        return DiceType.D20;
      case NornDiceType.D6:
        return DiceType.D6;
      case NornDiceType.D8:
        return DiceType.D8;
      case NornDiceType.D4:
      default:
        return DiceType.D4;
    }
  }

  private convertMovements(movements: MonsterMovement[] | undefined): Movement[] {
    return movements ? movements.map(this.convertMovement.bind(this)) : [];
  }

  private convertMovement(movement: MonsterMovement): Movement {
    let type: MovementType;
    switch (movement.type) {
      case "burrow":
        type = MovementType.BURROW;
        break;
      case "climb":
        type = MovementType.CLIMB;
        break;
      case "fly":
        type = MovementType.FLY;
        break;
      case "swim":
        type = MovementType.SWIM;
        break;
      case "":
      default:
        type = MovementType.WALK;
        break;
    }
    return {
      type: type,
      unit: movement.unit === NornUnit.FEET ? Unit.FEET : Unit.METER,
      value: movement.value,
    };
  }

  private convertCR(challengeRating: DnDChallangeRating): ChallengeRating {
    switch (challengeRating) {
      case DnDChallangeRating.ZERO_ALT:
        return ChallengeRatings.ZERO_ALT;
      case DnDChallangeRating.EIGTHS:
        return ChallengeRatings.EIGHTS;
      case DnDChallangeRating.QUARTER:
        return ChallengeRatings.QUARTER;
      case DnDChallangeRating.HALF:
        return ChallengeRatings.HALF;
      case DnDChallangeRating.ONE:
        return ChallengeRatings.ONE;
      case DnDChallangeRating.TWO:
        return ChallengeRatings.TWO;
      case DnDChallangeRating.THREE:
        return ChallengeRatings.THREE;
      case DnDChallangeRating.FOUR:
        return ChallengeRatings.FOUR;
      case DnDChallangeRating.FIVE:
        return ChallengeRatings.FIVE;
      case DnDChallangeRating.SIX:
        return ChallengeRatings.SIX;
      case DnDChallangeRating.SEVEN:
        return ChallengeRatings.SEVEN;
      case DnDChallangeRating.EIGTH:
        return ChallengeRatings.EIGHT;
      case DnDChallangeRating.NINE:
        return ChallengeRatings.NINE;
      case DnDChallangeRating.TEN:
        return ChallengeRatings.TEN;
      case DnDChallangeRating.ELEVEN:
        return ChallengeRatings.ELEVEN;
      case DnDChallangeRating.TWELVE:
        return ChallengeRatings.TWELVE;
      case DnDChallangeRating.THIRTEEN:
        return ChallengeRatings.THIRTEEN;
      case DnDChallangeRating.FOURTEEN:
        return ChallengeRatings.FOURTEEN;
      case DnDChallangeRating.FIFTEEN:
        return ChallengeRatings.FIFTEEN;
      case DnDChallangeRating.SIXTEEN:
        return ChallengeRatings.SIXTEEN;
      case DnDChallangeRating.SEVENTEEN:
        return ChallengeRatings.SEVENTEEN;
      case DnDChallangeRating.EIGTHTEEN:
        return ChallengeRatings.EIGHTEEN;
      case DnDChallangeRating.NINETEEN:
        return ChallengeRatings.NINETEEN;
      case DnDChallangeRating.TWENTY:
        return ChallengeRatings.TWENTY;
      case DnDChallangeRating.TWENTY_ONE:
        return ChallengeRatings.TWENTY_ONE;
      case DnDChallangeRating.TWENTY_TWO:
        return ChallengeRatings.TWENTY_TWO;
      case DnDChallangeRating.TWENTY_THREE:
        return ChallengeRatings.TWENTY_THREE;
      case DnDChallangeRating.TWENTY_FOUR:
        return ChallengeRatings.TWENTY_FOUR;
      case DnDChallangeRating.TWENTY_FIVE:
        return ChallengeRatings.TWENTY_FIVE;
      case DnDChallangeRating.TWENTY_SIX:
        return ChallengeRatings.TWENTY_SIX;
      case DnDChallangeRating.TWENTY_SEVEN:
        return ChallengeRatings.TWENTY_SEVEN;
      case DnDChallangeRating.TWENTY_EIGHT:
        return ChallengeRatings.TWENTY_EIGHT;
      case DnDChallangeRating.TWENTY_NINE:
        return ChallengeRatings.TWENTY_NINE;
      case DnDChallangeRating.THIRTY:
        return ChallengeRatings.THIRTY;
      case DnDChallangeRating.ZERO:
      default:
        return ChallengeRatings.ZERO;
    }
  }

  private convertConditions(
    conditionImmunities: NornStatusConditions[] | undefined
  ): StatusConditions[] {
    return conditionImmunities ? conditionImmunities.map(this.convertCondition.bind(this)) : [];
  }

  private convertCondition(conditionImmunity: NornStatusConditions): StatusConditions {
    switch (conditionImmunity) {
      case NornStatusConditions.BLINDED:
        return StatusConditions.BLINDED;
      case NornStatusConditions.CHARMED:
        return StatusConditions.CHARMED;
      case NornStatusConditions.DEAFENED:
        return StatusConditions.DEAFENED;
      case NornStatusConditions.EXHAUSTION:
        return StatusConditions.EXHAUSTION;
      case NornStatusConditions.FRIGHTENED:
        return StatusConditions.FRIGHTENED;
      case NornStatusConditions.GRAPPLED:
        return StatusConditions.GRAPPLED;
      case NornStatusConditions.INCAPACITATED:
        return StatusConditions.INCAPACITATED;
      case NornStatusConditions.INVISIBLE:
        return StatusConditions.INVISIBLE;
      case NornStatusConditions.PARALYZED:
        return StatusConditions.PARALYZED;
      case NornStatusConditions.PETRIFIED:
        return StatusConditions.PETRIFIED;
      case NornStatusConditions.POISONIED:
        return StatusConditions.POISONED;
      case NornStatusConditions.PRONE:
        return StatusConditions.PRONE;
      case NornStatusConditions.RESTRAINED:
        return StatusConditions.RESTRAINED;
      case NornStatusConditions.STUNNED:
        return StatusConditions.STUNNED;
      case NornStatusConditions.UNCONSCIOUS:
      default:
        return StatusConditions.UNCONSCIOUS;
    }
  }

  private toStringWrapperArray(array: string[] | undefined): StringWrapper[] {
    return array ? array.map((value) => ({ value: value })) : [];
  }

  private convertSaves(savingThrows: MonsterSaves[] | undefined): Saves[] {
    return savingThrows ? savingThrows.map(this.convertSave.bind(this)) : [];
  }

  private convertSave(savingThrow: MonsterSaves): Saves {
    let stat: Stats;
    switch (savingThrow.stat) {
      case "Charisma":
        stat = Stats.CHA;
        break;
      case "Constitution":
        stat = Stats.CON;
        break;
      case "Dexterity":
        stat = Stats.DEX;
        break;
      case "Intelligence":
        stat = Stats.INT;
        break;
      case "Strength":
        stat = Stats.STR;
        break;
      case "Wisdom":
      default:
        stat = Stats.WIS;
        break;
    }
    return {
      stat: stat,
      value: savingThrow.value,
    };
  }

  private convertSkills(skills: MonsterSkill[] | undefined): Skill[] {
    return skills ? skills.map(this.convertSkill.bind(this)) : [];
  }

  private convertSkill(skill: MonsterSkill): Skill {
    return {
      name: skill.name,
      value: skill.value,
    };
  }

  private convertActions(actions: MonsterAction[]): Action[] {
    return actions.map(this.convertAction.bind(this));
  }

  private convertAction(action: MonsterAction): Action {
    const attack: Attack | undefined = action.attack
      ? this.convertAttack(action.attack)
      : undefined;
    const ability: Ability | undefined = action.ability
      ? this.convertAbility(action.ability)
      : undefined;
    return {
      attack: attack,
      ability: ability,
    };
  }

  private convertAttack(attack: MonsterAttack): Attack {
    return {
      name: attack.name,
      attack: attack.attack,
      attackType: attack.attackType,
      damage: attack.damage,
    };
  }

  private convertAbilities(abilities: MonsterAbility[]): Ability[] {
    return abilities.map(this.convertAbility.bind(this));
  }

  private convertAbility(ability: MonsterAbility): Ability {
    return {
      name: ability.name,
      description: ability.description,
    };
  }

  private convertLegendaryInfo(
    description: string | undefined,
    abilities: MonsterAbility[] | undefined
  ): LegendaryInfo {
    return {
      description: description || "",
      actions: abilities ? this.convertAbilities(abilities) : [],
    };
  }
}
