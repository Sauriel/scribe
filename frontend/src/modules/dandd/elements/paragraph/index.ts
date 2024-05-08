import emitter from "@/emitter";
import {
  ModalUpdateEvent,
  MODAL_UPDATE_EVENT_NAME,
  TIPTAP_MODAL_COMPONENT_TAG,
} from "@/events/modal";
import DandDParagraphElementModel, { dndParagraphDefaults } from "@/modules/dandd/elements/paragraph/DandDParagraphElementModel";
// @ts-ignore
import { TipTapHistoryConfig, TipTapModalPayload } from "@/components/app/ui/tiptap/TipTap.vue";

export const openDandDParagraphEditFn = (element: DandDParagraphElementModel) => {
  const tipTapHistoryConfig: TipTapHistoryConfig<DandDParagraphElementModel> = {
    object: element,
    set: (object: DandDParagraphElementModel, value: string) => (object.value = value),
    get: (object: DandDParagraphElementModel) => object.value,
  };

  const event: ModalUpdateEvent<TipTapModalPayload<DandDParagraphElementModel>> = {
    name: MODAL_UPDATE_EVENT_NAME,
    payload: {
      component: TIPTAP_MODAL_COMPONENT_TAG,
      visible: true,
      payload: {
        config: tipTapHistoryConfig,
        defaults: dndParagraphDefaults,
      },
      fullscreen: true,
    },
  };
  emitter.$emit(MODAL_UPDATE_EVENT_NAME, event);
};
