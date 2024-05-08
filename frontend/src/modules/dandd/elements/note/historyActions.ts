import { Action, HistoryContext } from "@/history/HistoryManager";
import { cloneDeep } from "lodash";
import DandDNoteElementModel, { DandDNoteType } from "@/modules/dandd/elements/note/DandDNoteElementModel";

export class ChangeDandDNoteTypeAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.note.type.change";

  constructor(
    public readonly element: DandDNoteElementModel,
    public readonly originalValue: DandDNoteType,
    public readonly newValue: DandDNoteType
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.type === this.newValue) {
      this.element.type = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.type === this.originalValue) {
      this.element.type = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangeDandDNoteBackgroundColorAction implements Action {
  public readonly baseMessageKey = "action.element.dandd.note.backgroundColor.change";

  constructor(
    public readonly element: DandDNoteElementModel,
    public readonly originalValue: string,
    public readonly newValue: string
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.backgroundColor === this.newValue) {
      this.element.backgroundColor = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.backgroundColor === this.originalValue) {
      this.element.backgroundColor = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}
