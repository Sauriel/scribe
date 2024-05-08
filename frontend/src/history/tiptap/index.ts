import { Action, HistoryContext } from "@/history/HistoryManager";
import { Getter, Setter } from "@/models";
import { cloneDeep, isEqual } from "lodash";

export class ChangeTipTapContentAction<T> implements Action {
  public readonly baseMessageKey;

  constructor(
    type: string,
    private readonly object: T,
    private readonly set: Setter<T, string>,
    private readonly get: Getter<T, string>,
    public readonly originalValue: string,
    public readonly newValue: string
  ) {
    this.baseMessageKey = "action.tiptap." + type;
  }

  public revert(context: HistoryContext): boolean {
    if (isEqual(this.get(this.object), this.newValue)) {
      this.set(this.object, this.originalValue);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (isEqual(this.get(this.object), this.originalValue)) {
      this.set(this.object, this.newValue);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}
