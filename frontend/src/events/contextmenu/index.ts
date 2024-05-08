import { EmitterEvent } from "@/emitter";
// @ts-ignore
import { ContextMenuConfig } from "@/components/app/ui/context-menu/ContextMenu.vue";

export const CONTEXT_MENU_SHOW_EVENT_NAME = "context-menu:show";
export interface ContextMenuShowEvent extends EmitterEvent<ContextMenuConfig> {}
