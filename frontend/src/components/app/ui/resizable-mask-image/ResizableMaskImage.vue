<template>
  <div
    class="resize-container"
    :class="{ 'resize-container--disabled': disabled }"
    ref="resizeContainer"
    :style="containerStyle"
    v-click-outside="onClickOutside"
    @contextmenu.stop="null"
  >
    <span
      v-if="!disabled"
      class="resize-handle resize-handle-nw"
      @mousedown.prevent.stop="startResize($event, 'nw')"
    />
    <span
      v-if="!disabled"
      class="resize-handle resize-handle-ne"
      @mousedown.prevent.stop="startResize($event, 'ne')"
    />
    <img
      class="resize-image no-image-export"
      :style="imageStyle"
      :src="imageSrc"
      ref="imageElement"
      @mousedown.prevent.stop="startMoving"
    />
    <span
      v-if="!disabled"
      class="resize-handle resize-handle-se"
      @mousedown.prevent.stop="startResize($event, 'se')"
    />
    <span
      v-if="!disabled"
      class="resize-handle resize-handle-sw"
      @mousedown.prevent.stop="startResize($event, 'sw')"
    />
    <canvas class="canvas" :class="{ 'canvas--hide': inEditing }" ref="canvas" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Ref, Watch } from "vue-property-decorator";
import { PageFormat } from "@/models/document/pageFormat";
import BackgroundImage, { Position } from "@/models/document/images";
import emitter from "@/emitter";
import {
  PageBackgroundImageSelectedEvent,
  PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME,
} from "@/events/page";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreMutations } from "@/store/document/documentStoreMutations";
import { MASKS } from "@/models/document/masks";

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

declare type Handler = "nw" | "ne" | "se" | "sw";

interface EventState {
  containerWidth: number;
  containerHeight: number;
  containerLeft: number;
  containerTop: number;
  mouseX: number;
  mouseY: number;
  event?: MouseEvent | TouchEvent;
}

export interface ResizableMaskImageConfig {
  image: BackgroundImage;
  format: PageFormat;
}

export interface SimpleDOMRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class ResizableMaskImage extends Vue {
  @Prop({ type: Object, required: true })
  private readonly modelValue!: ResizableMaskImageConfig;

  @Prop({ required: true }) // added a type breaks this, because it is a template ref
  private readonly wrapperRect!: SimpleDOMRect;

  @Prop({ type: Number, default: 50 })
  private readonly minWidth!: number;

  @Prop({ type: Number, default: 50 })
  private readonly minHeight!: number;

  @Prop({ type: Number, default: 20000 })
  private readonly maxWidth!: number;

  @Prop({ type: Number, default: 20000 })
  private readonly maxHeight!: number;

  @Prop({ type: Boolean, default: false })
  private readonly disabled!: boolean;

  @Prop(Number)
  private readonly zoom!: number;

  @Ref()
  private readonly resizeContainer!: HTMLDivElement;

  @Ref()
  private readonly imageElement!: HTMLImageElement;

  @Ref()
  private readonly canvas!: HTMLCanvasElement;

  private imageName = "";

  @Watch("modelValue", { deep: true })
  private atModelChanged() {
    this.init();
  }

  private get imageSrc(): string {
    const imageSource = this.internalValue.image.imageSrc;
    return imageSource.url || imageSource.data || "";
  }

  created() {
    this.init();
  }

  mounted() {
    this.init();
  }

  private init() {
    if (this.imageName != this.internalValue.image.name) {
      this.imageName = this.internalValue.image.name;
      this.originalSource.crossOrigin = "anonymous";
      try {
        this.originalSource.src =
          this.internalValue.image.imageSrc.url || this.internalValue.image.imageSrc.data || "";
      } catch (e) {
        // console.error(e);
      }
    }
    this.drawCanvasVersion();
  }

  private get internalValue(): ResizableMaskImageConfig {
    return this.modelValue;
  }

  private set internalValue(value: ResizableMaskImageConfig) {
    this.$emit("update:modelValue", value);
  }

  private emitChange() {
    this.$emit("update:modelValue", this.internalValue);
  }

  private inEditing = false;
  private originalSource = new Image();
  private resizeCanvas = document.createElement("canvas");
  private selectedHandle?: Handler;
  private moveMouseStart: Position = {
    x: 0,
    y: 0,
  };
  private scaleMouseStart: Position = {
    x: 0,
    y: 0,
  };

  private get scale(): number {
    return this.zoom ? this.zoom / 100 : 1;
  }

  private get containerStyle(): Record<string, string> {
    const x = this.internalValue.image.position.x;
    const y = this.internalValue.image.position.y;
    return {
      //top: y + "px",
      //left: x + "px",
      transform: "translate(" + x + "px, " + y + "px)",
    };
  }

  private get imageStyle(): Record<string, string> {
    return {
      maskImage: "url(" + this.getMask(this.internalValue.image.maskId) + ")",
      maskSize:
        this.internalValue.format.width +
        this.internalValue.format.unit.suffix +
        " " +
        this.internalValue.format.height +
        this.internalValue.format.unit.suffix,
      maskPosition:
        "" +
        this.internalValue.image.position.x * -1 +
        "px " +
        this.internalValue.image.position.y * -1 +
        "px",
      width: this.internalValue.image.width + "px",
      height: this.internalValue.image.height + "px",
    };
  }

  private getMask(maskId: string): string {
    const mask = MASKS.flatMap((setting) => setting.masks).find((mask) => mask.id === maskId);
    if (mask) {
      return mask.src;
    }
    return MASKS[0].masks[0].src;
  }

  private getMouseMovement(from: Position, to: Position): Position {
    return {
      x: (to.x - from.x) / this.scale,
      y: (to.y - from.y) / this.scale,
    };
  }

  private saveMouseMovePosition(event: MouseEvent) {
    this.moveMouseStart.x = event.clientX || event.pageX;
    this.moveMouseStart.y = event.clientY || event.pageY;
  }

  private resetMouseMovePosition() {
    this.moveMouseStart.x = 0;
    this.moveMouseStart.y = 0;
  }

  private getMousePosition(event: MouseEvent | TouchEvent): Position {
    return {
      // @ts-ignore
      x: event.clientX || event.pageX || event.originalEvent.touches[0].clientX,
      // @ts-ignore
      y: event.clientY || event.pageY || event.originalEvent.touches[0].clientY,
    };
  }

  private saveMouseScalePosition(position: Position) {
    this.scaleMouseStart.x = position.x;
    this.scaleMouseStart.y = position.y;
  }

  private resetMouseScalePosition() {
    this.scaleMouseStart.x = 0;
    this.scaleMouseStart.y = 0;
  }

  private startResize(event: MouseEvent | TouchEvent, handler: Handler) {
    this.clearCanvasVersion();
    this.inEditing = true;
    this.saveMouseScalePosition(this.getMousePosition(event));
    this.selectedHandle = handler;
    document.addEventListener("mousemove", this.resizing);
    document.addEventListener("mouseup", this.endResize);
  }

  private endResize(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.resizeImage();
    this.drawCanvasVersion();
    this.selectedHandle = undefined;
    this.resetMouseScalePosition();
    document.removeEventListener("mouseup", this.endResize);
    document.removeEventListener("touchend", this.endResize);
    document.removeEventListener("mousemove", this.resizing);
    document.removeEventListener("touchmove", this.resizing);
    setTimeout(() => (this.inEditing = false), 1000);
    this.emitChange();
  }

  private getResizeContainerPosition(): Position {
    const translates = this.resizeContainer.style.transform.match(/[-]?\d+[.]?\d*/g);
    if (translates && translates.length === 2) {
      return {
        x: parseFloat(translates[0]),
        y: parseFloat(translates[1]),
      };
    } else {
      return {
        x: 0,
        y: 0,
      };
    }
  }

  private resizing(event: MouseEvent | TouchEvent) {
    const mouse = this.getMousePosition(event);
    const containerPosition = this.getResizeContainerPosition();
    const elementRect: SimpleDOMRect = {
      x: containerPosition.x,
      y: containerPosition.y,
      width: this.resizeContainer.getBoundingClientRect().width / this.scale,
      height: this.resizeContainer.getBoundingClientRect().height / this.scale,
    };
    const mouseMovement = this.getMouseMovement(this.scaleMouseStart, mouse);
    const heightRatio = (1 / elementRect.width) * elementRect.height;

    switch (this.selectedHandle) {
      case "nw": {
        // top left
        elementRect.x += mouseMovement.x;
        elementRect.width -= mouseMovement.x;
        let newHeight = elementRect.width * heightRatio;
        elementRect.y += elementRect.height - newHeight;
        elementRect.height = newHeight;
        break;
      }
      case "ne": {
        // top right
        elementRect.width += mouseMovement.x;
        let newHeight = elementRect.width * heightRatio;
        elementRect.y += elementRect.height - newHeight;
        elementRect.height = newHeight;
        break;
      }
      case "sw": {
        // bottom left
        elementRect.x += mouseMovement.x;
        elementRect.width -= mouseMovement.x;
        elementRect.height = elementRect.width * heightRatio;
        break;
      }
      case "se": {
        // bottom right
        elementRect.width += mouseMovement.x;
        elementRect.height = elementRect.width * heightRatio;
        break;
      }
    }

    if (
      elementRect.width > this.minWidth &&
      elementRect.height > this.minHeight &&
      elementRect.width < this.maxWidth &&
      elementRect.height < this.maxHeight
    ) {
      this.internalValue.image.position.x = elementRect.x;
      this.internalValue.image.position.y = elementRect.y;
      this.internalValue.image.width = elementRect.width;
      this.internalValue.image.height = elementRect.height;
      this.saveMouseScalePosition(mouse);
    }
  }

  private resizeImage() {
    this.resizeCanvas.width = this.internalValue.image.width;
    this.resizeCanvas.height = this.internalValue.image.height;
    const context = this.resizeCanvas.getContext("2d");
    if (context) {
      try {
        context.drawImage(
          this.originalSource,
          0,
          0,
          this.internalValue.image.width,
          this.internalValue.image.height
        );
        this.imageElement.src = this.resizeCanvas.toDataURL("image/png");
      } catch (e) {
        // console.error(e);
      }
    }
  }

  private startMoving(event: MouseEvent) {
    this.clearCanvasVersion();
    this.saveMouseMovePosition(event);
    document.addEventListener("mouseup", this.endMoving);
    document.addEventListener("mousemove", this.moving);
  }

  private endMoving(event: MouseEvent) {
    this.drawCanvasVersion();
    this.resetMouseMovePosition();
    document.removeEventListener("mouseup", this.endMoving);
    document.removeEventListener("mousemove", this.moving);
    this.emitChange();
  }

  private moving(event: MouseEvent) {
    const mouse = this.getMousePosition(event);
    const mouseMovement = this.getMouseMovement(this.moveMouseStart, mouse);
    const newImageX = this.internalValue.image.position.x + mouseMovement.x;
    const newImageY = this.internalValue.image.position.y + mouseMovement.y;
    this.saveMouseMovePosition(event);
    this.internalValue.image.position.x = newImageX;
    this.internalValue.image.position.y = newImageY;
  }

  private onClickOutside() {
    if (!this.disabled && !this.inEditing) {
      const event: PageBackgroundImageSelectedEvent = {
        name: PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME,
        payload: -1,
      };
      emitter.$emit(PAGE_BACKGROUND_IMAGE_SELECTED_EVENT_NAME, event);
      documentStore.commit(DocumentStoreMutations.SET_SELECTED_BACKGROUND_IMAGE, undefined);
    }
  }

  private clearCanvasVersion() {
    const context = this.canvas.getContext("2d");
    context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawCanvasVersion() {
    this.createMaskCanvas().then((maskCanvas) => {
      const image = this.getImageCanvas();
      const mask = this.changeCanvasSize(maskCanvas, image.width, image.height);
      this.substractCanvasMask(image, mask);
      const context = this.canvas.getContext("2d");
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      context?.drawImage(image, 0, 0, image.width, image.height);
    });
  }

  private changeCanvasSize(
    image: HTMLCanvasElement,
    width: number,
    height: number
  ): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context?.drawImage(image, 0, 0, width, height, 0, 0, width, height);
    return canvas;
  }

  private moveCanvas(canvas: HTMLCanvasElement, x: number, y: number) {
    const context = canvas.getContext("2d");
    if (context) {
      // get image:
      const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
      // now clear everything:
      context?.clearRect(0, 0, canvas.width, canvas.height);
      // shift everything to the left:
      context.canvas.width = context.canvas.width + x;
      context.putImageData(imageData, x, y);
    }
  }

  private getImageCanvas(): HTMLCanvasElement {
    if (this.isCanvasBlank(this.resizeCanvas)) {
      const canvas = document.createElement("canvas");
      canvas.width = this.internalValue.image.width;
      canvas.height = this.internalValue.image.height;
      const context = canvas.getContext("2d");
      context?.drawImage(
        this.originalSource,
        0,
        0,
        this.internalValue.image.width,
        this.internalValue.image.height
      );
      return canvas;
    } else {
      return this.resizeCanvas;
    }
  }

  private isCanvasBlank(canvas: HTMLCanvasElement): boolean {
    const context = canvas.getContext("2d");
    const pixelBuffer = new Uint32Array(
      context?.getImageData(0, 0, canvas.width, canvas.height).data.buffer || []
    );
    return !pixelBuffer.some((color) => color !== 0);
  }

  private createMaskCanvas(): Promise<HTMLCanvasElement> {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    return this.createImage(this.getMask(this.internalValue.image.maskId)).then((image) => {
      const pageHeight =
        this.internalValue.format.height * this.internalValue.format.unit.pixelPerUnit;
      const pageWidth =
        this.internalValue.format.width * this.internalValue.format.unit.pixelPerUnit;
      canvas.height = pageHeight;
      canvas.width = pageWidth;
      context?.drawImage(image, 0, 0, pageWidth, pageHeight);
      const moveX = this.internalValue.image.position.x * -1;
      const moveY = this.internalValue.image.position.y * -1;
      this.moveCanvas(canvas, moveX, moveY);
      return canvas;
    });
  }

  private createImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  private substractCanvasMask(image: HTMLCanvasElement, mask: HTMLCanvasElement) {
    const imageData = image.getContext("2d")?.getImageData(0, 0, image.width, image.height);
    if (imageData) {
      const imagePixel = imageData.data; // rgba[] 0-255
      const maskPixel =
        mask.getContext("2d")?.getImageData(0, 0, mask.width, mask.height).data ||
        new Uint8ClampedArray(0); // rgba[] 0-255
      if (imagePixel.length === maskPixel.length) {
        for (let i = 3; i < imagePixel.length; i += 4) {
          // start at 3 because (r, g, b, a) and then every fourth entry is alpha
          imagePixel[i] = maskPixel[i];
        }
        image.getContext("2d")?.putImageData(imageData, 0, 0);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.resize-container {
  position: relative;
  display: inline-block;
  cursor: move;
  margin: 0 auto;
  outline: 2px dashed var(--color-primary);

  .resize-image {
    display: block;
    mask-repeat: no-repeat;

    & + .canvas {
      display: none;
    }
  }

  .canvas {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;

    &--hide {
      display: none;
    }
  }

  &--disabled {
    outline: none;
    cursor: default;
    user-select: none;
    pointer-events: none;

    .resize-image {
      pointer-events: none;
    }
  }
}

.resize-handle-ne,
.resize-handle-ne,
.resize-handle-se,
.resize-handle-nw,
.resize-handle-sw {
  position: absolute;
  display: block;
  width: 10px;
  height: 10px;
  border-radius: calc(var(--border-radius) / 2);
  background-color: var(--color-primary);
  z-index: 999;
}

.resize-handle-nw {
  top: -5px;
  left: -5px;
  cursor: nw-resize;
}

.resize-handle-sw {
  bottom: -5px;
  left: -5px;
  cursor: sw-resize;
}

.resize-handle-ne {
  top: -5px;
  right: -5px;
  cursor: ne-resize;
}

.resize-handle-se {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}
</style>
