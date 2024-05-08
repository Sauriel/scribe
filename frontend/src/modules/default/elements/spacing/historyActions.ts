import { Action, HistoryContext } from "@/history/HistoryManager";
import VerticalSpacingElementModel from "@/modules/default/elements/spacing/VerticalSpacingElementModel";
import { cloneDeep } from "lodash";

export class ChangeVerticalSpacingHeightAction implements Action {
  public readonly baseMessageKey = "action.element.default.spacing.height";

  constructor(
    public readonly element: VerticalSpacingElementModel,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.height === this.newValue) {
      this.element.height = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.height === this.originalValue) {
      this.element.height = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}
