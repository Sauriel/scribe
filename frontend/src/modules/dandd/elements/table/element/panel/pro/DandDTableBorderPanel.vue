<script lang="ts">
import { ImageSelectPayload } from "@/components/app/dialog/image/select/ImageSelectDialogContent.vue";
import { ContextMenuEntry, SEPERATOR, ContextMenuConfig } from "@/components/app/ui/context-menu/ContextMenu.vue";
import { ImageInputImage } from "@/components/app/ui/image-input/ImageInput.vue";
import emitter from "@/emitter";
import { ContextMenuShowEvent, CONTEXT_MENU_SHOW_EVENT_NAME } from "@/events/contextmenu";
import { DialogUpdateEvent, DIALOG_UPDATE_EVENT_NAME, IMAGE_INPUT_TAG } from "@/events/dialog";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { getCurrentInstance } from "vue";
import { Vue, Prop, Options } from "vue-property-decorator";
import DandDTableElementModel, { DandDTableBorderImage, DEFAULT_BORDER_IMAGE } from "../../../DandDTableElementModel";
import { ChangeDandDTableBorderAction } from "../../../historyAction";

@Options({
  inject: [HISTORY_MANAGER]
})
export default class DandDTableBorderPanel extends Vue {
  @Prop(Object)
  private readonly element!: DandDTableElementModel;

  private uid = 0;

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private get borderImage(): DandDTableBorderImage {
    if (!this.element.borderImage) {
      this.element.borderImage = {
        ...DEFAULT_BORDER_IMAGE
      };
    }
    return this.element.borderImage;
  };

  private set borderImage(value: DandDTableBorderImage) {
    const action = new ChangeDandDTableBorderAction(
      this.element,
      this.element.borderImage,
      value
    );
    this.history.do(action);
  }

  private setBorderImage(position: string, src: string | undefined) {
    const newBorderImage = {
      ...this.borderImage
    };
    (newBorderImage as Record<string, string | undefined>)[position] = src;
    this.borderImage = newBorderImage;
  }

  private changeImage(position: string, src: string) {
    const isDefault = src === (DEFAULT_BORDER_IMAGE as Record<string, string>)[position];
    if (isDefault) {
      this.openAddImageDialog(position);
    } else {
      this.openEditImageDialog(position, src);
    }
  }

  private openAddImageDialog(position: string) {
    const event: DialogUpdateEvent<ImageSelectPayload> = {
      name: DIALOG_UPDATE_EVENT_NAME,
      payload: {
        component: IMAGE_INPUT_TAG,
        visible: true,
        payload: {
          image: {
            src: {},
            name: "",
            width: 0,
            height: 0,
          },
          callback: (image: ImageInputImage) => this.setBorderImage(position, image.src.url || image.src.data),
        },
      },
    };
    emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
  }

  private openEditImageDialog(position: string, src: string) {
    const event: DialogUpdateEvent<ImageSelectPayload> = {
      name: DIALOG_UPDATE_EVENT_NAME,
      payload: {
        component: IMAGE_INPUT_TAG,
        visible: true,
        payload: {
          image: {
            src: {
              url: src
            },
            name: position,
            width: 0,
            height: 0,
          },
          callback: (image: ImageInputImage) => this.setBorderImage(position, image.src.url || image.src.data),
        },
      },
    };
    emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
  }

  private showContextMenu($event: MouseEvent, position: string) {
    const contextMenuEntries: ContextMenuEntry[] = [
      SEPERATOR("panel.DandDTableElementPanel.border-images.context.header"),
      {
        label: "panel.DandDTableElementPanel.border-images.context.reset",
        icon: "undo-alt",
        action: () => this.setBorderImage(position, (DEFAULT_BORDER_IMAGE as Record<string, string>)[position])
      },
      {
        label: "panel.DandDTableElementPanel.border-images.context.delete",
        icon: "trash-alt",
        action: () => this.setBorderImage(position, undefined)
      }
    ];
    const payload: ContextMenuConfig = {
      entries: contextMenuEntries,
      noWrap: true,
      mousePosition: {
        x: $event.x,
        y: $event.y,
      },
    };
    const event: ContextMenuShowEvent = {
      name: CONTEXT_MENU_SHOW_EVENT_NAME,
      payload: payload,
    };
    emitter.$emit(CONTEXT_MENU_SHOW_EVENT_NAME, event);
  }
}
</script>

<template src="@/modules/dandd/elements/table/element/panel/pro/dandd-table-border-panel.template.html" />
<style src="@/modules/dandd/elements/table/element/panel/pro/dandd-table-border-panel.style.scss" lang="scss" scoped />