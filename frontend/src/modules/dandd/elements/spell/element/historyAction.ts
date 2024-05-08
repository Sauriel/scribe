import { Action, HistoryContext } from "@/history/HistoryManager";
import { cloneDeep } from "lodash";
import DandDSpellElementModel from "@/modules/dandd/elements/spell/DandDSpellElementModel";

export class ChangeDandDSpellXXXAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.spell.XXX.change";

  constructor(
    public readonly element: DandDSpellElementModel,
    public readonly originalValue: string,
    public readonly newValue: string
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.description === this.newValue) {
      this.element.description = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.description === this.originalValue) {
      this.element.description = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}