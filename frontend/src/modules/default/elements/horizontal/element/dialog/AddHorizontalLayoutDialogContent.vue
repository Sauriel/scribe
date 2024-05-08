<template>
  <div class="add-horizontal-layout">
    <heading>{{ $t("add-horizontal-layout.header") }}</heading>
    <div class="layouts">
      <div
        v-for="(layout, index) of layouts"
        :key="'lay-' + index"
        class="layout"
        @click="apply(layout)"
      >
        <div
          v-for="(col, cIndex) of layout.config"
          :key="'lc-' + cIndex"
          class="col"
          :style="colStyle(col)"
        >
          <div class="col-content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Options } from "vue-property-decorator";
import HorizontalLayoutElementModel, {
  HorizontalLayoutConfig,
} from "@/modules/default/elements/horizontal/HorizontalLayoutElementModel";
import { create as createVerticalLayoutElementModel } from "@/modules/default/elements/vertical/VerticalLayoutElementModel";
import DocumentModel from "@/models/document";

export const ADD_HORIZONTAL_LAYOUT_TAG = "add-horizontal-layout";

export interface AddHorizontalLayoutPayload {
  document: DocumentModel;
  model: HorizontalLayoutElementModel;
  callback: (model: HorizontalLayoutElementModel) => void;
}

interface HoriontalLayout {
  config: HorizontalLayoutConfig[];
}

const createLayout = (widths: number[]): HoriontalLayout => {
  const layout: HoriontalLayout = { config: [] };
  for (const width of widths) {
    layout.config.push({ width: width });
  }
  return layout;
};

@Options({
  emits: ["close"],
})
export default class AddHorizontalLayoutDialogContent extends Vue {
  @Prop({ type: Object, required: true })
  private readonly payload!: AddHorizontalLayoutPayload;

  private layouts: HoriontalLayout[] = [
    createLayout([50, 50]),
    createLayout([33.3333, 33.3333, 33.3333]),
    createLayout([25, 25, 25, 25]),
    createLayout([33.3333, 66.6666]),
    createLayout([66.6666, 33.3333]),
    createLayout([25, 25, 50]),
    createLayout([50, 25, 25]),
    createLayout([25, 50, 25]),
    createLayout([20, 20, 20, 20, 20]),
  ];

  private colStyle(col: HorizontalLayoutConfig): Record<string, string> {
    return {
      width: col.width + "%",
    };
  }

  private apply(layout: HoriontalLayout) {
    for (const conf of layout.config) {
      this.payload.model.elements.push({
        ...createVerticalLayoutElementModel(this.payload.document),
        width: conf.width,
      });
    }
    this.payload.callback(this.payload.model);
    this.$emit("close");
  }
}
</script>

<style lang="scss" scoped>
.add-horizontal-layout {
  max-width: 460px;

  .layouts {
    display: flex;
    flex-wrap: wrap;
    margin: -0.5rem;
    justify-content: center;
    align-items: center;

    .layout {
      height: 80px;
      width: 140px;
      background-color: var(--color-background--light);
      display: flex;
      margin: 0.5rem;
      opacity: 0.5;
      cursor: pointer;

      .col {
        height: 100%;
        flex: 0 0 auto;
        padding: 0.5rem;

        &-content {
          background-color: var(--color-foreground);
          height: 100%;
        }
      }

      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
