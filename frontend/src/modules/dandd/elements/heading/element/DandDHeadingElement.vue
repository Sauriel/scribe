<template>
  <div :class="scopedClass">
    <custom-css :style="model.customCss" :prefix="scopedClass" />
    <editable
      :tag="tag"
      v-model="value"
      class="dnd-heading"
      @focus="$emit('element:selected', model)"
    >
      <dropdown v-model="level" :items="levels" />
    </editable>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import { getCurrentInstance } from "vue";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import DandDHeadingElementModel, {
  HeadingLevel,
} from "@/modules/dandd/elements/heading/DandDHeadingElementModel";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import { LayoutElementModel } from "@/modules/ElementModel";
import { ChangeElementTextAction } from "@/history/page/element";
import { ChangeDandDHeadingLevelTextAction } from "@/modules/dandd/elements/heading/historyActions";
import DocumentModel from "@/models/document";

@Options({
  inject: [HISTORY_MANAGER],
})
export default class DandDHeadingElement extends Vue {
  @Prop({ type: Object, required: true })
  private readonly model!: DandDHeadingElementModel;

  @Prop({ type: Number, required: true })
  private readonly index!: number;

  @Prop({ type: Object, required: true })
  private readonly layout!: LayoutElementModel;

  @Prop({ type: Boolean, default: false })
  private readonly locked!: boolean;

  @Prop({ type: Object, required: true })
  private readonly document!: DocumentModel;

  private uid = 0;

  private get tag(): string {
    return "h" + this.model.level;
  }

  private get value(): string {
    return this.model.value;
  }

  private set value(value: string) {
    const action = new ChangeElementTextAction<DandDHeadingElementModel>(
      this.model,
      (element) => element.value,
      (element, value) => (element.value = value || ""),
      this.model.value,
      value,
      "action.element.dandd.heading.text.change"
    );
    this.history.gracefulDo(action, "DandDHeadingElementModel.value-" + this.uid);
  }

  private get level(): HeadingLevel {
    return this.model.level;
  }

  private set level(value: HeadingLevel) {
    const action = new ChangeDandDHeadingLevelTextAction(this.model, this.model.level, value);
    this.history.do(action);
  }

  private get levels(): DropdownItem[] {
    return [
      {
        name: "H1",
        value: 1,
      },
      {
        name: "H2",
        value: 2,
      },
      {
        name: "H3",
        value: 3,
      },
      {
        name: "H4",
        value: 4,
      },
      {
        name: "H5",
        value: 5,
      },
    ];
  }

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  private get scopedClass(): string {
    return "dnd-heading--" + this.uid;
  }
}
</script>

<style lang="scss">
@import "@/modules/dandd/fonts.scss";
@import "@/modules/dandd/colors.scss";
@import "@/styles/mixins.scss";

.dnd-heading {
  font-family: "Mr Eaves Small Caps";
  color: $darkRed;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
}

h1.dnd-heading {
  font-size: 24pt;
  //@include stroke(2, $lightGray);
}

h2.dnd-heading {
  font-size: 20pt;
}

h3.dnd-heading {
  font-size: 15pt;
  border-bottom: 2px solid $gold;
}

h4.dnd-heading {
  margin-bottom: 0;
  font-size: 12pt;
}

h5.dnd-heading {
  font-family: "Scaly Sans Caps";
  font-weight: bold;
  font-size: 10pt;
  color: $black;
  margin-top: 0;
  margin-bottom: 0.2em;
}
</style>
