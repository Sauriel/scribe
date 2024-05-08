import { Action, HistoryContext } from "@/history/HistoryManager";
import { cloneDeep } from "lodash";
import DandDHeadingElementModel, {
  HeadingLevel,
} from "@/modules/dandd/elements/heading/DandDHeadingElementModel";

export class ChangeDandDHeadingLevelTextAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.heading.level.change";

  constructor(
    public readonly element: DandDHeadingElementModel,
    public readonly originalValue: HeadingLevel,
    public readonly newValue: HeadingLevel
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.level === this.newValue) {
      this.element.level = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.level === this.originalValue) {
      this.element.level = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}
