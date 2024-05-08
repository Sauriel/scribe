import { EmitterEvent } from "@/emitter";

export const PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME = "page:background-image:selected";
export interface PageBackgroundImageSelectedEvent extends EmitterEvent<number> {}

export const PAGE_SELECTED_EVENT_NAME = "page:selected";
export interface PageSelectedEvent extends EmitterEvent<number> {}
