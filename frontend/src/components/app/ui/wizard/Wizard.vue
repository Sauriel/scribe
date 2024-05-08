<template>
  <div class="wizard">
    <header class="wizard-step-header">
      <div
        v-for="(step, index) in steps"
        :key="'ws-' + index"
        class="step-wrapper"
        :class="{
          'step-wrapper--active': step === currentStep,
        }"
        @click="changeStep(index)"
      >
        <div class="step">
          <div class="step-circle">
            <span>{{ index + 1 }}</span>
          </div>
          <div class="step-label">
            {{ $t(step.label) }}
          </div>
          <div class="step-sub-label" v-if="step.subLabel">
            {{ $t(step.subLabel) }}
          </div>
        </div>
      </div>
    </header>
    <div class="wizard-step">
      <div class="wizard-step-content" v-if="!loading">
        <transition
          :name="transitionType"
          mode="in-out"
          @before-enter="beforeEnter"
          @after-enter="afterEnter"
        >
          <component
            class="step-slide"
            :is="currentStep.component"
            :model="model"
            @step:reload="reloadStep"
          />
        </transition>
      </div>
      <footer class="wizard-step-footer">
        <div v-if="previousLabel" class="wizard-step-footer-button">
          <btn outline @click="back">
            <font-awesome-icon icon="chevron-left" v-if="!currentStep.previousConfig" />
          </btn>
          <span class="wizard-step-footer-button-label">
            {{ $t(previousLabel) }}
          </span>
        </div>
        <div v-else />
        <div v-if="nextLabel" class="wizard-step-footer-button">
          <span class="wizard-step-footer-button-label">
            {{ $t(nextLabel) }}
          </span>
          <btn outline @click="next">
            <font-awesome-icon icon="chevron-right" v-if="!currentStep.nextConfig" />
          </btn>
        </div>
        <div v-else />
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";

declare type TransitionType = "slide-in" | "slide-out";

export interface StepActionConfig {
  label: string;
  callback: () => void;
}

export interface WizardStepModel<T> {
  model: T;
  activeStepIndex?: number;
  focus?: any;
}

export interface WizardStep {
  label: string;
  subLabel?: string;
  component: string;
  previousConfig?: StepActionConfig;
  nextConfig?: StepActionConfig;
}

export interface WizardStepChangeEvent {
  from: WizardStep;
  to: WizardStep;
}

export default class Wizard extends Vue {
  @Prop({ type: Array, required: true })
  private readonly steps!: WizardStep[];

  @Prop({ type: Object, required: true })
  private readonly model!: WizardStepModel<unknown>;

  private loading = false;
  private slideIn = true;
  private startOldSlideOut = false;

  private currentStepIndex = 0;

  private get transitionType(): TransitionType {
    return this.slideIn ? "slide-in" : "slide-out";
  }

  beforeMount() {
    if (this.model.activeStepIndex !== undefined) {
      this.currentStepIndex = this.model.activeStepIndex;
    }
  }

  private reloadStep() {
    // This is a hack, so that a few things can rerender
    this.loading = true;
    this.$nextTick(() => {
      this.loading = false;
    });
  }

  private get currentStep(): WizardStep {
    return this.steps[this.currentStepIndex];
  }

  private get previousLabel(): string | null {
    const stepId = this.currentStepIndex - 1;
    if (stepId >= 0) {
      const step = this.steps[stepId];
      return step.label;
    } else if (this.currentStep.previousConfig) {
      return this.currentStep.previousConfig.label;
    } else {
      return null;
    }
  }

  private get nextLabel(): string | null {
    const stepId = this.currentStepIndex + 1;
    if (stepId < this.steps.length) {
      const step = this.steps[stepId];
      return step.label;
    } else if (this.currentStep.nextConfig) {
      return this.currentStep.nextConfig.label;
    } else {
      return null;
    }
  }

  private next() {
    this.slideIn = true;
    if (this.currentStep.nextConfig) {
      this.currentStep.nextConfig.callback();
    } else {
      const from = this.steps[this.currentStepIndex];
      this.currentStepIndex++;
      const event: WizardStepChangeEvent = {
        from: from,
        to: this.steps[this.currentStepIndex],
      };
      this.$emit("step:next", event);
    }
  }

  private back() {
    this.slideIn = false;
    if (this.currentStep.previousConfig) {
      this.currentStep.previousConfig.callback();
    } else {
      const from = this.steps[this.currentStepIndex];
      this.currentStepIndex--;
      const event: WizardStepChangeEvent = {
        from: from,
        to: this.steps[this.currentStepIndex],
      };
      this.$emit("step:back", event);
    }
  }

  private changeStep(index: number) {
    if (this.currentStepIndex > index) {
      this.slideIn = false;
      this.currentStepIndex = index;
    } else if (this.currentStepIndex < index) {
      this.slideIn = true;
      this.currentStepIndex = index;
    }
  }

  private beforeEnter(element: HTMLDivElement) {
    const slides = document.getElementsByClassName("step-slide");
    for (const slide of slides) {
      if (slide !== element) {
        const className = this.slideIn ? "step-slide--out" : "step-slide--in";
        slide.classList.add(className);
      }
    }
    this.startOldSlideOut = true;
  }

  private afterEnter(element: HTMLDivElement) {
    this.startOldSlideOut = false;
  }
}
</script>

<style lang="scss" scoped>
.wizard {
  overflow: hidden;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;

  &-step {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1 0 0;

    &-header {
      display: flex;
      justify-content: space-around;
      font-size: 0.75em;
      margin: 0.5em 0 1em;
      z-index: 0;

      .step-wrapper {
        position: relative;
        flex: 1 0 0;

        &::before,
        &::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 1em;
          height: 0.2em;
          background-color: var(--color-primary);
          z-index: 1;
        }

        &::before {
          right: 50%;
        }

        &::after {
          left: 50%;
        }

        &:first-child {
          &::before {
            display: none;
          }
        }

        &:last-child {
          &::after {
            display: none;
          }
        }

        .step {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          z-index: 2;
          cursor: pointer;

          &-circle {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2em;
            height: 2em;
            border-radius: 50%;
            background-color: var(--color-primary);
            color: var(--color-foreground);
            margin-bottom: 1em;
          }

          &-label {
            color: var(--color-foreground--dark);
            text-align: center;
            line-height: 1.4;
          }

          &-sub-label {
            color: var(--color-foreground--dark);
            font-size: 0.9em;
            font-style: italic;
            text-align: center;
            line-height: 1.4;
          }
        }

        &--active ~ .step-wrapper {
          .step-circle {
            background-color: var(--color-foreground);
            color: var(--color-background);
          }

          &::before,
          &::after {
            background-color: var(--color-foreground);
          }
        }

        &--active {
          .step-circle {
            font-weight: bold;
          }

          .step-label {
            font-weight: bold;
            color: var(--color-foreground);
          }

          &::after {
            background-color: var(--color-foreground);
          }
        }
      }
    }

    &-content {
      position: relative;
      flex: 1 1 auto;
      margin-bottom: 1rem;

      & > .step-slide {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        padding-right: 2px;
      }
    }

    &-footer {
      display: flex;
      justify-content: space-between;
      gap: 1em;

      &-button {
        display: flex;
        align-items: center;
        gap: 1em;
        flex-basis: 0;

        &-label {
          white-space: nowrap;
        }

        button {
          margin: 0;
        }
      }
    }
  }
}

.step-slide,
.slide-out-enter-active,
.slide-in-enter-active {
  position: absolute;
  top: 0;
  transition: transform 0.5s ease-out;
  background-color: var(--color-background);
  z-index: 2;
}

.slide-out-leave-active,
.slide-in-leave-active {
  position: absolute !important;
  top: 0;
  transition: transform 0.5s cubic-bezier(1, 0.5, 0.8, 1);
  background-color: var(--color-background);
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
