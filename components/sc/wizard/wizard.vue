<template>
  <section class="wizard">
    <header class="stepper">
      <ScWizardStepper
        :steps="steps"
        :active-step-id="currentStepId"
        :progress="currentStepProgress"
        @step:click="onStepClick"
      />
    </header>
    <section
      class="step"
      :class="transitionType"
    >
      <Transition
        :name="transitionType"
        mode="in-out"
        @before-enter="beforeEnter"
        @after-enter="afterEnter"
      >
        <slot
          :name="currentStep.name"
          classes="step-slide"
          :index="currentStepId"
          :update-progress="updateProgress"
        />
      </Transition>
    </section>
    <footer class="actions">
      <ScBtn
        :disabled="!hasPreviousStep"
        @click="previous"
      >
        Previous
      </ScBtn>
      <ScBtn
        :disabled="!hasNextStep"
        @click="next"
      >
        Next
      </ScBtn>
    </footer>
  </section>
</template>

<script setup lang="ts">
import type { WizardStep } from '../../../models/sc/wizard/model';

declare type TransitionType = 'slide-in' | 'slide-out';

type WizardProps = {
  steps: WizardStep[];
}

// type Emits = {
//   (e: 'update', payload: string): void;
// }

const props = defineProps<WizardProps>();
// const emit = defineEmits<Emits>();

const currentStepId = ref(0);
const currentStepProgress = ref(0);

const slideIn = ref(true);
const startOldSlideOut = ref(false);

const currentStep = computed<WizardStep>(() => props.steps[currentStepId.value]);
const hasPreviousStep = computed<boolean>(() => currentStepId.value > 0);
const hasNextStep = computed<boolean>(() => currentStepId.value < props.steps.length - 1);
const transitionType = computed<TransitionType>(() => slideIn.value ? 'slide-in' : 'slide-out');

function previous() {
  if (hasPreviousStep.value) {
    slideIn.value = false;
    currentStepId.value--;
  }
}

function next() {
  if (hasNextStep.value) {
    slideIn.value = true;
    currentStepId.value++;
  }
}

function beforeEnter(element: Element) {
  const slides = document.getElementsByClassName('step-slide');
  for (const slide of slides) {
    if (slide !== element) {
      const className = slideIn.value ? 'step-slide--out' : 'step-slide--in';
      slide.classList.add(className);
    }
  }
  startOldSlideOut.value = true;
}

function afterEnter(_element: Element) {
  startOldSlideOut.value = false;
}

function onStepClick(index: number) {
  if (index > currentStepId.value) {
    slideIn.value = true;
    currentStepId.value = index;
  } else if (index < currentStepId.value) {
    slideIn.value = false;
    currentStepId.value = index;
  }
}

function updateProgress(index: number, progress: number) {
  if (index === currentStepId.value) {
    currentStepProgress.value = progress;
  }
}
</script>

<style scoped>
.wizard {
  display: grid;
  grid-template-areas: "header"
                       "step"
                       "footer";
  grid-template-rows: 3rem auto 2rem;
  gap: 1rem;
}

.stepper {
  grid-area: header;
  padding: 0 8%;
}

.step {
  grid-area: step;
  min-height: 30vh;
  max-height: calc(100vh - 40px - 30px - 3rem - 2rem - 2rem - 270px);
  /* 40px = App Header, 30px = App Footer, 3rem = Wizard Stepper, 2rem = Wizard Footer, 2rem = 2 x 1rem Gap, 270px = Place needed for Logo on bottom*/
  position: relative;
  overflow-x: hidden;
  --animation-duration: 0.5s;
}

.actions {
  grid-area: footer;
  display: flex;
  justify-content: space-between;
}

.step-slide {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.step-slide--in,
.step-slide--out,
.slide-out-enter-active,
.slide-in-enter-active {
  position: absolute;
  top: 0;
  transition: transform var(--animation-duration) ease-out;
  z-index: 2;
}

.slide-out-leave-active,
.slide-in-leave-active {
  position: absolute !important;
  top: 0;
  transition: transform var(--animation-duration) cubic-bezier(1, 0.5, 0.8, 1);
  z-index: -1 !important;
}

.step-slide--in,
.slide-out-leave-to,
.slide-in-enter-from {
  transform: translateX(100%);
}

.step-slide--out,
.slide-out-enter-from,
.slide-in-leave-to {
  transform: translateX(-100%);
}
</style>