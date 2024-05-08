<template>
  <div :class="scopedClass">
    <custom-css :style="model.customCss" :prefix="scopedClass" />
    <div class="dnd-spell" @click="$emit('element:selected', model)">
      <editable tag="header" class="spell-name" v-model="name" />
      <div class="spell-type">
        {{ spellType }}
      </div>
      <div class="spell-info">
        <strong class="spell-info--header">
          {{ $t("module.dandd.element.spell.info.casting-time.header") }}
        </strong>
        <span>
          {{ castingTime }}
        </span>
      </div>
      <div class="spell-info">
        <strong class="spell-info--header">
          {{ $t("module.dandd.element.spell.info.range.header") }}
        </strong>
        <span>
          {{ range }}
        </span>
      </div>
      <div class="spell-info">
        <strong class="spell-info--header">
          {{ $t("module.dandd.element.spell.info.components.header") }}
        </strong>
        <span>
          {{ components }}
        </span>
      </div>
      <div class="spell-info">
        <strong class="spell-info--header">
          {{ $t("module.dandd.element.spell.info.duration.header") }}
        </strong>
        <span>
          {{ duration }}
        </span>
      </div>
      <tip-tap v-model="text" inline class="spell-text" :defaults="defaults" :config="tipTapConfig"
        :historyConfig="tipTapHistoryDescriptionConfig" :locked="locked" :document="document" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from "vue-property-decorator";
import { getCurrentInstance } from "vue";
import HistoryManager, { HISTORY_MANAGER } from "@/history/HistoryManager";
import { LayoutElementModel } from "@/modules/ElementModel";
import DocumentModel from "@/models/document";
import DandDSpellElementModel, { dndSpellDefaults, DurationType, RangeType, SpellLevel } from "../DandDSpellElementModel";
import { TipTapHistoryConfig } from "@/components/app/ui/tiptap/TipTap.vue";
import { TipTapMenuConfig } from "@/components/app/ui/tiptap/menu/TipTapMenu.vue";
import { ChangeElementTextAction } from "@/history/page/element";

@Options({
  inject: [HISTORY_MANAGER],
})
export default class DandDSpellElement extends Vue {
  @Prop({ type: Object, required: true })
  public readonly model!: DandDSpellElementModel;

  @Prop({ type: Number, required: true })
  private readonly index!: number;

  @Prop({ type: Object, required: true })
  private readonly layout!: LayoutElementModel;

  @Prop({ type: Boolean, default: false })
  public readonly locked!: boolean;

  @Prop({ type: Object, required: true })
  public readonly document!: DocumentModel;

  private uid = 0;

  created() {
    const currentInstance = getCurrentInstance();
    this.uid = currentInstance ? currentInstance.uid : 0;
  }

  private get history(): HistoryManager {
    // @ts-ignore
    return this.historyManager;
  }

  public get scopedClass(): string {
    return "dnd-spell--" + this.uid;
  }

  public get spellType(): string {
    let messageKey;
    let type = this.$t("module.dandd.rules.spell.type." + this.model.type);
    if (this.model.level === SpellLevel.CANTRIP) {
      messageKey = "module.dandd.element.spell.type.cantrip";
    } else if (this.model.ritual) {
      messageKey = "module.dandd.element.spell.type.ritual";
      type = type.toLowerCase();
    } else {
      messageKey = "module.dandd.element.spell.type.default";
      type = type.toLowerCase();
    }
    const level = this.$t("module.dandd.rules.spell.level." + this.model.level)
    return this.$t(messageKey, { type, level });
  }

  public get castingTime(): string {
    const time = this.$t("module.dandd.element.spell.info.casting-time.time." + this.model.castingTime.type, this.model.castingTime.value);
    return time + (this.model.castingTime.addition || "");
  }

  public get range(): string {
    const range = this.$t("module.dandd.element.spell.info.range.distance." + this.model.range.unit, this.model.range.value);
    switch (this.model.range.type) {
      case RangeType.SELF:
        let selfRange = this.$t("module.dandd.element.spell.info.range.range.self");
        if (this.model.range.areaOfEffect) {
          selfRange += this.$t("module.dandd.element.spell.info.range.aoe." + this.model.range.areaOfEffect, { range: range.replace(" ", "-") })
        }
        return selfRange;
      case RangeType.SIGHT:
        return this.$t("module.dandd.element.spell.info.range.range.sight");
      case RangeType.TOUCH:
        return this.$t("module.dandd.element.spell.info.range.range.touch");
      case RangeType.SPECIAL:
        return this.$t("module.dandd.element.spell.info.range.range.special");
      case RangeType.UNLIMITED:
        return this.$t("module.dandd.element.spell.info.range.range.unlimited");
      case RangeType.DISTANCE:
      default:
        return range;
    }
  }

  public get components(): string {
    const componentArray: string[] = [];
    if (this.model.verbalComponent) {
      componentArray.push(this.$t("module.dandd.element.spell.info.components.verbal"));
    }
    if (this.model.somaticComponent) {
      componentArray.push(this.$t("module.dandd.element.spell.info.components.somatic"));
    }
    if (this.model.materialComponent) {
      let material = this.$t("module.dandd.element.spell.info.components.material");
      if (this.model.materialComponents.length > 0) {
        const components = this.model.materialComponents.join(", ");
        material += this.$t("module.dandd.element.spell.info.components.material-components", { components });
      }
      componentArray.push(material);
    }
    return componentArray.join(", ");
  }

  public get duration(): string {
    const durationArray: string[] = [];
    switch (this.model.duration.type) {
      case DurationType.INSTANTANEOUS:
        return this.$t("module.dandd.element.spell.info.duration.type.instantaneous");
      case DurationType.UNTIL_DISPELLED:
        return this.$t("module.dandd.element.spell.info.duration.type.untilDispelled");
      case DurationType.UNTIL_DISPELLED_OR_TRIGGERED:
        return this.$t("module.dandd.element.spell.info.duration.type.untilDispelledOrTriggered");
      case DurationType.VALUE:
        if (this.model.duration.concentration) {
          durationArray.push(this.$t("module.dandd.element.spell.info.duration.type.concentration"));
          if (this.model.duration.upTo) {
            durationArray.push(this.$t("module.dandd.element.spell.info.duration.type.upTo").toLowerCase());
          }
        } else {
          if (this.model.duration.upTo) {
            durationArray.push(this.$t("module.dandd.element.spell.info.duration.type.upTo"));
          }
        }
        durationArray.push(this.$t("module.dandd.element.spell.info.duration.duration." + this.model.duration.valueType, this.model.duration.value));
        break;
    }
    return durationArray.join(" ");
  }

  public get text(): string {
    return this.model.description;
  }

  public set text(value: string) {
    this.model.description = value;
  }

  public defaults = dndSpellDefaults;

  public readonly tipTapConfig: TipTapMenuConfig = [
    "OrderedList",
    "BulletList",
    "Bold",
    "Italic",
    "Underline",
    "Strike",
    "Color",
    "Link",
    "Align",
  ];

  public get tipTapHistoryDescriptionConfig(): TipTapHistoryConfig<DandDSpellElementModel> {
    return {
      object: this.model,
      set: (object, value) => (object.description = value),
      get: (object) => object.description,
    };
  }

  public get name(): string {
    return this.model.name;
  }

  public set name(value: string) {
    const action = new ChangeElementTextAction<DandDSpellElementModel>(
      this.model,
      (element) => element.name,
      (element, value) => (element.name = value || ""),
      this.model.name,
      value,
      "action.element.dandd.spell.name.change"
    );
    this.history.gracefulDo(action, "DandDSpellElementModel.name-" + this.uid);
  }
}
</script>

<style lang="scss">
@import "@/modules/dandd/fonts.scss";
@import "@/modules/dandd/colors.scss";

.dnd-spell {
  .spell-name {
    font-family: "Mr Eaves Small Caps";
    color: $darkRed;
    font-size: 12pt;
    font-weight: bold;
  }

  .spell-type {
    color: $black;
    font-family: "Book Insanity";
    font-size: 9pt;
    font-style: italic;
    margin-bottom: 0.5em;
  }

  .spell-info {
    color: $black;
    font-family: "Book Insanity";
    font-size: 9pt;
    
    .spell-info--header {
      margin-right: 0.5ch;
    }
  }
}
</style>
