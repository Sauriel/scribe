<template>
  <section class="base-settings">
    <ScFormInput
      id="name"
      v-model="doc.name"
      :label="$t('doc.create.steps.base.name.label')"
      :placeholder="$t('doc.create.steps.base.name.placeholder')"
      required
      hide-error
    />
    <section class="config">
      <header class="header">
        {{ $t('doc.create.steps.base.description.label') }}
      </header>
      <ScTextarea
        v-model="doc.description"
        compact
        :placeholder="$t('doc.create.steps.base.description.placeholder')"
      />
    </section>
    <section class="config">
      <header class="header">
        {{ $t('doc.create.steps.base.page.header') }}
      </header>
      <DocPageSize
        v-model:unit="doc.unit"
        v-model:width="doc.width"
        v-model:height="doc.height"
      />
    </section>
    <section class="config">
      <header class="header">
        {{ $t('doc.create.steps.base.project.header') }}
      </header>
      <div class="config-row">
        <ScSelect
          v-model="doc.project"
          :items="projects"
          :placeholder="$t('doc.create.steps.base.project.select.placeholder')"
          :width="200"
          max-height="200px"
          single-line
          top
        />
        <span>
          {{ $t('doc.create.steps.base.project.text') }}
        </span>
        <ScIconBtn
          icon="mdi:book-plus"
          small
        />
      </div>
    </section>
    <section class="config">
      <header class="header">
        {{ $t('doc.create.steps.base.community.header') }}
      </header>
      <div class="config-row">
        <ScIconSwitch
          v-model="doc.private"
          icon-on="ph:lock-key-fill"
          icon-off="ph:lock-key-open-fill"
        >
          <template #on>
            {{ $t('doc.create.steps.base.community.private') }}
          </template>
          <template #off>
            {{ $t('doc.create.steps.base.community.public') }}
          </template>
        </ScIconSwitch>
        <ScCheckbox
          v-if="!doc.private"
          v-model="doc.allowComments"
        >
          {{ $t('doc.create.steps.base.community.allow-comments') }}
        </ScCheckbox>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import type { UpdateProgressFunction } from '@/models/sc/wizard/model';
import type ScribeDoc from '@/models/document/document';
import { useVModel } from '@vueuse/core';

type Props = {
  index: number;
  modelValue: ScribeDoc;
  updateProgress: UpdateProgressFunction;
}

type Emits = {
  (e: 'update:modelValue', value: ScribeDoc): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const doc = useVModel(props, 'modelValue', emit)

onMounted(calculateProgress);
watch(doc, calculateProgress, { deep: true });

const projects = ref<string[]>([
  'Tasha\'s Cauldron of Everything',
  'Explorer\'s Guide to Wildemount',
  'Guildmasters\' Guide to Ravnica',
  'Mordenkainen Presents: Monsters of the Multiverse',
  'Xanathar\'s Guide to Everything',
  'Eberron: Rising from the Last War',
  'Curse of Strahd',
]);

function calculateProgress() {
  const completedMax = 3;
  let completed = 0;
  // check if name is filled
  if (!isEmpty(doc.value.name)) {
    completed++;
  }
  // check if description is filled
  if (!isEmpty(doc.value.description)) {
    completed++;
  }
  // check if size is set
  if (doc.value.width > 0 && doc.value.height > 0) {
    completed++;
  }
  const progress = (1 / completedMax) * completed;
  props.updateProgress(props.index, progress);
}
</script>

<style scoped>
.base-settings {
  display: flex;
  flex-direction: column;
  gap: 1.2em;
}

.config {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}

.config .config-row {
  display: flex;
  align-items: center;
  gap: 1em;
}

.header {
  color: var(--color-foreground-700);
  font-size: 0.8em;
  padding-left: var(--border-radius);
}
</style>