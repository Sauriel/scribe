<template>
  <div class="page-format-selector">
    <select-bar round shadow-border alternate-colors v-model="format" :items="pageFormats" />
    <div class="document-orientation">
      <input-switch v-model="portrait" :disabled="pageOrientation == 'square'">
        <span class="orientation" :class="pageOrientation">
          <font-awesome-icon :icon="pageOrientation == 'square' ? 'sticky-note' : 'file'" />
          {{ $t("document.page.orientation." + pageOrientation) }}
        </span>
      </input-switch>
      <div class="custom-format" v-if="internalValue.custom">
        <input-field type="number" v-model="width" class="small-input" />
        &times;
        <input-field type="number" v-model="height" class="small-input" />
        <dropdown v-model="unit" :items="units" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";
import { SelectBarEntry } from "@/components/app/ui/select-bar/SelectBar.vue";
import { PageFormat, PAGE_FORMATS, Units } from "@/models/document/pageFormat";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";

export default class PageSizeSelector extends Vue {
  @Prop({ type: Object, required: true })
  private readonly modelValue!: PageFormat;

  private get internalValue(): PageFormat {
    return this.modelValue;
  }

  private set internalValue(value: PageFormat) {
    this.$emit("update:modelValue", value);
  }

  private createCopy(): PageFormat {
    return {
      ...this.internalValue,
    };
  }

  private get pageFormats(): SelectBarEntry<PageFormat>[] {
    return Object.values(PAGE_FORMATS).map((format) => ({
      name: this.$t(format.label),
      data: format.label,
    }));
  }

  private get format(): string {
    return this.internalValue.label;
  }

  private set format(value: string) {
    const format = Object.values(PAGE_FORMATS).find((f) => f.label === value);
    if (format) {
      this.internalValue = format;
    }
  }

  private get pageOrientation(): string {
    if (this.internalValue.height > this.internalValue.width) {
      return "portrait";
    } else if (this.internalValue.height < this.internalValue.width) {
      return "landscape";
    } else {
      return "square";
    }
  }

  private get portrait(): boolean {
    return this.pageOrientation === "portrait";
  }

  private set portrait(value: boolean) {
    const copy = this.createCopy();
    const oldHeight = copy.height;
    copy.height = copy.width;
    copy.width = oldHeight;
    this.internalValue = copy;
  }

  private get width(): number {
    return this.internalValue.width;
  }

  private set width(value: number) {
    const copy = this.createCopy();
    copy.width = value;
    this.internalValue = copy;
  }

  private get height(): number {
    return this.internalValue.height;
  }

  private set height(value: number) {
    const copy = this.createCopy();
    copy.height = value;
    this.internalValue = copy;
  }

  private get units(): DropdownItem<string, string> {
    return Object.values(Units).map((unit) => ({ name: unit.suffix, value: unit.suffix }));
  }

  private get unit(): string {
    return this.internalValue.unit.suffix;
  }

  private set unit(value: string) {
    const unit = Object.values(Units).find((unit) => unit.suffix === value);
    if (unit) {
      const copy = this.createCopy();
      copy.unit = unit;
      this.internalValue = copy;
    }
  }
}
</script>

<style lang="scss" scoped>
.page-format-selector {
  .document-orientation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    min-height: 3rem;
  }

  .custom-format {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > *:not(:last-child) {
      margin-right: 1rem;
    }

    & > *:not(:first-child) {
      margin-left: 1rem;
    }

    .small-input {
      width: 4rem;
    }
  }

  .orientation {
    margin-left: 0.8rem;

    &.landscape {
      svg {
        transform: rotate(90deg) scaleX(-1);
      }
    }
  }
}
</style>
