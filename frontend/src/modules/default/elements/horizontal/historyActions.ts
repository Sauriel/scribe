import { Action, HistoryContext } from "@/history/HistoryManager";
import { cloneDeep, isEqual } from "lodash";
import HorizontalLayoutElementModel, {
  HorizontalLayoutConfig,
  HorizontalLayoutElementColumnModel,
} from "@/modules/default/elements/horizontal/HorizontalLayoutElementModel";
import VerticalLayoutElementModel, {
  create as createVerticalLayoutElementModel,
} from "@/modules/default/elements/vertical/VerticalLayoutElementModel";

export class ResizeColumnsAction implements Action {
  public readonly baseMessageKey = "action.element.default.horizontal.resize";
  public readonly originalValue: HorizontalLayoutConfig[];

  constructor(
    public element: HorizontalLayoutElementModel,
    originalValue: HorizontalLayoutConfig[],
    public readonly newValue: HorizontalLayoutConfig[]
  ) {
    this.originalValue = cloneDeep(originalValue);
  }

  public revert(context: HistoryContext): boolean {
    if (
      isEqual(
        this.element.elements.map((m) => ({ width: m.width })),
        this.newValue
      )
    ) {
      for (let i = 0; i < this.element.elements.length; i++) {
        this.element.elements[i].width = this.originalValue[i].width;
      }
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (
      isEqual(
        this.element.elements.map((m) => ({ width: m.width })),
        this.originalValue
      )
    ) {
      for (let i = 0; i < this.element.elements.length; i++) {
        this.element.elements[i].width = this.newValue[i].width;
      }
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class AddColumnAction implements Action {
  public readonly baseMessageKey = "action.element.default.horizontal.add";

  constructor(
    public element: HorizontalLayoutElementModel,
    public readonly index: number,
    public readonly after: boolean,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.elements.length === this.newValue) {
      const removeFromIndex = this.after ? this.index + 1 : this.index;
      const width = this.element.elements[removeFromIndex].width;
      this.element.elements.splice(removeFromIndex, 1);
      this.element.elements[this.index].width += width;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.elements.length === this.originalValue) {
      const newWidth = Math.round(this.element.elements[this.index].width / 2);
      const oldWidth = this.element.elements[this.index].width - newWidth;
      this.element.elements[this.index].width = oldWidth;
      const insertAtIndex = this.after ? this.index + 1 : this.index;
      const newColumn = {
        ...createVerticalLayoutElementModel(context.document),
        width: newWidth,
      };
      this.element.elements.splice(insertAtIndex, 0, newColumn);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class RemoveColumn implements Action {
  public readonly baseMessageKey = "action.element.default.horizontal.remove";
  public readonly column: HorizontalLayoutElementColumnModel;

  constructor(
    public element: HorizontalLayoutElementModel,
    public readonly index: number,
    column: HorizontalLayoutElementColumnModel,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {
    this.column = cloneDeep(column);
  }

  public revert(context: HistoryContext): boolean {
    if (this.element.elements.length === this.newValue) {
      const neighborIndex = this.index === this.newValue ? this.index - 1 : this.index + 1;
      this.element.elements.splice(this.index, 0, this.column);
      this.element.elements[neighborIndex].width -= this.column.width;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.elements.length === this.originalValue) {
      const neighborIndex = this.index === this.newValue ? this.index - 1 : this.index + 1;
      this.element.elements[neighborIndex].width += this.column.width;
      this.element.elements.splice(this.index, 1);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangeColumnGutterAction implements Action {
  public readonly baseMessageKey = "action.element.default.horizontal.gutter";

  constructor(
    public readonly element: HorizontalLayoutElementModel,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.element.gutter === this.newValue) {
      const gutter = this.originalValue * context.document.format.unit.pixelPerUnit;
      this.element.gutter = gutter;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.element.gutter === this.originalValue) {
      const gutter = this.newValue * context.document.format.unit.pixelPerUnit;
      this.element.gutter = gutter;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangeColumnOrderAction implements Action {
  public readonly baseMessageKey = "action.element.default.horizontal.order";
  public readonly column: HorizontalLayoutElementColumnModel;

  constructor(
    public readonly element: HorizontalLayoutElementModel,
    public readonly originalValue: number,
    public readonly newValue: number,
    column: HorizontalLayoutElementColumnModel
  ) {
    this.column = cloneDeep(column);
  }

  public revert(context: HistoryContext): boolean {
    const columnFromIndex = this.element.elements[this.newValue];
    if (isEqual(columnFromIndex, this.column)) {
      this.element.elements.splice(this.newValue, 1); // delete from: newValue
      this.element.elements.splice(this.originalValue, 0, columnFromIndex); // insert into: originalValue
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    const columnFromIndex = this.element.elements[this.originalValue];
    if (isEqual(columnFromIndex, this.column)) {
      this.element.elements.splice(this.originalValue, 1); // delete from: originalValue
      this.element.elements.splice(this.newValue, 0, columnFromIndex); // insert into: newValue
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}
