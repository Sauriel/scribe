import { EmitterEvent } from "@/emitter";

export interface ModalConfig<T> {
  component: string;
  visible: boolean;
  fullscreen?: boolean;
  noMinWidth?: boolean;
  payload?: T;
}

export const CREATE_DOCUMENT_COMPONENT_TAG = "create-document";
export const OPEN_DOCUMENT_COMPONENT_TAG = "open-document";
export const SAVE_DOCUMENT_COMPONENT_TAG = "save-document";
export const SPREADSHEET_MODAL_COMPONENT_TAG = "spreadsheet-modal";
export const TIPTAP_MODAL_COMPONENT_TAG = "tiptap-modal";
export const ABOUT_US_COMPONENT_TAG = "about-modal";
export const GLOBAL_SETTINGS_COMPONENT_TAG = "settings-modal";
export const IMAGE_EXPORT_COMPONENT_TAG = "image-export-modal";
export const IMPORT_COMPONENT_TAG = "import-modal";
export const LOGIN_REGISTER_COMPONENT_TAG = "login-register-modal";
export const CHANGELOG_COMPONENT_TAG = "changelog-modal";
export const MODAL_UPDATE_EVENT_NAME = "modal:update";
export interface ModalUpdateEvent<T> extends EmitterEvent<ModalConfig<T>> {}
