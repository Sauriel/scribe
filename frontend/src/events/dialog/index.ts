import { EmitterEvent } from "@/emitter";

export interface DialogConfig<T> {
  component: string;
  visible: boolean;
  payload?: T;
}

export const CONFIRM_TAG = "confirm";
export const ADD_LINK_TAG = "add-link";
export const ADD_IMAGE_TAG = "add-image";
export const TYPOGR_TAG = "typogr";
export const IMAGE_INPUT_TAG = "image-input-dialog";
export const DIALOG_UPDATE_EVENT_NAME = "dialog:update";
export interface DialogUpdateEvent<T> extends EmitterEvent<DialogConfig<T>> {}
