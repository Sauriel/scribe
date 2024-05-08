<template>
  <div class="vertical-spacing" :style="style" @click="$emit('element:selected', model)">
    <div class="vertical-spacing-handle" @mousedown.prevent.stop="startResize" v-if="!locked" />
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import DocumentModel from "@/models/document";
import { Unit } from "@/models/document/pageFormat";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import VerticalSpacingElementModel from "@/modules/default/elements/spacing/VerticalSpacingElementModel";
import { LayoutElementModel } from "@/modules/ElementModel";
import { Position } from "@/models/document/images";
import { ChangeVerticalSpacingHeightAction } from "@/modules/default/elements/spacing/historyActions";

const documentStorage = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  inject: [HISTORY_MANAGER],
})
export default class VerticalSpacingElement extends Vue {
  @Prop({ type: Object, required: true })
  private readonly model!: VerticalSpacingElementModel;

  @Prop({ type: Number, required: true })
  private readonly index!: number;

  @Prop({ type: Object, required: true })
  private readonly layout!: LayoutElementModel;

  @Prop({ type: Boolean, default: false })
  private readonly locked!: boolean;

  @Prop({ type: Object, required: true })
  private readonly document!: DocumentModel;

  private originalHeight = 0;
  private scaleMouseStart: Position = {
    x: 0,
    y: 0,
  };

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get unit(): Unit {
    return this.document.format.unit;
  }

  private get height(): number {
    return Math.floor((this.model.height / this.unit.pixelPerUnit) * 100) / 100;
  }

  private set height(value: number) {
    this.model.height = value * this.unit.pixelPerUnit;
  }

  private get style(): Record<string, string> {
    return {
      height: this.height + this.unit.suffix,
    };
  }

  private getMousePosition(event: MouseEvent | TouchEvent): Position {
    return {
      // @ts-ignore
      x: event.clientX || event.pageX || event.originalEvent.touches[0].clientX,
      // @ts-ignore
      y: event.clientY || event.pageY || event.originalEvent.touches[0].clientY,
    };
  }

  private get scale(): number {
    const zoom = documentStorage.getters(DocumentStoreGetters.DOCUMENT_ZOOM);
    return zoom ? zoom / 100 : 1;
  }

  private getMouseMovement(from: Position, to: Position): Position {
    return {
      x: (to.x - from.x) / this.scale,
      y: (to.y - from.y) / this.scale,
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

  private startResize(event: MouseEvent | TouchEvent) {
    this.originalHeight = this.model.height;
    this.saveMouseScalePosition(this.getMousePosition(event));
    document.addEventListener("mousemove", this.resizing);
    document.addEventListener("mouseup", this.endResize);
  }

  private endResize(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    const newHeight = this.model.height;
    this.model.height = this.originalHeight;
    const action = new ChangeVerticalSpacingHeightAction(
      this.model,
      this.originalHeight,
      newHeight
    );
    this.history.do(action);
    this.resetMouseScalePosition();
    document.removeEventListener("mouseup", this.endResize);
    document.removeEventListener("touchend", this.endResize);
    document.removeEventListener("mousemove", this.resizing);
    document.removeEventListener("touchmove", this.resizing);
  }

  private resizing(event: MouseEvent | TouchEvent) {
    const mouse = this.getMousePosition(event);
    const heightChange = this.getMouseMovement(this.scaleMouseStart, mouse).y;
    const newHeight = this.model.height + heightChange;
    if (newHeight > 0) {
      this.model.height = newHeight;
      this.saveMouseScalePosition(mouse);
    }
  }
}
</script>

<style lang="scss" scoped>
.vertical-spacing:hover {
  position: relative;

  .vertical-spacing-handle {
    position: absolute;
    bottom: 2px;
    width: 100%;
    height: 4px;
    cursor: row-resize;

    @media print {
      display: none;
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: calc(50% - 15px);
      background-color: var(--color-primary);
      width: 30px;
      height: 1px;
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: calc(50% - 15px);
      background-color: var(--color-primary);
      width: 30px;
      height: 1px;
    }
  }
}
</style>
