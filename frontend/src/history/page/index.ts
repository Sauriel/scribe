import { Action, HistoryContext } from "@/history/HistoryManager";
import { PageModel } from "@/models/document";
import { cloneDeep, isEqual } from "lodash";
import VuexHelper from "@/helper/VuexHelper";
import { LAYOUT_STORE_NAMESPACE } from "@/store/layout/layoutStoreModule";
import { LayoutStoreMutations } from "@/store/layout/layoutStoreMutations";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";

const layoutStore = VuexHelper.createNamespace(LAYOUT_STORE_NAMESPACE);
const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

export class ChangePageBackgroundAction implements Action {
  public readonly baseMessageKey = "action.page.background.change";

  constructor(
    public readonly pageId: number,
    public readonly originalValue: string | undefined,
    public readonly newValue: string | undefined
  ) {}

  public revert(context: HistoryContext): boolean {
    const page = context.document.pages[this.pageId];
    if (page) {
      if (page.background === this.newValue) {
        page.background = this.originalValue;
        return true;
      }
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    const page = context.document.pages[this.pageId];
    if (page) {
      if (page.background === this.originalValue) {
        page.background = this.newValue;
        return true;
      }
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class AddNewPageAction implements Action {
  public readonly baseMessageKey = "action.page.add";

  constructor(
    private readonly pageId: number,
    private readonly afterPage: boolean,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {}

  public revert(context: HistoryContext): boolean {
    if (context.document.pages.length === this.newValue) {
      const removeIndex = this.afterPage ? this.pageId + 1 : this.pageId;
      context.document.pages.splice(removeIndex, 1);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (context.document.pages.length === this.originalValue) {
      const newPage: PageModel = {
        backgroundImages: [],
        elements: [],
      };
      const insertAtIndex = this.afterPage ? this.pageId + 1 : this.pageId;
      context.document.pages.splice(insertAtIndex, 0, newPage);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class RemovePageAction implements Action {
  public readonly baseMessageKey = "action.page.remove";
  private readonly page: PageModel;

  constructor(
    public readonly pageId: number,
    page: PageModel,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {
    this.page = cloneDeep(page);
  }

  public revert(context: HistoryContext): boolean {
    if (context.document.pages.length === this.newValue) {
      context.document.pages.splice(this.pageId, 0, this.page);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (context.document.pages.length === this.originalValue) {
      const selectedPage = documentStore.getters(DocumentStoreGetters.SELECTED_PAGE);
      if (this.pageId == selectedPage || selectedPage >= this.newValue) {
        documentStore.commit(DocumentStoreMutations.SET_SELECTED_PAGE, undefined);
        layoutStore.commit(LayoutStoreMutations.SET_EDIT_PANEL_COMPONENT, undefined);
      }
      context.document.pages.splice(this.pageId, 1);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class DuplicatePageAction implements Action {
  public readonly baseMessageKey = "action.page.duplicate";

  constructor(
    private readonly pageId: number,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {}

  public revert(context: HistoryContext): boolean {
    if (context.document.pages.length === this.newValue) {
      const removeIndex = this.pageId + 1;
      context.document.pages.splice(removeIndex, 1);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (context.document.pages.length === this.originalValue) {
      const originPage = context.document.pages[this.pageId];
      const duplicate = cloneDeep(originPage);
      const insertAtIndex = this.pageId + 1;
      context.document.pages.splice(insertAtIndex, 0, duplicate);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangePageOrderAction implements Action {
  public readonly baseMessageKey = "action.page.order";
  public readonly page: PageModel;

  constructor(
    public readonly originalValue: number,
    public readonly newValue: number,
    page: PageModel
  ) {
    this.page = cloneDeep(page);
  }

  public revert(context: HistoryContext): boolean {
    const pageFromIndex = context.document.pages[this.newValue];
    if (isEqual(pageFromIndex, this.page)) {
      context.document.pages.splice(this.newValue, 1); // delete from: newValue
      context.document.pages.splice(this.originalValue, 0, pageFromIndex); // insert into: originalValue
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    const pageFromIndex = context.document.pages[this.originalValue];
    if (isEqual(pageFromIndex, this.page)) {
      context.document.pages.splice(this.originalValue, 1); // delete from: originalValue
      context.document.pages.splice(this.newValue, 0, pageFromIndex); // insert into: newValue
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}
