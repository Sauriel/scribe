import { LayoutElementModel } from "@/modules/ElementModel";
import VerticalLayoutElementModel, {
  create as createVerticalLayoutElementModel,
} from "@/modules/default/elements/vertical/VerticalLayoutElementModel";
import DocumentModel from "@/models/document";
import { DialogUpdateEvent, DIALOG_UPDATE_EVENT_NAME } from "@/events/dialog";
import emitter from "@/emitter";
// @ts-ignore
import {
  AddHorizontalLayoutPayload,
  ADD_HORIZONTAL_LAYOUT_TAG,
} from "@/modules/default/elements/horizontal/element/dialog/AddHorizontalLayoutDialogContent.vue";

export interface HorizontalLayoutElementColumnModel extends VerticalLayoutElementModel {
  width: number;
}

export default interface HorizontalLayoutElementModel extends LayoutElementModel {
  elements: HorizontalLayoutElementColumnModel[];
  gutter: number;
}

export interface HorizontalLayoutConfig {
  width: number;
}

export function create(
  document: DocumentModel,
  config: HorizontalLayoutConfig[] = [{ width: 50 }, { width: 50 }]
): HorizontalLayoutElementModel {
  const elements: HorizontalLayoutElementColumnModel[] = [];
  for (const conf of config) {
    elements.push({
      ...createVerticalLayoutElementModel(document),
      width: conf.width,
    });
  }
  return {
    component: "HorizontalLayoutElement",
    elements: elements,
    gutter: 32,
  };
}

export function callbackCreate(
  document: DocumentModel,
  callback: (model: HorizontalLayoutElementModel) => void,
  layout?: LayoutElementModel
) {
  const model: HorizontalLayoutElementModel = {
    component: "HorizontalLayoutElement",
    elements: [],
    gutter: 32,
  };
  const event: DialogUpdateEvent<AddHorizontalLayoutPayload> = {
    name: DIALOG_UPDATE_EVENT_NAME,
    payload: {
      component: ADD_HORIZONTAL_LAYOUT_TAG,
      visible: true,
      payload: {
        document: document,
        model: model,
        callback: callback,
      },
    },
  };
  emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
}
