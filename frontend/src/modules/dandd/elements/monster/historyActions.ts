import DandDMonsterElementModel, { Monster } from "@/modules/dandd/elements/monster/DandDMonsterElementModel";
import { Action, HistoryContext } from "@/history/HistoryManager";
import { assign, cloneDeep, isEqual } from "lodash";

export class ChangeDandDMonsterTwoColumnsAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.monster.columns.change";

  constructor(
    public readonly element: DandDMonsterElementModel,
    public readonly originalValue: boolean,
    public readonly newValue: boolean
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.twoColumns === this.newValue) {
      this.element.twoColumns = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.twoColumns === this.originalValue) {
      this.element.twoColumns = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangeDandDMonsterNumbersFixAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.monster.numbersFix.change";

  constructor(
    public readonly element: DandDMonsterElementModel,
    public readonly originalValue: boolean,
    public readonly newValue: boolean
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.numbersFix === this.newValue) {
      this.element.numbersFix = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.numbersFix === this.originalValue) {
      this.element.numbersFix = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangeDandDMonsterAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.monster.change";
  public readonly originalValue: Monster;

  constructor(
    public readonly element: DandDMonsterElementModel,
    originalValue: Monster,
    public readonly newValue: Monster
  ) {
    this.originalValue = cloneDeep(originalValue);
  }

  public revert(context: HistoryContext): boolean {
    if (isEqual(this.element.value, this.newValue)) {
      assign(this.element.value, this.originalValue);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (isEqual(this.element.value, this.originalValue)) {
      assign(this.element.value, this.newValue);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}
