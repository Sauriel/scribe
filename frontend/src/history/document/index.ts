import { PageFooter } from "@/models/document/index";
import { Action, HistoryContext } from "@/history/HistoryManager";
import { SettingName } from "@/models/setting";
import { PageFormat } from "@/models/document/pageFormat";
import { assign, cloneDeep, isEqual } from "lodash";

export class ChangeDocumentNameAction implements Action {
  public readonly baseMessageKey = "action.document.name.change";

  constructor(public readonly originalValue: string, public readonly newValue: string) {}

  public revert(context: HistoryContext): boolean {
    if (context.document.name === this.newValue) {
      context.document.name = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (context.document.name === this.originalValue) {
      context.document.name = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangeDocumentSettingAction implements Action {
  public readonly baseMessageKey = "action.document.setting.change";

  constructor(public readonly originalValue: SettingName, public readonly newValue: SettingName) {}

  public revert(context: HistoryContext): boolean {
    if (context.document.defaults.setting === this.newValue) {
      context.document.defaults.setting = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (context.document.defaults.setting === this.originalValue) {
      context.document.defaults.setting = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangeDocumentPageSizeAction implements Action {
  public readonly baseMessageKey = "action.document.page_size.change";

  constructor(public readonly originalValue: PageFormat, public readonly newValue: PageFormat) {}

  public revert(context: HistoryContext): boolean {
    if (isEqual(context.document.format, this.newValue)) {
      context.document.format = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (isEqual(context.document.format, this.originalValue)) {
      context.document.format = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangeDocumentBackgroundAction implements Action {
  public readonly baseMessageKey = "action.document.background.change";

  constructor(public readonly originalValue: string, public readonly newValue: string) {}

  public revert(context: HistoryContext): boolean {
    if (context.document.defaults.background === this.newValue) {
      context.document.defaults.background = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (context.document.defaults.background === this.originalValue) {
      context.document.defaults.background = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangeDocumentFooterAction implements Action {
  public readonly baseMessageKey = "action.document.footer.change";

  constructor(
    public readonly originalValue: PageFooter | undefined,
    public readonly newValue: PageFooter | undefined
  ) {}

  public revert(context: HistoryContext): boolean {
    if (isEqual(context.document.defaults.footer, this.newValue)) {
      context.document.defaults.footer = this.originalValue;
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (isEqual(context.document.defaults.footer, this.originalValue)) {
      context.document.defaults.footer = this.newValue;
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}
