import { Action, HistoryContext } from "@/history/HistoryManager";
import { cloneDeep } from "lodash";
import DandDParagraphElementModel from "@/modules/dandd/elements/paragraph/DandDParagraphElementModel";

export class ChangeDandDParagraphInitialAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.paragraph.initial.change";

  constructor(
    public readonly element: DandDParagraphElementModel,
    public readonly originalValue: boolean,
    public readonly newValue: boolean
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.initial === this.newValue) {
      this.element.initial = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.initial === this.originalValue) {
      this.element.initial = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangeDandDParagraphUppercaseAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.paragraph.firstLineUppercase.change";

  constructor(
    public readonly element: DandDParagraphElementModel,
    public readonly originalValue: boolean,
    public readonly newValue: boolean
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.firstLineUppercase === this.newValue) {
      this.element.firstLineUppercase = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.firstLineUppercase === this.originalValue) {
      this.element.firstLineUppercase = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}
