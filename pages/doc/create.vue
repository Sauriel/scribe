<template>
  <ClientOnly>
    <LayoutMainCentered>
      <ScFloatingPanel :title="$t('doc.create.header')">
        <ScWizard
          :steps="steps"
        >
          <template #base="{ index, classes, updateProgress }">
            <DocCreateWizardStepBase
              v-if="doc"
              v-model="doc"
              :index="index"
              :class="classes"
              :update-progress="updateProgress"
            />
          </template>
          <template #presets="{ index, classes, updateProgress }">
            <DocCreateWizardStepPresets
              v-if="doc"
              v-model="doc"
              :index="index"
              :class="classes"
              :update-progress="updateProgress"
            />
          </template>
          <template #settings="{ index, classes, updateProgress }">
            <DocCreateWizardStepSettings
              v-if="doc"
              v-model="doc"
              :index="index"
              :class="classes"
              :update-progress="updateProgress"
            />
          </template>
        </ScWizard>
      </ScFloatingPanel>
    </LayoutMainCentered>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type ScribeDoc from '@/models/document/document';
import type { WizardStep } from '../../models/sc/wizard/model';

const { t } = useI18n();
const { createNew } = useScribeDoc();

const steps: WizardStep[] = [
  {
    icon: 'heroicons:document-text-solid',
    name: 'base',
    header: t('doc.create.steps.base.header')
  },
  {
    icon: 'fluent:box-multiple-20-filled',
    name: 'presets',
    header: t('doc.create.steps.presets.header')
  },
  {
    icon: 'octicon:settings',
    name: 'settings',
    header: t('doc.create.steps.settings.header')
  }
];

const doc = ref<ScribeDoc | null>(null);

onMounted(() => {
  doc.value = createNew();
})
</script>

<style scoped>
/* ToDo: Add style content */
</style>