<template>
  <label>
    <slot name="off-label" />
    <input
      class="input-switch"
      type="checkbox"
      role="switch"
      v-model="internalValue"
      :disabled="disabled"
      :class="{ 'has-label': $slots.default }"
    />
    <slot />
  </label>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";

export default class InputSwitch extends Vue {
  @Prop({ type: Boolean, required: true })
  private readonly modelValue!: boolean;

  @Prop({ type: Boolean, default: false })
  private readonly disabled!: boolean;

  private get internalValue(): boolean {
    return this.modelValue;
  }

  private set internalValue(value: boolean) {
    this.$emit("update:modelValue", value);
  }
}
</script>

<style lang="scss" scoped>
label {
  display: flex;
  align-items: center;
}

.input-switch {
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  display: inline-block;
  width: 2.4em;
  height: 1.4em;
  margin: -0.2em 0;
  box-sizing: content-box;
  padding: 0;
  border: none;
  border-radius: 0.7em;
  background: var(--color-background--light);
  box-shadow: 0 0.15em 0.25em rgba(0, 0, 0, 0.5) inset, 0 -0.5px 0 rgba(255, 255, 255, 0.2) inset;
  transition: background-color 250ms ease, box-shadow 250ms ease;
  font-size: 100%;
  text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  user-select: none;
  outline: none;
  cursor: pointer;

  &.has-label {
    margin-right: 0.5em;
  }
}

.input-switch::before {
  content: "";
  display: flex;
  align-content: center;
  justify-content: center;
  position: absolute;
  width: 1em;
  height: 1em;
  left: 0;
  top: 0;
  background: #fff;
  box-shadow: 0 1px 1px #fff inset, 0 0.2em 0.5em rgba(255, 255, 255, 0.7) inset,
    0 -0.2em 0.3em rgba(0, 0, 0, 0.2) inset, 0 0.05em 0.25em rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  transform: translate(20%, 20%);
  transition: transform 250ms ease;
  color: rgba(0, 0, 0, 0.3);
  line-height: 1;
}

.input-switch:focus::before {
  background: rgba(255, 255, 255, 0.9);
}

.input-switch:checked {
  background-color: var(--color-primary);
}

.input-switch:focus-visible {
  box-shadow: 0 0.15em 0.25em rgba(0, 0, 0, 0.5) inset, 0 -0.5px 0 rgba(255, 255, 255, 0.2) inset,
    0 0 0 2px rgba(255, 255, 255, 0.8), 0 0 0 4px var(--color-secondary);
}

.input-switch:checked::before {
  transform: translate(120%, 20%);
}

.input-switch:indeterminate::before {
  transform: translate(70%, 20%);
  content: "-";
}

.input-switch:disabled {
  cursor: not-allowed;

  &:before {
    opacity: 0.4;
  }
}
</style>
