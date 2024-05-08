<template>
  <div class="settings">
    <div
      class="setting"
      :class="{ 'setting--selected': setting.name == internalValue }"
      v-for="(setting, index) of settings"
      :key="'setting-entry-' + index"
      @click="internalValue = setting.name"
    >
      <img :src="setting.image" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";
import { Setting, SETTINGS } from "@/models/setting";

export default class SettingSelector extends Vue {
  @Prop({ type: String, required: true })
  private readonly modelValue!: string;

  private get internalValue(): string {
    return this.modelValue;
  }

  private set internalValue(value: string) {
    this.$emit("update:modelValue", value);
  }

  private get settings(): Setting[] {
    return Object.values(SETTINGS);
  }
}
</script>

<style lang="scss" scoped>
.settings {
  display: flex;

  .setting {
    width: 12rem;
    height: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--border-radius);
    cursor: pointer;

    &:hover {
      background-color: var(--color-background--light);
    }

    &--selected {
      background-color: var(--color-background--light);
      border: 2px solid var(--color-primary);
    }
  }
}
</style>
