import ElementModel from "@/modules/ElementModel";
import { cloneDeep, isEmpty } from "lodash";
import { Action, HistoryContext } from "../HistoryManager";

export class ChangeCustomCssAction implements Action {
  public readonly baseMessageKey = "action.element.custom-css.change";

  constructor(
    public readonly element: ElementModel,
    public readonly originalValue: string | undefined,
    public readonly newValue: string
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.customCss === this.newValue) {
      if (isEmpty(this.originalValue)) {
        this.element.customCss = undefined;
      } else {
        this.element.customCss = this.originalValue;
      }
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.customCss === this.originalValue) {
      if (isEmpty(this.newValue)) {
        this.element.customCss = undefined;
      } else {
        this.element.customCss = this.newValue;
      }
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}