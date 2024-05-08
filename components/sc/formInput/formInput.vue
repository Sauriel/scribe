<template>
  <div
    class="input-wrapper"
    :class="{ 'compact': hideError }"
  >
    <label
      class="label"
      :for="id"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      ref="input"
      v-model="value"
      class="input"
      :type="type"
      :required="required"
      :class="{
        'invalid': showError
      }"
      @input="validate"
      @change="validate"
      @blur="validate"
      @animationstart="checkAnimation"
    >
    <span
      class="placeholder"
      :class="{
        'placeholder--fade-out': !isEmpty
      }"
    >
      {{ placeholder }}
    </span>
    <span
      v-if="showError"
      class="error"
    >
      {{ errorMsg }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';

type InputType = 'text' | 'number' | 'password' | 'email';

type Props = {
  id: string;
  label: string;
  placeholder: string;
  modelValue: string | number;
  type?: InputType
  required?: boolean;
  pattern?: RegExp;
  errorMsg?: string;
  hideError?: boolean;
  onValidationCallback?: (model: string | number) => void;
  validateFn?: (model: string | number) => boolean;
}

type Emits = {
  'update:modelValue': [value: string | number],
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
});
const emit = defineEmits<Emits>();
const value = useVModel(props, 'modelValue', emit);

const input = ref<HTMLInputElement>();
const showError = ref<boolean>(false);
const isInvalid = ref<boolean>(true);

const isEmpty = computed<boolean>(() => props.modelValue === '');

function validate() {
  const validityState = input.value!.validity;
  let hasError = !validityState.valid;
  if (props.validateFn) {
    hasError = hasError || !props.validateFn(value.value);
  }
  if (props.pattern) {
    hasError = hasError || !props.pattern.test(value.value);
  }
  if (hasError && props.errorMsg) {
    showError.value = true;
    isInvalid.value = true;
  } else {
    showError.value = false;
    isInvalid.value = false;
  }
  if (props.onValidationCallback) {
    props.onValidationCallback(value.value);
  }
}

function checkAnimation($event: AnimationEvent) {
  const actionName = $event.animationName;
  if (actionName.includes('onAutoFillStart')) {
    validate();
  }
}

defineExpose({
  isInvalid
});
</script>

<style scoped>
.input-wrapper {
  display: grid;
  grid-template-areas: "label"
                       "input"
                       "error";
  grid-template-rows: 1em 2.2em 1.6em;
  gap: 0.2em;
}

.input-wrapper.compact {
  grid-template-areas: "label"
                       "input";
  grid-template-rows: 1em 2.2em;
}

.input-wrapper.compact .error {
  display: none;
}

.input-wrapper .label {
  grid-area: label;
  padding-left: var(--border-radius);
  color: var(--color-foreground-700);
  font-size: 0.8em;
}

.input-wrapper .input,
.input-wrapper .placeholder {
  grid-area: input;
  display: flex;
  align-items: center;
  padding: 0 0.5em;
}

.input-wrapper .input {
  background-color: var(--color-background-700);
  border: none;
  border-bottom: 2px solid var(--color-background-400);
  border-radius: var(--border-radius);
  color: var(--color-foreground-500);
}

.input-wrapper .placeholder {
  transition: opacity var(--animation);
  pointer-events: none;
  opacity: 0.2;
}

.input-wrapper .placeholder--fade-out {
    opacity: 0;
}

.input-wrapper .input {
  width: 100%;
  transition: background-color var(--animation), border-bottom-color var(--animation);
}

.input-wrapper .input.invalid {
  background-color: var(--color-alert-900);
  border-bottom-color: var(--color-alert-500);
}

.input-wrapper .input:hover {
  background-color: var(--color-background-600);
}

.input-wrapper .input:hover + .placeholder:not(.placeholder--fade-out) {
  opacity: 0.1;
}

.input-wrapper .input:focus {
  outline: none;
  border-bottom-color: var(--color-primary-500);
}

.input-wrapper .input:-webkit-autofill,
.input-wrapper .input:-webkit-autofill:hover,
.input-wrapper .input:-webkit-autofill:focus,
.input-wrapper .input:-webkit-autofill:active {
  -webkit-text-fill-color: var(--color-foreground-500);
  -webkit-background-clip: text;
}

.input-wrapper:has(.input:-webkit-autofill) {
  position: relative;
}

.input-wrapper:has(.input:-webkit-autofill)::before {
  content: "";
  grid-area: input;
  background-color: var(--color-background-700);
  border-radius: var(--border-radius);
}

.error {
  grid-area: error;
  color: var(--color-alert-500);
  font-size: 0.85em;
  padding: 0.25em 0.5em;
}

/* https://github.com/vuejs/vue/issues/1331#issuecomment-1156497182 */

.input:-webkit-autofill {
  animation: onAutoFillStart 1s;
}

:not(.input:-webkit-autofill) {
  animation: onAutoFillCancel 1s;
}

@keyframes onAutoFillStart {
  from {
  }
  to {
  }
}
@keyframes onAutoFillCancel {
  from {
  }
  to {
  }
}
</style>