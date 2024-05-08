import { Action, HistoryContext } from "@/history/HistoryManager";
import BackgroundImage from "@/models/document/images";
import emitter from "@/emitter";
import {
  PageBackgroundImageSelectedEvent,
  PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME,
} from "@/events/page";
import { cloneDeep, isEqual, assign } from "lodash";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";
import { SelectedBackground } from "@/models/document/backgrounds";
import { ImageSource } from "@/models/";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);
export class AddPageBackgroundImageAction implements Action {
  public readonly baseMessageKey = "action.page.background-image.add";

  constructor(
    public readonly pageId: number,
    public readonly imageName: string,
    public readonly imageSrc: ImageSource,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {}

  public revert(context: HistoryContext): boolean {
    const backgroundImageCount = context.document.pages[this.pageId].backgroundImages.length;
    if (backgroundImageCount === this.newValue) {
      context.document.pages[this.pageId].backgroundImages.splice(backgroundImageCount - 1, 1);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    const backgroundImages = context.document.pages[this.pageId].backgroundImages;
    if (backgroundImages.length === this.originalValue) {
      const imagesWithSameName = backgroundImages.filter((image) => image.name === this.imageName);
      const name =
        imagesWithSameName.length === 0
          ? this.imageName
          : this.imageName + "(" + (imagesWithSameName.length + 1) + ")";
      const image: BackgroundImage = {
        name: name,
        // @ts-ignore
        imageSrc: this.imageSrc,
        maskId: "default-1",
        width: 0,
        height: 0,
        position: {
          x: 0,
          y: 0,
        },
      };
      const imageElement = new Image();
      imageElement.src = this.imageSrc.url || this.imageSrc.data || "";
      imageElement.onload = () => {
        image.width = imageElement.width;
        image.height = imageElement.height;
        const newIndex = context.document.pages[this.pageId].backgroundImages.push(image) - 1;
        const event: PageBackgroundImageSelectedEvent = {
          name: PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME,
          payload: newIndex,
        };
        emitter.$lateEmit(PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME, event);
        setTimeout(() => {
          const selected: SelectedBackground = {
            page: this.pageId,
            index: newIndex,
          };
          documentStore.commit(DocumentStoreMutations.SET_SELECTED_BACKGROUND_IMAGE, selected);
        }, 100);
      };
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class RemovePageBackgroundImageAction implements Action {
  public readonly baseMessageKey = "action.page.background-image.remove";
  private readonly image: BackgroundImage;

  constructor(
    public readonly pageId: number,
    public readonly imageId: number,
    image: BackgroundImage,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {
    this.image = cloneDeep(image);
  }

  public revert(context: HistoryContext): boolean {
    if (context.document.pages[this.pageId].backgroundImages.length === this.newValue) {
      context.document.pages[this.pageId].backgroundImages.splice(this.imageId, 0, this.image);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    if (context.document.pages[this.pageId].backgroundImages.length === this.originalValue) {
      context.document.pages[this.pageId].backgroundImages.splice(this.imageId, 1);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangePageBackgroundImageAction implements Action {
  public readonly baseMessageKey = "action.page.background-image.change";
  public readonly originalValue: BackgroundImage;
  public readonly newValue: BackgroundImage;

  constructor(
    public readonly pageId: number,
    public readonly imageId: number,
    originalValue: BackgroundImage,
    newValue: BackgroundImage
  ) {
    this.originalValue = cloneDeep(originalValue);
    this.newValue = cloneDeep(newValue);
  }

  public revert(context: HistoryContext): boolean {
    const image = context.document.pages[this.pageId].backgroundImages[this.imageId];
    if (isEqual(image, this.newValue)) {
      assign(image, this.originalValue);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    const image = context.document.pages[this.pageId].backgroundImages[this.imageId];
    if (isEqual(image, this.originalValue)) {
      assign(image, this.newValue);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class ChangePageBackgroundImageOrderAction implements Action {
  public readonly baseMessageKey = "action.page.background-image.order";
  public readonly image: BackgroundImage;

  constructor(
    public readonly pageId: number,
    public readonly originalValue: number,
    public readonly newValue: number,
    image: BackgroundImage
  ) {
    this.image = cloneDeep(image);
  }

  public revert(context: HistoryContext): boolean {
    const page = context.document.pages[this.pageId];
    const imageFromIndex = page.backgroundImages[this.newValue];
    if (isEqual(imageFromIndex, this.image)) {
      page.backgroundImages.splice(this.newValue, 1); // delete from: newValue
      page.backgroundImages.splice(this.originalValue, 0, imageFromIndex); // insert into: originalValue
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    const page = context.document.pages[this.pageId];
    const imageFromIndex = page.backgroundImages[this.originalValue];
    if (isEqual(imageFromIndex, this.image)) {
      page.backgroundImages.splice(this.originalValue, 1); // delete from: originalValue
      page.backgroundImages.splice(this.newValue, 0, imageFromIndex); // insert into: newValue
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}

export class DuplicatePageBackgroundImageAction implements Action {
  public readonly baseMessageKey = "action.page.background-image.duplicate";
  public readonly image: BackgroundImage;

  constructor(
    public readonly pageId: number,
    image: BackgroundImage,
    public readonly originalValue: number,
    public readonly newValue: number
  ) {
    this.image = cloneDeep(image);
  }

  public revert(context: HistoryContext): boolean {
    const backgroundImageCount = context.document.pages[this.pageId].backgroundImages.length;
    if (backgroundImageCount === this.newValue) {
      context.document.pages[this.pageId].backgroundImages.splice(backgroundImageCount - 1, 1);
      return true;
    }
    console.error("Could not revert action", this, cloneDeep(context));
    return false;
  }

  public apply(context: HistoryContext): boolean {
    const backgroundImages = context.document.pages[this.pageId].backgroundImages;
    if (backgroundImages.length === this.originalValue) {
      const imagesWithSameName = backgroundImages.filter((image) => image.name === this.image.name);
      const name =
        imagesWithSameName.length === 0
          ? this.image.name
          : this.image.name + "(" + (imagesWithSameName.length + 1) + ")";
      const image: BackgroundImage = cloneDeep(this.image);
      image.name = name;
      const newIndex = context.document.pages[this.pageId].backgroundImages.push(image) - 1;
      const event: PageBackgroundImageSelectedEvent = {
        name: PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME,
        payload: newIndex,
      };
      emitter.$lateEmit(PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME, event);
      setTimeout(() => {
        const selected: SelectedBackground = {
          page: this.pageId,
          index: newIndex,
        };
        documentStore.commit(DocumentStoreMutations.SET_SELECTED_BACKGROUND_IMAGE, selected);
      }, 100);
      return true;
    }
    console.error("Could not apply action", this, cloneDeep(context));
    return false;
  }
}
