import { Action, HistoryContext } from "@/history/HistoryManager";
import ElementModel from "@/modules/ElementModel";
import { cloneDeep } from "lodash";

export class ChangeElementTextAction<T extends ElementModel> implements Action {
  public readonly baseMessageKey;

  constructor(
    public readonly element: T,
    public readonly get: (element: T) => string | undefined,
    public readonly set: (element: T, value: string | undefined) => void,
    public readonly originalValue: string | undefined,
    public readonly newValue: string | undefined,
    baseMessageKey = "action.element.text.change"
  ) {
    this.baseMessageKey = baseMessageKey;
  }

  public revert(context: HistoryContext): boolean {
    if (this.get(this.element) === this.newValue) {
      this.set(this.element, this.originalValue);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.get(this.element) === this.originalValue) {
      this.set(this.element, this.newValue);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}
