import { GlobalStoreGetters } from "@/store/global/globalStoreGetters";
import { translate } from "@/i18n";
import DocumentModel from "@/models/document";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import {
  NotificationUpdateEvent,
  NotificationType,
  NOTIFICATION_UPDATE_EVENT_NAME,
} from "@/events/notification";
import emitter from "@/emitter";
import { GLOBAL_STORE_NAMESPACE } from "@/store/global/globalStoreModule";
import LocalForageHelper from "@/helper/LocalForageHelper";
import { HistoryChangedEvent, HISTORY_CHANGED_EVENT_NAME } from "@/events/history";

export const HISTORY_MANAGER = "historyManager";

export declare type ActionType = "do" | "undo" | "redo";

export interface HistoryContext {
  document: DocumentModel;
}

export interface Action {
  readonly baseMessageKey: string;
  readonly originalValue: any;
  readonly newValue: any;
  readonly revert: (context: HistoryContext) => boolean;
  readonly apply: (context: HistoryContext) => boolean;
}

export default class HistoryManager {
  private gracePeriod = 500;
  private gracefulActions: Map<string, NodeJS.Timeout> = new Map();
  private undoList: Action[] = [];
  private redoList: Action[] = [];

  public get undoEntry(): Action | undefined {
    return this.getLastEntry(this.undoList);
  }

  public get redoEntry(): Action | undefined {
    return this.getLastEntry(this.redoList);
  }

  private getLastEntry(list: Action[]): Action | undefined {
    return list.length > 0 ? list[list.length - 1] : undefined;
  }

  public do(action: Action) {
    action.apply(this.getContext());
    this.undoList.push(action);
    this.redoList = [];
    this.emitChange("do");
    this.autosave();
  }

  public silentDo(action: Action) {
    action.apply(this.getContext());
  }

  public gracefulDo(action: Action, actionName: string, gracePeriod?: number) {
    this.cancelGracefulAction(actionName);
    const gracefulActionId = setTimeout(
      this.callActionGraceful.bind(this),
      gracePeriod || this.gracePeriod,
      action,
      actionName
    );
    this.gracefulActions.set(actionName, gracefulActionId);
  }

  private callActionGraceful(action: Action, actionName: string) {
    this.do(action);
    this.gracefulActions.delete(actionName);
  }

  public cancelGracefulAction(actionName: string) {
    const existingGracefulActionId = this.gracefulActions.get(actionName);
    if (existingGracefulActionId) {
      clearTimeout(existingGracefulActionId);
    }
    this.gracefulActions.delete(actionName);
  }

  public undo() {
    const action = this.undoList.pop();
    if (action) {
      if (action.revert(this.getContext())) {
        this.redoList.push(action);
        this.success("undo", action.baseMessageKey);
        this.emitChange("undo");
        this.autosave();
      } else {
        this.failure("undo", action.baseMessageKey);
      }
    }
  }

  public redo() {
    const action = this.redoList.pop();
    if (action) {
      if (action.apply(this.getContext())) {
        this.undoList.push(action);
        this.success("redo", action.baseMessageKey);
        this.emitChange("undo");
        this.autosave();
      } else {
        this.failure("redo", action.baseMessageKey);
      }
    }
  }

  private get document(): DocumentModel {
    const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);
    return documentStore.getters(DocumentStoreGetters.DOCUMENT);
  }

  private getContext(): HistoryContext {
    return {
      document: this.document,
    };
  }

  private autosave() {
    const globalStore = VuexHelper.createNamespace(GLOBAL_STORE_NAMESPACE);
    const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);
    const documentSaveKey = documentStore.getters(DocumentStoreGetters.SAVED_DOCUMENT_KEY);
    if (globalStore.getters(GlobalStoreGetters.AUTOSAVE) && documentSaveKey) {
      console.log("autosaving ...");
      LocalForageHelper.save(this.document, documentSaveKey);
    }
  }

  private emitChange(actionType: ActionType) {
    const event: HistoryChangedEvent = {
      name: HISTORY_CHANGED_EVENT_NAME,
      payload: actionType,
    };
    emitter.$emit(HISTORY_CHANGED_EVENT_NAME, event);
  }

  private success(actionType: ActionType, baseMessageKey: string) {
    this.showNotification(actionType, "success", baseMessageKey);
  }

  private failure(actionType: ActionType, baseMessageKey: string) {
    this.showNotification(actionType, "failure", baseMessageKey);
  }

  private showNotification(
    actionType: ActionType,
    type: NotificationType,
    actionMessageKey: string
  ) {
    const message = translate("action." + actionType + "." + type, {
      action: translate(actionMessageKey),
    });
    const event: NotificationUpdateEvent = {
      name: NOTIFICATION_UPDATE_EVENT_NAME,
      payload: {
        type: type,
        content: message,
        visible: true,
      },
    };
    emitter.$emit(NOTIFICATION_UPDATE_EVENT_NAME, event);
  }
}

export const historyManager = new HistoryManager();
