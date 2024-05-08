import { EmitterEvent } from "@/emitter";
import { ActionType } from "@/history/HistoryManager";

export const HISTORY_CHANGED_EVENT_NAME = "history:changed";
export interface HistoryChangedEvent extends EmitterEvent<ActionType> {}
