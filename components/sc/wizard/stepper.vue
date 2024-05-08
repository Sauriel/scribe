<template>
  <nav class="stepper">
    <template
      v-for="(step, index) of steps"
      :key="index"
    >
      <ScTooltip
        tag="div"
        top
        class="step"
        no-wrap
        :class="{
          'step--active': activeStepId === index
        }"
        :tooltip="step.header"
        @click="emit('step:click', index)"
      >
        <Icon :name="step.icon" />
      </ScTooltip>
      <hr
        v-if="index < steps.length - 1"
        class="step-separator"
      >
    </template>
  </nav>
</template>

<script setup lang="ts">
import type { WizardStep } from '../../../models/sc/wizard/model';

type WizardStepperProps = {
  steps: WizardStep[];
  activeStepId: number;
  progress: number;
}

type Emits = {
  (e: 'step:click', index: number): void;
}

const props = defineProps<WizardStepperProps>();
const emit = defineEmits<Emits>();
</script>

<style scoped>
.stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 0.75em;
}

.step {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-primary-500);
  color: var(--color-foreground-500);
  border: 1px solid var(--color-primary-500);
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  font-size: 2.5em;
  cursor: pointer;
  transition: all var(--animation);
}

.step.step--active {
  border-color: var(--color-foreground-500);
}

.step.step--active ~ .step {
  background-color: var(--color-foreground-500);
  color: var(--color-background-500);
  border: 1px solid var(--color-foreground-500);
}

.step:hover,
.step.step--active ~ .step:hover {
  background-color: var(--color-primary-400);
  color: var(--color-foreground-600);
  border-color: var(--color-foreground-600);
}

.step-separator {
  flex: 1 1 auto;
  margin: 0;
  border: none;
  height: 4px;
  background-color: var(--color-primary-500);
  width: 100%;
  border-radius: 100px;
}

.step.step--active ~ .step-separator {
  background-color: var(--color-foreground-500);
}

.step.step--active + .step-separator {
  --progressPercentage: calc(100% * v-bind(progress));
  background: linear-gradient(to right, var(--color-primary-500), var(--color-primary-500) var(--progressPercentage), var(--color-foreground-500) var(--progressPercentage));
}
</style>