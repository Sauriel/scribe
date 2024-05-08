import { Action, HistoryContext } from "@/history/HistoryManager";
import ElementModel from "@/modules/ElementModel";
import { cloneDeep } from "lodash";
import VerticalLayoutElementModel from "@/modules/default/elements/vertical/VerticalLayoutElementModel";

export class AddElementAction implements Action {
  public readonly baseMessageKey = "action.element.default.vertical.add";

  constructor(
    public layout: VerticalLayoutElementModel,
    public index: number,
    public element: ElementModel,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.layout.elements.length === this.newValue) {
      this.layout.elements.splice(this.index, 1); // delete from
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.layout.elements.length === this.originalValue) {
      this.layout.elements.splice(this.index, 0, this.element); // insert into
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class RemoveElementAction implements Action {
  public readonly baseMessageKey = "action.element.default.vertical.remove";
  public element: ElementModel;

  constructor(
    public layout: VerticalLayoutElementModel,
    public index: number,
    element: ElementModel,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {
    this.element = cloneDeep(element);
  }

  public revert(context: HistoryContext): boolean {
    if (this.layout.elements.length === this.newValue) {
      this.layout.elements.splice(this.index, 0, this.element); // insert into
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.layout.elements.length === this.originalValue) {
      this.layout.elements.splice(this.index, 1); // delete from
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class MoveElementAction implements Action {
  public readonly baseMessageKey = "action.element.default.vertical.move";

  constructor(
    public layout: VerticalLayoutElementModel,
    public element: ElementModel,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {}

  public revert(context: HistoryContext): boolean {
    const indexOfElement = this.layout.elements.indexOf(this.element);
    if (indexOfElement === this.newValue) {
      this.layout.elements.splice(this.newValue, 1); // delete from
      this.layout.elements.splice(this.originalValue, 0, this.element); // insert into
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    const indexOfElement = this.layout.elements.indexOf(this.element);
    if (indexOfElement === this.originalValue) {
      this.layout.elements.splice(this.originalValue, 1); // delete from
      this.layout.elements.splice(this.newValue, 0, this.element); // insert into
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class MoveElementBetweenLayoutsAction implements Action {
  public readonly baseMessageKey = "action.element.default.vertical.move";

  constructor(
    public fromLayout: VerticalLayoutElementModel,
    public toLayout: VerticalLayoutElementModel,
    public element: ElementModel,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {}

  public revert(context: HistoryContext): boolean {
    const indexOfElement = this.toLayout.elements.indexOf(this.element);
    if (indexOfElement === this.newValue) {
      this.toLayout.elements.splice(this.newValue, 1); // delete from
      this.fromLayout.elements.splice(this.originalValue, 0, this.element); // insert into
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    const indexOfElement = this.fromLayout.elements.indexOf(this.element);
    if (indexOfElement === this.originalValue) {
      this.fromLayout.elements.splice(this.originalValue, 1); // delete from
      this.toLayout.elements.splice(this.newValue, 0, this.element); // insert into
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class DuplicateElementAction implements Action {
  public readonly baseMessageKey = "action.element.default.vertical.duplicate";

  constructor(
    public layout: VerticalLayoutElementModel,
    public index: number,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {}

  public revert(context: HistoryContext): boolean {
    if (this.layout.elements.length === this.newValue) {
      const removeIndex = this.index + 1;
      this.layout.elements.splice(removeIndex, 1); // delete from
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (this.layout.elements.length === this.originalValue) {
      const originalElement = this.layout.elements[this.index];
      const duplicate = cloneDeep(originalElement);
      const insertAtIndex = this.index + 1;
      this.layout.elements.splice(insertAtIndex, 0, duplicate); // insert into
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}
