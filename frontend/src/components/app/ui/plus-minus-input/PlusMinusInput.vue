<template>
  <div class="plus-minus-input" :class="{ 'plus-minus-input--small': small }" @wheel.stop="onWheel">
    <font-awesome-icon icon="minus" @click="minus" />
    <menu-dropdown
      v-if="hasDropdown"
      position="center"
      :top="dropdownTop"
      v-model="internalValue"
      :items="presetList"
    >
      <input-field type="number" v-model="internalValue" :suffix="suffix" />
    </menu-dropdown>
    <input-field v-else type="number" v-model="internalValue" />
    <font-awesome-icon icon="plus" @click="plus" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Options } from "vue-property-decorator";
import MenuDropdown, { DropdownEntry } from "@/components/app/ui/menu-dropdown/MenuDropdown.vue";

@Options({
  components: {
    MenuDropdown,
  },
})
export default class PlusMinusInput extends Vue {
  @Prop({ type: Number, required: true })
  private readonly modelValue!: number;

  @Prop({ type: Number, default: 1 })
  private readonly scale!: number;

  @Prop(Number)
  private readonly min?: number;

  @Prop(Number)
  private readonly max?: number;

  @Prop({ type: Array, default: [] })
  private readonly presets!: number[];

  @Prop(String)
  private readonly suffix?: string;

  @Prop({ type: Boolean, default: false })
  private readonly small!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly dropdownTop!: boolean;

  private onWheel(event: WheelEvent) {
    if (event.deltaY < 0) {
      this.plus();
    }
    if (event.deltaY > 0) {
      this.minus();
    }
  }

  private get internalValue(): number {
    return this.modelValue;
  }

  private set internalValue(value: number) {
    this.$emit("update:modelValue", value);
  }

  private plus() {
    if (this.max === undefined || this.internalValue < this.max) {
      this.internalValue = this.internalValue + this.scale;
    }
  }

  private minus() {
    if (this.min === undefined || this.internalValue > this.min) {
      this.internalValue = this.internalValue - this.scale;
    }
  }

  private get hasDropdown(): boolean {
    return this.presets.length > 0;
  }

  private get presetList(): DropdownEntry[] {
    return this.presets.map((preset) => this.toDropdownEntry(preset));
  }

  private toDropdownEntry(preset: number): DropdownEntry {
    const suffix = this.suffix ? this.suffix : "";
    return {
      label: "" + preset + suffix,
      value: preset,
    };
  }
}
</script>

<style lang="scss" scoped>
.plus-minus-input {
  display: flex;
  justify-content: center;
  align-items: center;

  &--small {
    font-size: 0.75em;
  }

  svg {
    cursor: pointer;

    &:hover {
      color: var(--color-foreground--dark);
    }
  }

  &:deep(input) {
    width: 5em;
    margin: 0 1em;
    text-align: center;
  }
}
</style>
