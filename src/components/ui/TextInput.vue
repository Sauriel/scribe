<template>
  <input :type="type" v-model="internalValue" :disabled="disabled" :placeholder="placeholder" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TextInput extends Vue {
  @Prop()
  readonly value!: string | number;

  @Prop({ type: Boolean, default: false})
  readonly disabled!: boolean;

  @Prop({ type: String, default: "text" })
  readonly type!: string;

  @Prop(String)
  readonly placeholder?: string;

  private get internalValue(): string | number {
    return this.value;
  }

  private set internalValue(value: string | number) {
    if (!this.disabled) {
      this.$emit("input", this.type == "number" ? +value : value);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/colors.scss";

input {
  display: flex;
  align-items: center;
  min-height: 24px;
  width: 100%;
  border: none;
  background-color: transparent;
  color: $foreground;
  border-bottom: 2px solid $foreground;
  padding: 5px 10px;
  font-size: 1rem;

  &::placeholder {
    font-size: .8em;
  }

  &:focus {
    outline: none;
    border-bottom-color: $primary;
  }

  &:disabled {
    color: $foregroundDark;
    border-bottom-color: $foregroundDark;
    cursor: not-allowed;
  }
}
</style>
